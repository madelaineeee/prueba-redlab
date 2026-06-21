"use client";

import { useState, useEffect } from "react";
import { Producto, ProductoCreateUpdate } from "@/types";

interface Props {
  producto?: Producto | null;
  onClose: () => void;
  onSave: (data: ProductoCreateUpdate) => Promise<void>;
}

export default function ProductoModal({ producto, onClose, onSave }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si estamos editando, cargamos los datos del producto
  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || "");
      setPrecio(producto.precio.toString());
      setEstado(producto.estado);
    }
  }, [producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) return setError("El nombre es requerido.");
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0)
      return setError("El precio debe ser un número mayor a 0.");

    setLoading(true);
    try {
      await onSave({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        precio: Number(precio),
        estado,
      });
      onClose();
    } catch {
      setError("Error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fondo oscuro detrás del modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción opcional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Precio *
            </label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="estado"
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="estado" className="text-sm font-medium text-gray-900">
              Producto activo
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-900 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}