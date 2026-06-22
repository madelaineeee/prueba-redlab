using GestionProductos.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace GestionProductos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReporteController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReporteController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("productos")]
    public async Task<IActionResult> GenerarReporteProductos(
        [FromQuery] string? columnas,
        [FromQuery] string? busqueda,
        [FromQuery] bool? estado,
        [FromQuery] string? ordenarPor)
    {
        // Columnas activas — si no se envían, usa estas por defecto
        var activas = columnas?.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .ToHashSet(StringComparer.OrdinalIgnoreCase)
            ?? new HashSet<string>(StringComparer.OrdinalIgnoreCase)
               { "nombre", "descripcion", "precio", "estado", "fechaCreacion" };

        activas.Add("nombre"); // nombre siempre visible

        // Orden fijo de columnas
        var ordenColumnas = new[] { "nombre", "descripcion", "precio", "estado", "fechaCreacion", "usuarioCreacion", "usuarioModificacion", "fechaModificacion" };
        var columnasActivas = ordenColumnas.Where(c => activas.Contains(c)).ToList();

        var etiquetas = new Dictionary<string, string>
        {
            ["nombre"]              = "Nombre",
            ["descripcion"]         = "Descripción",
            ["precio"]              = "Precio",
            ["estado"]              = "Estado",
            ["fechaCreacion"]       = "Fecha Creación",
            ["usuarioCreacion"]     = "Creado por",
            ["usuarioModificacion"] = "Modificado por",
            ["fechaModificacion"]   = "Fecha Modificación"
        };

        var query = _context.Productos.AsQueryable();
        //Aplicar filtros a reporte
        if (!string.IsNullOrWhiteSpace(busqueda))
        {
            var busq = busqueda.ToLower();
            query = query.Where(p =>
                p.Nombre.ToLower().Contains(busq) ||
                (p.Descripcion != null && p.Descripcion.ToLower().Contains(busq)));
        }

        if (estado.HasValue)
            query = query.Where(p => p.Estado == estado.Value);
        
        query = (ordenarPor ?? "recientes") switch
        {
            "antiguos" => query.OrderBy(p => p.FechaCreacion),
            "nombre"   => query.OrderBy(p => p.Nombre),
            _          => query.OrderByDescending(p => p.FechaCreacion)
        };

        var productos = await query.ToListAsync();

        var pdf = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape()); // horizontal para más columnas
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(9).FontFamily("Arial"));

                page.Header().Column(col =>
                {
                    col.Item().Text("Reporte de Productos")
                        .FontSize(18).Bold().FontColor(Colors.Blue.Darken2);
                    col.Item().Text($"Generado el {DateTime.Now:dd/MM/yyyy HH:mm}")
                        .FontSize(8).FontColor(Colors.Grey.Darken1);
                    col.Item().PaddingTop(4).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
                });

                page.Content().PaddingTop(10).Column(mainCol =>
                {
                    mainCol.Item().Table(table =>
                    {
                        // Columnas iguales dinámicas
                        table.ColumnsDefinition(colsDef =>
                        {
                            foreach (var _ in columnasActivas)
                                colsDef.RelativeColumn();
                        });

                        // Encabezados
                        table.Header(h =>
                        {
                            foreach (var col in columnasActivas)
                                h.Cell().Background(Colors.Blue.Darken2).Padding(5)
                                    .Text(etiquetas[col]).FontColor(Colors.White).Bold();
                        });

                        // Filas
                        for (int i = 0; i < productos.Count; i++)
                        {
                            var p = productos[i];
                            var bg = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten4;

                            foreach (var col in columnasActivas)
                            {
                                var valor = col switch
                                {
                                    "nombre"              => p.Nombre,
                                    "descripcion"         => p.Descripcion ?? "-",
                                    "precio"              => $"${p.Precio:N2}",
                                    "estado"              => p.Estado ? "Activo" : "Inactivo",
                                    "fechaCreacion"       => p.FechaCreacion.ToLocalTime().ToString("dd/MM/yyyy HH:mm"),
                                    "usuarioCreacion"     => p.UsuarioCreacion,
                                    "usuarioModificacion" => p.UsuarioModificacion ?? "-",
                                    "fechaModificacion"   => p.FechaModificacion?.ToLocalTime().ToString("dd/MM/yyyy HH:mm") ?? "-",
                                    _                     => ""
                                };

                                var cell = table.Cell().Background(bg).Padding(5);
                                if (col == "estado")
                                    cell.Text(valor).FontColor(p.Estado ? Colors.Green.Darken2 : Colors.Red.Darken2);
                                else
                                    cell.Text(valor);
                            }
                        }
                    });

                    mainCol.Item().PaddingTop(10)
                        .Text($"Total de productos: {productos.Count}")
                        .Bold().FontSize(10);
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Página ");
                    x.CurrentPageNumber();
                    x.Span(" de ");
                    x.TotalPages();
                });
            });
        });

        var pdfBytes = pdf.GeneratePdf();
        return File(pdfBytes, "application/pdf", $"reporte-productos_{DateTime.Now:yyyyMMdd}.pdf");
    }
}