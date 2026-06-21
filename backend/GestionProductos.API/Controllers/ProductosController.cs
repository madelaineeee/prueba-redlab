using GestionProductos.API.DTOs;
using GestionProductos.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestionProductos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Todos los endpoints requieren login
public class ProductosController : ControllerBase
{
    private readonly IProductoService _productoService;

    public ProductosController(IProductoService productoService)
    {
        _productoService = productoService;
    }

    // GET api/productos?pagina=1&tamanoPagina=10&busqueda=camisa
    [HttpGet]
    public async Task<IActionResult> ObtenerTodos([FromQuery] PaginacionDTO paginacion)
    {
        var resultado = await _productoService.ObtenerTodosAsync(paginacion);
        return Ok(resultado);
    }

    // GET api/productos/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> ObtenerPorId(Guid id)
    {
        var producto = await _productoService.ObtenerPorIdAsync(id);
        return producto is null ? NotFound() : Ok(producto);
    }

    // POST api/productos
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] ProductoCreateUpdateDTO dto)
    {
        // Obtenemos el email del usuario desde el token JWT
        var email = User.Identity?.Name ?? "sistema";
        var producto = await _productoService.CrearAsync(dto, email);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = producto.Id }, producto);
    }

    // PUT api/productos/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Actualizar(Guid id, [FromBody] ProductoCreateUpdateDTO dto)
    {
        var email = User.Identity?.Name ?? "sistema";
        var producto = await _productoService.ActualizarAsync(id, dto, email);
        return producto is null ? NotFound() : Ok(producto);
    }

    // DELETE api/productos/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Eliminar(Guid id)
    {
        var eliminado = await _productoService.EliminarAsync(id);
        return eliminado ? NoContent() : NotFound();
    }
}