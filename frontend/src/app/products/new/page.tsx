"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Cookies from "js-cookie";
import { ArrowLeft } from "lucide-react";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState("true");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nombre.trim()) return setError("El nombre es requerido.");
    if (!precio || Number(precio) <= 0) return setError("El precio debe ser mayor a 0.");
    setLoading(true);
    try {
      await api.post("/productos", {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        precio: Number(precio),
        estado: estado === "true",
      });
      router.push("/products");
    } catch {
      setError("Error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push("/products")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={16} /> Volver
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">Productos</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-700">Nuevo</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Nuevo producto</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del producto"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} min="0" step="0.01" placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} placeholder="Descripción del producto (opcional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario creación</label>
                <input type="text" value={Cookies.get("userEmail") || ""} disabled
                  className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha creación</label>
                <input type="text" value={new Date().toLocaleDateString("es-ES")} disabled
                  className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-500 text-sm" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.push("/products")}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium">
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}