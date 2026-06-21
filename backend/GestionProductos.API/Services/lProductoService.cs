using GestionProductos.API.DTOs;

namespace GestionProductos.API.Services;

public interface IProductoService
{
    Task<ResultadoPaginadoDTO<ProductoDTO>> ObtenerTodosAsync(PaginacionDTO paginacion);
    Task<ProductoDTO?> ObtenerPorIdAsync(Guid id);
    Task<ProductoDTO> CrearAsync(ProductoCreateUpdateDTO dto, string usuarioEmail);
    Task<ProductoDTO?> ActualizarAsync(Guid id, ProductoCreateUpdateDTO dto, string usuarioEmail);
    Task<bool> EliminarAsync(Guid id);
}