using api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"]));
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

        builder.Services.AddAuthorization();

        builder.Services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
        });

        builder.Services.AddCors();

        var app = builder.Build();

        app.UseCors(options =>
        {
            options.AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:5173");
        });

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        //Database yoksa oluþturus
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();
            context.Database.EnsureCreated();
        }

        app.Run();
    }
}