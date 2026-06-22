"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Package, LogOut, Box } from "lucide-react";

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
      {icon}
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userEmail");
    Cookies.remove("userNombre");
    router.push("/login");
  };

  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col text-white shrink-0">
      <div className="p-5 flex items-center gap-3 border-b border-slate-700">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <Box size={20} />
        </div>
        <span className="font-bold text-sm leading-tight">Gestión de<br />Productos</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <NavItem href="/products" label="Productos" icon={<Package size={18} />} active={pathname.startsWith("/products")} />
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors w-full px-3 py-2.5 rounded-lg hover:bg-slate-700">
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}