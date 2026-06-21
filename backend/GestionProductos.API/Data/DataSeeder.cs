using Microsoft.AspNetCore.Identity;

namespace GestionProductos.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(UserManager<IdentityUser> userManager)
    {
        // Si ya existe el usuario admin, no hacemos nada
        if (userManager.Users.Any()) return;

        var adminUser = new IdentityUser
        {
            UserName = "admin@demo.com",
            Email = "admin@demo.com",
            EmailConfirmed = true
        };

        await userManager.CreateAsync(adminUser, "Admin123!");
    }
}