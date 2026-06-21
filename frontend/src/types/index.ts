export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: boolean;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}

export interface ProductoCreateUpdate {
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: boolean;
}

export interface ResultadoPaginado<T> {
  items: T[];
  totalItems: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  nombre: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  nombre: string;
  email: string;
  password: string;
}