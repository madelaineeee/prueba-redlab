using GestionProductos.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GestionProductos.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(UserManager<IdentityUser> userManager, ApplicationDbContext context)
    {
        if (!userManager.Users.Any())
        {
            var adminUser = new IdentityUser
            {
                UserName = "admin@demo.com",
                Email = "admin@demo.com",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(adminUser, "Admin123!");
            await userManager.AddClaimAsync(adminUser, new System.Security.Claims.Claim("NombreCompleto", "Administrador"));
        }

        if (!await context.Productos.AnyAsync())
        {
            var productos = new List<Producto>
            {
                new() { Nombre = "Arroz Especial 5 lb", Descripcion = "Arroz de grano largo para consumo familiar", Precio = 3.95m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-29) },
                new() { Nombre = "Arroz Premium 20 lb", Descripcion = "Saco de arroz premium", Precio = 14.50m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-28) },
                new() { Nombre = "Azúcar Blanca 2 lb", Descripcion = "Azúcar refinada para uso doméstico", Precio = 1.75m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-27) },
                new() { Nombre = "Sal Yodada 1 lb", Descripcion = "Sal fortificada con yodo", Precio = 0.65m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-26) },
                new() { Nombre = "Aceite Vegetal 1 L", Descripcion = "Aceite vegetal para cocinar", Precio = 3.25m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-25) },
                new() { Nombre = "Harina de Trigo 1 kg", Descripcion = "Harina multipropósito para repostería", Precio = 1.45m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-24) },
                new() { Nombre = "Harina de Maíz 1 kg", Descripcion = "Harina para tortillas y preparaciones tradicionales", Precio = 1.60m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-23) },
                new() { Nombre = "Lentejas 500 g", Descripcion = "Lentejas seleccionadas de alta calidad", Precio = 1.20m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-22) },
                new() { Nombre = "Frijoles Rojos 1 lb", Descripcion = "Frijoles rojos secos", Precio = 1.55m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-21) },
                new() { Nombre = "Frijoles Negros 1 lb", Descripcion = "Frijoles negros", Precio = 1.50m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-20) },
                new() { Nombre = "Pasta Espagueti 500 g", Descripcion = "Pasta larga de trigo duro", Precio = 0.95m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-19) },
                new() { Nombre = "Pasta Coditos 500 g", Descripcion = "Pasta corta tipo codito", Precio = 0.90m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-18) },
                new() { Nombre = "Salsa de Tomate 400 g", Descripcion = "Salsa lista para cocinar", Precio = 1.15m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-17) },
                new() { Nombre = "Atún en Agua 140 g", Descripcion = "Atún enlatado en agua", Precio = 1.35m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-16) },
                new() { Nombre = "Sardinas en Salsa 155 g", Descripcion = "Sardinas en salsa de tomate", Precio = 1.10m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-15) },
                new() { Nombre = "Leche Evaporada 410 g", Descripcion = "Leche evaporada para cocina y repostería", Precio = 1.45m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-14) },
                new() { Nombre = "Leche en Polvo 360 g", Descripcion = "Leche en polvo fortificada", Precio = 5.95m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-13) },
                new() { Nombre = "Café Molido 340 g", Descripcion = "Café tostado y molido", Precio = 4.75m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-12) },
                new() { Nombre = "Té de Manzanilla 20 sobres", Descripcion = "Infusión natural de manzanilla", Precio = 1.85m, Estado = false, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-11) },
                new() { Nombre = "Avena Instantánea 400 g", Descripcion = "Avena lista para preparar", Precio = 2.25m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-10) },
                new() { Nombre = "Galletas María 200 g", Descripcion = "Galletas dulces tradicionales", Precio = 1.10m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-9) },
                new() { Nombre = "Detergente en Polvo 1 kg", Descripcion = "Detergente para ropa", Precio = 3.95m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-8) },
                new() { Nombre = "Jabón de Baño 3 unidades", Descripcion = "Paquete de jabones de tocador", Precio = 2.50m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-7) },
                new() { Nombre = "Papel Higiénico 12 rollos", Descripcion = "Paquete económico de papel higiénico", Precio = 5.95m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-6) },
                new() { Nombre = "Cloro 1 galón", Descripcion = "Desinfectante para el hogar", Precio = 2.95m, Estado = false, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-5) },
                new() { Nombre = "Agua Purificada 1.5 L", Descripcion = "Botella de agua purificada", Precio = 0.95m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-4) },
                new() { Nombre = "Jugo de Naranja 1 L", Descripcion = "Bebida pasteurizada sabor naranja", Precio = 2.75m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-3) },
                new() { Nombre = "Ketchup 500 g", Descripcion = "Salsa de tomate para acompañamientos", Precio = 1.95m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-2) },
                new() { Nombre = "Mayonesa 500 g", Descripcion = "Mayonesa tradicional", Precio = 2.85m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow.AddDays(-1) },
                new() { Nombre = "Vinagre Blanco 500 ml", Descripcion = "Vinagre multipropósito para cocina y limpieza", Precio = 1.25m, Estado = true, UsuarioCreacion = "admin@demo.com", FechaCreacion = DateTime.UtcNow }
};

            context.Productos.AddRange(productos);
            await context.SaveChangesAsync();
        }
    }
}