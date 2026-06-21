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

    // GET api/reporte/productos
    [HttpGet("productos")]
    public async Task<IActionResult> GenerarReporteProductos()
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var productos = await _context.Productos
            .OrderBy(p => p.Nombre)
            .ToListAsync();

        var pdf = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10));

                // Encabezado
                page.Header().Element(header =>
                {
                    header.Column(col =>
                    {
                        col.Item().Text("Reporte de Productos")
                            .FontSize(20).Bold().FontColor(Colors.Blue.Darken2);
                        col.Item().Text($"Generado el {DateTime.Now:dd/MM/yyyy HH:mm}")
                            .FontSize(9).FontColor(Colors.Grey.Darken1);
                        col.Item().PaddingTop(5).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
                    });
                });

                // Contenido
                page.Content().PaddingTop(10).Table(table =>
                {
                    // Definir columnas
                    table.ColumnsDefinition(cols =>
                    {
                        cols.RelativeColumn(3); // Nombre
                        cols.RelativeColumn(4); // Descripción
                        cols.RelativeColumn(2); // Precio
                        cols.RelativeColumn(1); // Estado
                    });

                    // Cabecera de la tabla
                    static IContainer CeldaEncabezado(IContainer c) =>
                        c.Background(Colors.Blue.Darken2).Padding(5);

                    table.Header(h =>
                    {
                        h.Cell().Element(CeldaEncabezado).Text("Nombre").FontColor(Colors.White).Bold();
                        h.Cell().Element(CeldaEncabezado).Text("Descripción").FontColor(Colors.White).Bold();
                        h.Cell().Element(CeldaEncabezado).Text("Precio").FontColor(Colors.White).Bold();
                        h.Cell().Element(CeldaEncabezado).Text("Estado").FontColor(Colors.White).Bold();
                    });

                    // Filas de productos
                    foreach (var (producto, index) in productos.Select((p, i) => (p, i)))
                    {
                        var bgColor = index % 2 == 0 ? Colors.White : Colors.Grey.Lighten4;

                        static IContainer Celda(IContainer c, string color) =>
                            c.Background(color).Padding(5);

                        table.Cell().Element(c => Celda(c, bgColor)).Text(producto.Nombre);
                        table.Cell().Element(c => Celda(c, bgColor)).Text(producto.Descripcion ?? "-");
                        table.Cell().Element(c => Celda(c, bgColor)).Text($"${producto.Precio:N2}");
                        table.Cell().Element(c => Celda(c, bgColor))
                            .Text(producto.Estado ? "Activo" : "Inactivo")
                            .FontColor(producto.Estado ? Colors.Green.Darken2 : Colors.Red.Darken2);
                    }
                });

                // Pie de página
                page.Footer().AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Página ");
                        x.CurrentPageNumber();
                        x.Span(" de ");
                        x.TotalPages();
                    });
            });
        });

        var pdfBytes = pdf.GeneratePdf();
        return File(pdfBytes, "application/pdf", $"productos_{DateTime.Now:yyyyMMdd}.pdf");
    }
}