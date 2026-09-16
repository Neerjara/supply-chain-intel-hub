using Serilog.Context;

namespace SCIH.Worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var jobId = Guid.NewGuid().ToString("N")[..8];

            using (LogContext.PushProperty("JobId", jobId))
            {
                _logger.LogInformation("SCIH Inventory Analytics Processor started execution for Job {JobId} at {Timestamp}",
                    jobId, DateTimeOffset.Now);

                try
                {
                    // Simulate background analytics processing batch
                    await ProcessInventoryBatchAsync(jobId, stoppingToken);
                    
                    _logger.LogInformation("Job {JobId} completed successfully. Processed 1482 active records.", jobId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing inventory batch during Job {JobId}", jobId);
                }
            }

            await Task.Delay(15000, stoppingToken);
        }
    }

    private static async Task ProcessInventoryBatchAsync(string jobId, CancellationToken stoppingToken)
    {
        // Simulated async workload
        await Task.Delay(1000, stoppingToken);
    }
}
