"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Producto, ResultadoPaginado } from "@/types";
import Sidebar from "@/components/Sidebar";
import { Pencil, Trash2, Plus, FileDown, Columns } from "lucide-react";
import Cookies from "js-cookie";

// Definición de columnas disponibles
const COLUMNAS_DISPONIBLES = [
  { key: "descripcion",         label: "Descripción" },
  { key: "precio",              label: "Precio" },
  { key: "estado",              label: "Estado" },
  { key: "fechaCreacion",       label: "Fecha creación" },
  { key: "usuarioCreacion",     label: "Creado por" },
  { key: "usuarioModificacion", label: "Modificado por" },
  { key: "fechaModificacion",   label: "Fecha modificación" },
];

type ColumnasState = Record<string, boolean>;

export default function ProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("recientes");
  const [loading, setLoading] = useState(true);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [userNombre, setUserNombre] = useState("");
  const [mostrarColumnas, setMostrarColumnas] = useState(false);
  const [columnasVisibles, setColumnasVisibles] = useState<ColumnasState>({
    descripcion:         true,
    precio:              true,
    estado:              true,
    fechaCreacion:       true,
    usuarioCreacion:     false,
    usuarioModificacion: false,
    fechaModificacion:   false,
  });

  const selectorRef = useRef<HTMLDivElement>(null);
  const tamanoPagina = 8;

  useEffect(() => {
    setUserNombre(Cookies.get("userNombre") || Cookies.get("userEmail") || "");
  }, []);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node))
        setMostrarColumnas(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = { pagina, tamanoPagina, ordenarPor };
      if (busqueda) params.busqueda = busqueda;
      if (estadoFiltro !== "") params.estado = estadoFiltro === "true";
      const { data } = await api.get<ResultadoPaginado<Producto>>("/productos", { params });
      setProductos(data.items);
      setTotalItems(data.totalItems);
      setTotalPaginas(data.totalPaginas);
    } finally {
      setLoading(false);
    }
  }, [pagina, busqueda, estadoFiltro, ordenarPor]);

  useEffect(() => { cargarProductos(); }, [cargarProductos]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setBusqueda(busquedaInput);
    setPagina(1);
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setEliminandoId(id);
    try {
      await api.delete(`/productos/${id}`);
      cargarProductos();
    } finally {
      setEliminandoId(null);
    }
  };

  const handleDescargarPDF = async () => {
    try {
      const colsActivas = ["nombre", ...Object.entries(columnasVisibles).filter(([, v]) => v).map(([k]) => k)].join(",");
      const response = await api.get("/reporte/productos", {
        responseType: "blob",
        params: { 
          columnas: colsActivas,
          busqueda: busqueda || undefined,
          estado: estadoFiltro !== "" ? (estadoFiltro === "true") : undefined,
          ordenarPor: ordenarPor
         },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte-productos.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Error al generar el reporte.");
    }
  };

  const toggleColumna = (key: string) => {
    setColumnasVisibles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const inicio = totalItems === 0 ? 0 : (pagina - 1) * tamanoPagina + 1;
  const fin = Math.min(pagina * tamanoPagina, totalItems);
  const columnasActivas = COLUMNAS_DISPONIBLES.filter(c => columnasVisibles[c.key]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
            <p className="text-sm text-gray-500">Administra tus productos</p>
          </div>
          {userNombre && (
            <span className="text-sm text-gray-500">
              Bienvenido, <span className="font-medium text-gray-700">{userNombre}</span>
            </span>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <form onSubmit={handleBuscar} className="flex flex-wrap gap-3">
            <input
              type="text"
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              placeholder="Buscar producto..."
              className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select value={estadoFiltro} onChange={(e) => { setEstadoFiltro(e.target.value); setPagina(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <select value={ordenarPor} onChange={(e) => { setOrdenarPor(e.target.value); setPagina(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
              Buscar
            </button>

            {/* Selector de columnas */}
            <div className="relative" ref={selectorRef}>
              <button type="button" onClick={() => setMostrarColumnas(!mostrarColumnas)}
                className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Columns size={16} />
                Columnas
              </button>
              {mostrarColumnas && (
                <div className="absolute top-11 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-20 min-w-52">
                  <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Columnas visibles</p>
                  <p className="text-xs text-gray-400 mb-2">El PDF incluirá las columnas activas.</p>
                  {COLUMNAS_DISPONIBLES.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                      <input type="checkbox" checked={columnasVisibles[key]} onChange={() => toggleColumna(key)} className="accent-indigo-600 w-4 h-4" />
                      <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button type="button" onClick={handleDescargarPDF}
              className="flex items-center gap-2 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 transition-colors">
              <FileDown size={16} />
              Descargar PDF
            </button>
            <button type="button" onClick={() => router.push("/products/new")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors font-medium">
              <Plus size={16} />
              Nuevo producto
            </button>
          </form>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
                {columnasActivas.map(c => (
                  <th key={c.key} className="text-left px-4 py-3 font-semibold text-gray-600">{c.label}</th>
                ))}
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={columnasActivas.length + 2} className="text-center py-10 text-gray-400">Cargando...</td></tr>
              ) : productos.length === 0 ? (
                <tr><td colSpan={columnasActivas.length + 2} className="text-center py-10 text-gray-400">No hay productos.</td></tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.nombre}</td>
                    {columnasVisibles.descripcion && <td className="px-4 py-3 text-gray-500">{p.descripcion || "-"}</td>}
                    {columnasVisibles.precio && <td className="px-4 py-3 text-gray-700">${p.precio.toFixed(2)}</td>}
                    {columnasVisibles.estado && (
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {p.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    )}
                    {columnasVisibles.fechaCreacion && (
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(p.fechaCreacion).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    )}
                    {columnasVisibles.usuarioCreacion && <td className="px-4 py-3 text-gray-500">{p.usuarioCreacion}</td>}
                    {columnasVisibles.usuarioModificacion && <td className="px-4 py-3 text-gray-500">{p.usuarioModificacion || "-"}</td>}
                    {columnasVisibles.fechaModificacion && (
                      <td className="px-4 py-3 text-gray-500">
                        {p.fechaModificacion ? new Date(p.fechaModificacion).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => router.push(`/products/${p.id}/edit`)} title="Editar"
                          className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleEliminar(p.id)} disabled={eliminandoId === p.id} title="Eliminar"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <div className="flex-1" />
          <div className="flex gap-1">
            <button onClick={() => setPagina(p => Math.max(p - 1, 1))} disabled={pagina === 1}
              className="w-8 h-8 flex items-center justify-center border rounded-lg disabled:opacity-40 hover:bg-gray-100">‹</button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPagina(n)}
                className={`w-8 h-8 flex items-center justify-center border rounded-lg transition-colors ${n === pagina ? "bg-indigo-600 text-white border-indigo-600" : "hover:bg-gray-100"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))} disabled={pagina === totalPaginas || totalPaginas === 0}
              className="w-8 h-8 flex items-center justify-center border rounded-lg disabled:opacity-40 hover:bg-gray-100">›</button>
          </div>
          <div className="flex-1 flex justify-end">
            <span>{inicio}–{fin} de {totalItems} productos</span>
          </div>
        </div>
      </main>
    </div>
  );
}