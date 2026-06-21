namespace GestionProductos.API.DTOs;

public class ProductoDTO
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal Precio { get; set; }
    public bool Estado { get; set; }
    public string UsuarioCreacion { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
    public string? UsuarioModificacion { get; set; }
    public DateTime? FechaModificacion { get; set; }
}

// Lo que envía el frontend para crear o editar
public class ProductoCreateUpdateDTO
{
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal Precio { get; set; }
    public bool Estado { get; set; }
}

// Para paginación, el frontend envía página y tamaño
public class PaginacionDTO
{
    public int Pagina { get; set; } = 1;
    public int TamanoPagina { get; set; } = 10;
    public string? Busqueda { get; set; }
}

// La respuesta paginada que devuelve la API
public class ResultadoPaginadoDTO<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalItems { get; set; }
    public int Pagina { get; set; }
    public int TamanoPagina { get; set; }
    public int TotalPaginas => (int)Math.Ceiling((double)TotalItems / TamanoPagina);
}