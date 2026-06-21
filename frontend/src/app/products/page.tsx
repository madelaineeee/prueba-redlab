"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { Producto, ProductoCreateUpdate, ResultadoPaginado } from "@/types";
import ProductoModal from "@/components/ProductoModal";

export default function ProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaInput, setBusquedaInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const tamanoPagina = 10;

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ResultadoPaginado<Producto>>("/productos", {
        params: { pagina, tamanoPagina, busqueda: busqueda || undefined },
      });
      setProductos(data.items);
      setTotalPaginas(data.totalPaginas);
      setTotalItems(data.totalItems);
    } catch {
      // Si falla la carga, probablemente el token expiró (el interceptor redirige)
    } finally {
      setLoading(false);
    }
  }, [pagina, busqueda]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setBusqueda(busquedaInput);
    setPagina(1); // Volvemos a la primera página al buscar
  };

  const handleNuevo = () => {
    setProductoEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setModalAbierto(true);
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás segura de que quieres eliminar este producto?")) return;
    setEliminandoId(id);
    try {
      await api.delete(`/productos/${id}`);
      cargarProductos();
    } finally {
      setEliminandoId(null);
    }
  };

  const handleGuardar = async (data: ProductoCreateUpdate) => {
    if (productoEditando) {
      await api.put(`/productos/${productoEditando.id}`, data);
    } else {
      await api.post("/productos", data);
    }
    cargarProductos();
  };

  const handleDescargarPDF = async () => {
    try {
      const response = await api.get("/reporte/productos", {
        responseType: "blob", // Indica que la respuesta es un archivo
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `productos_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Error al generar el reporte.");
    }
  };

  const handleCerrarSesion = () => {
    Cookies.remove("token");
    Cookies.remove("userEmail");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Gestión de Productos</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {Cookies.get("userEmail")}
          </span>
          <button
            onClick={handleCerrarSesion}
            className="text-sm text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Barra de acciones */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <form onSubmit={handleBuscar} className="flex gap-2 flex-1">
            <input
              type="text"
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Buscar
            </button>
          </form>

          <div className="flex gap-2">
            <button
              onClick={handleDescargarPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Descargar PDF
            </button>
            <button
              onClick={handleNuevo}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              + Nuevo Producto
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-900">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-900">Descripción</th>
                <th className="text-left px-4 py-3 font-medium text-gray-900">Precio</th>
                <th className="text-left px-4 py-3 font-medium text-gray-900">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-900">Creado por</th>
                <th className="text-left px-4 py-3 font-medium text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No hay productos.
                  </td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{p.descripcion || "-"}</td>
                    <td className="px-4 py-3 text-gray-800">${p.precio.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.estado
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.usuarioCreacion}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditar(p)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(p.id)}
                          disabled={eliminandoId === p.id}
                          className="text-red-600 hover:underline text-sm disabled:opacity-50"
                        >
                          {eliminandoId === p.id ? "..." : "Eliminar"}
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
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>{totalItems} productos en total</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              disabled={pagina === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-40 hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
              disabled={pagina === totalPaginas || totalPaginas === 0}
              className="px-3 py-1 border rounded-md disabled:opacity-40 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal de crear/editar */}
      {modalAbierto && (
        <ProductoModal
          producto={productoEditando}
          onClose={() => setModalAbierto(false)}
          onSave={handleGuardar}
        />
      )}
    </div>
  );
}