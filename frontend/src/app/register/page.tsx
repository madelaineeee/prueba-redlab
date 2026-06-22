"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmar) return setError("Las contraseñas no coinciden.");
    setLoading(true);
    try {
      await api.post("/auth/register", { nombre, email, password });
      router.push("/login");
    } catch (err: unknown) {
        const errorData = (err as { response?: { data?: { errores?: string[], message?: string } } })?.response?.data;
        const erroresEspecificos = errorData?.errores?.join(" ");
        const message = erroresEspecificos || errorData?.message || "Error al registrarse.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-2/5 bg-slate-900 flex-col items-center justify-center p-10 text-white">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
          <UserPlus size={40} />
        </div>
        <h1 className="text-2xl font-bold text-center">Crear cuenta</h1>
        <p className="text-slate-400 text-sm text-center mt-2">
          Completa los datos para crear tu cuenta.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registro de usuario</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Tu nombre"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ejemplo@correo.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
              <input type={showPassword ? "text" : "password"} value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium text-sm">
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}