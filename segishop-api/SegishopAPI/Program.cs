using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using SegishopAPI.Data;
using SegishopAPI.Services;
using DotNetEnv;

// Load environment variables from .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);
Console.WriteLine("DEBUG: Application Starting");
Console.Error.WriteLine("DEBUG: Services registering...");

try {
// Add services to the container.
builder.Services.AddControllers();

// Database
Console.Error.WriteLine("DEBUG: Configuring DB context...");
builder.Services.AddDbContext<SegishopDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.EnableRetryOnFailure(10, TimeSpan.FromSeconds(5), null)));

// Services
Console.Error.WriteLine("DEBUG: Registering scoped services...");
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminAuthService, AdminAuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IShippingCalculationService, ShippingCalculationService>();
builder.Services.AddScoped<IPostalCodeValidationService, PostalCodeValidationService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentRecordService, PaymentRecordService>();
builder.Services.AddScoped<ICustomerPaymentMethodService, CustomerPaymentMethodService>();
builder.Services.AddScoped<IPaymentGatewayRefundService, PaymentGatewayRefundService>();
builder.Services.AddScoped<IOrderStatusHistoryService, OrderStatusHistoryService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IAdminProfileService, AdminProfileService>();
builder.Services.AddScoped<IRecaptchaService, RecaptchaService>();
builder.Services.AddScoped<IImageProcessingService, ImageProcessingService>();
builder.Services.AddSingleton<ICsvSkuService, CsvSkuService>();
builder.Services.AddHttpClient<PaymentGatewayRefundService>();
builder.Services.AddHttpClient<RecaptchaService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "your-super-secret-key-that-is-at-least-32-characters-long";
var issuer = jwtSettings["Issuer"] ?? "PrintOscarAPI";
var audience = jwtSettings["Audience"] ?? "PrintOscarClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        var allowedOrigins = new List<string> { "http://localhost:3000", "http://localhost:3001" };
        
        // Add production origins from environment variables
        var frontendUrl = builder.Configuration["FRONTEND_URL"];
        if (!string.IsNullOrEmpty(frontendUrl))
        {
            allowedOrigins.Add(frontendUrl);
        }
        
        // Add common production domains
        allowedOrigins.AddRange(new[] {
            "https://demo.printoscar.com",
            "https://printoscar.com",
            "https://www.printoscar.com",
            "https://printoscardev.xendekweb.com",
            "https://printoscarapi.xendekweb.com",
            "https://printoscar.xendekweb.com",
            "https://app-michelle.xendekweb.com",
            "https://api-michelle.xendekweb.com"
        });
        
        // Use SetIsOriginAllowed to allow any origin dynamically while supporting credentials
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "PrintOscar API", 
        Version = "v1",
        Description = "E-commerce API for PrintOscar"
    });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // Avoid schemaId collisions for nested DTO types across controllers
    c.CustomSchemaIds(type => type.FullName);
});

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable Swagger in all environments for API documentation
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PrintOscar API v1");
    c.RoutePrefix = string.Empty; // Serve Swagger UI at root
});

// app.UseHttpsRedirection(); // Disabled for HTTP-only setup

// CORS must be before authentication/authorization
app.UseCors("AllowReactApp");

// Static files for image uploads
app.UseStaticFiles();

// Configure static files for uploads directory (single media root)
var contentRootUploads = Path.Combine(app.Environment.ContentRootPath, "uploads");
var webRootUploads = Path.Combine(app.Environment.WebRootPath ?? app.Environment.ContentRootPath, "uploads");
var uploadsPath = Directory.Exists(contentRootUploads) ? contentRootUploads : webRootUploads;
Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// Create database and seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SegishopDbContext>();
    try
    {
        // Wait for SQL Server to become reachable (retry)
        var maxAttempts = 12; // ~60s total
        var attempt = 0;
        while (attempt < maxAttempts)
        {
            try
            {
                if (context.Database.CanConnect()) break;
            }
            catch { }
            attempt++;
            Thread.Sleep(5000);
        }

        context.Database.EnsureCreated();
        Console.WriteLine("✅ Database created successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database creation failed: {ex}");
    }
}
// Console.WriteLine("⚠️ DB Seeding SKIPPED for debugging/startup fix");

Console.WriteLine("🚀 PrintOscar API starting...");
var baseUrl = builder.Configuration["ASPNETCORE_URLS"]?.Split(';')[0] ?? "http://localhost:5001";
Console.WriteLine($"📋 Swagger UI available at: {baseUrl}");
Console.WriteLine($"🔗 API Base URL: {baseUrl}/api");
Console.WriteLine($"💾 Database: {builder.Configuration.GetConnectionString("DefaultConnection")}");

Console.WriteLine("DEBUG: Calling app.Run()");
app.Run();
}
catch (Exception ex)
{
    Console.Error.WriteLine($"FATAL ERROR: {ex}");
    throw;
}

// Make Program class accessible for testing
public partial class Program { }
