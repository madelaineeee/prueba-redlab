"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Producto, ResultadoPaginado } from "@/types";
import Sidebar from "@/components/Sidebar";
import { Pencil, Trash2, Plus } from "lucide-react";
import Cookies from "js-cookie";

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
  const userEmail = Cookies.get("userEmail");
  const tamanoPagina = 5;

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = {
        pagina,
        tamanoPagina,
        ordenarPor,
      };
      if (busqueda) params.busqueda = busqueda;
      if (estadoFiltro !== "") params.estado = estadoFiltro === "true";

      const { data } = await api.get<ResultadoPaginado<Producto>>(
        "/productos",
        { params }
      );
      setProductos(data.items);
      setTotalItems(data.totalItems);
      setTotalPaginas(data.totalPaginas);
    } finally {
      setLoading(false);
    }
  }, [pagina, busqueda, estadoFiltro, ordenarPor]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

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

  const inicio = totalItems === 0 ? 0 : (pagina - 1) * tamanoPagina + 1;
  const fin = Math.min(pagina * tamanoPagina, totalItems);

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
          <span className="text-sm text-gray-500">{userEmail}</span>
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
            <select
              value={estadoFiltro}
              onChange={(e) => {
                setEstadoFiltro(e.target.value);
                setPagina(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <select
              value={ordenarPor}
              onChange={(e) => {
                setOrdenarPor(e.target.value);
                setPagina(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={() => router.push("/products/new")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors font-medium"
            >
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Descripción</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Precio</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha de creación</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No hay productos.
                  </td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {p.nombre}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {p.descripcion || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ${p.precio.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.estado
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(p.fechaCreacion).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/products/${p.id}/edit`)
                          }
                          title="Editar"
                          className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleEliminar(p.id)}
                          disabled={eliminandoId === p.id}
                          title="Eliminar"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        >
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
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>
            Mostrando {inicio} a {fin} de {totalItems} productos
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              disabled={pagina === 1}
              className="w-8 h-8 flex items-center justify-center border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              ‹
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPagina(n)}
                className={`w-8 h-8 flex items-center justify-center border rounded-lg transition-colors ${
                  n === pagina
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() =>
                setPagina((p) => Math.min(p + 1, totalPaginas))
              }
              disabled={pagina === totalPaginas || totalPaginas === 0}
              className="w-8 h-8 flex items-center justify-center border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              ›
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}