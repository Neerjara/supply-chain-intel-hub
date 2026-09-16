using SCIH.Api.Middleware;
using Serilog;

// Configure Bootstrap Serilog Logger
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting Supply Chain Intelligence Hub Web API...");

    var builder = WebApplication.CreateBuilder(args);

    // Integrate Serilog into Host Configuration
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    // Add services to the container
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddApplicationInsightsTelemetry();

    var app = builder.Build();

    // 1. Correlation ID Middleware (Must be high in pipeline)
    app.UseMiddleware<CorrelationIdMiddleware>();

    // 2. Global Exception Handling Middleware
    app.UseMiddleware<GlobalExceptionMiddleware>();

    // 3. Serilog Structured HTTP Request Logging
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
            diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
            diagnosticContext.Set("ClientIP", httpContext.Connection.RemoteIpAddress?.ToString());
        };
    });

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();

    app.MapGet("/health", () => Results.Ok(new
    {
        Status = "Healthy",
        Service = "SCIH.Api",
        Timestamp = DateTime.UtcNow,
        Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
    }));

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "SCIH.Api application host terminated unexpectedly!");
}
finally
{
    Log.CloseAndFlush();
}
