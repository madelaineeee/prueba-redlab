using GestionProductos.API.Data;
using GestionProductos.API.DTOs;
using GestionProductos.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GestionProductos.API.Services;

public class ProductoService : IProductoService
{
    private readonly ApplicationDbContext _context;

    public ProductoService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ResultadoPaginadoDTO<ProductoDTO>> ObtenerTodosAsync(PaginacionDTO paginacion)
    {
        var query = _context.Productos.AsQueryable();

        // Filtro de búsqueda por nombre o descripción
        if (!string.IsNullOrWhiteSpace(paginacion.Busqueda))
        {
            var busqueda = paginacion.Busqueda.ToLower();
            query = query.Where(p =>
                p.Nombre.ToLower().Contains(busqueda) ||
                (p.Descripcion != null && p.Descripcion.ToLower().Contains(busqueda)));
        }

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.FechaCreacion)
            .Skip((paginacion.Pagina - 1) * paginacion.TamanoPagina)
            .Take(paginacion.TamanoPagina)
            .Select(p => MapToDto(p))
            .ToListAsync();

        return new ResultadoPaginadoDTO<ProductoDTO>
        {
            Items = items,
            TotalItems = totalItems,
            Pagina = paginacion.Pagina,
            TamanoPagina = paginacion.TamanoPagina
        };
    }

    public async Task<ProductoDTO?> ObtenerPorIdAsync(Guid id)
    {
        var producto = await _context.Productos.FindAsync(id);
        return producto is null ? null : MapToDto(producto);
    }

    public async Task<ProductoDTO> CrearAsync(ProductoCreateUpdateDTO dto, string usuarioEmail)
    {
        var producto = new Producto
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Precio = dto.Precio,
            Estado = dto.Estado,
            UsuarioCreacion = usuarioEmail,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Productos.Add(producto);
        await _context.SaveChangesAsync();
        return MapToDto(producto);
    }

    public async Task<ProductoDTO?> ActualizarAsync(Guid id, ProductoCreateUpdateDTO dto, string usuarioEmail)
    {
        var producto = await _context.Productos.FindAsync(id);
        if (producto is null) return null;

        producto.Nombre = dto.Nombre;
        producto.Descripcion = dto.Descripcion;
        producto.Precio = dto.Precio;
        producto.Estado = dto.Estado;
        producto.UsuarioModificacion = usuarioEmail;
        producto.FechaModificacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(producto);
    }

    public async Task<bool> EliminarAsync(Guid id)
    {
        var producto = await _context.Productos.FindAsync(id);
        if (producto is null) return false;

        _context.Productos.Remove(producto);
        await _context.SaveChangesAsync();
        return true;
    }

    // Método privado para convertir Producto → ProductoDto
    private static ProductoDTO MapToDto(Producto p) => new()
    {
        Id = p.Id,
        Nombre = p.Nombre,
        Descripcion = p.Descripcion,
        Precio = p.Precio,
        Estado = p.Estado,
        UsuarioCreacion = p.UsuarioCreacion,
        FechaCreacion = p.FechaCreacion,
        UsuarioModificacion = p.UsuarioModificacion,
        FechaModificacion = p.FechaModificacion
    };
}