using SCIH.Worker;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting Supply Chain Intelligence Hub Worker Service...");

    var builder = Host.CreateApplicationBuilder(args);

    builder.Services.AddSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    builder.Services.AddHostedService<Worker>();
    builder.Services.AddApplicationInsightsTelemetryWorkerService();

    var host = builder.Build();
    host.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "SCIH.Worker application host terminated unexpectedly!");
}
finally
{
    Log.CloseAndFlush();
}
