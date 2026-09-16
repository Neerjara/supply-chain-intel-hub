using Microsoft.EntityFrameworkCore;
using SCIH.Domain.Entities;

namespace SCIH.Infrastructure.Data;

public class ScihDbContext : DbContext
{
    public ScihDbContext(DbContextOptions<ScihDbContext> options) : base(options)
    {
    }

    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<TransactionJourney> TransactionJourneys => Set<TransactionJourney>();
    public DbSet<ExceptionRecord> Exceptions => Set<ExceptionRecord>();
    public DbSet<DashboardMetric> DashboardMetrics => Set<DashboardMetric>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();
    public DbSet<AccessMapping> AccessMappings => Set<AccessMapping>();
    public DbSet<NotificationLog> NotificationStatuses => Set<NotificationLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Transactions Fluent Configuration
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasIndex(e => e.TrackingNumber).IsUnique();
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CarrierName);
        });

        // TransactionJourney Fluent Configuration
        modelBuilder.Entity<TransactionJourney>(entity =>
        {
            entity.HasIndex(e => new { e.TransactionId, e.StepNumber });
            entity.HasIndex(e => e.MilestoneTime);

            entity.HasOne(d => d.Transaction)
                .WithMany(p => p.Journeys)
                .HasForeignKey(d => d.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ExceptionRecord Fluent Configuration
        modelBuilder.Entity<ExceptionRecord>(entity =>
        {
            entity.HasIndex(e => new { e.Status, e.Severity });
            entity.HasIndex(e => e.TransactionId);

            entity.HasOne(d => d.Transaction)
                .WithMany(p => p.Exceptions)
                .HasForeignKey(d => d.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // DashboardMetric Fluent Configuration
        modelBuilder.Entity<DashboardMetric>(entity =>
        {
            entity.HasIndex(e => e.MetricDate).IsUnique();
        });

        // UserPreference Fluent Configuration
        modelBuilder.Entity<UserPreference>(entity =>
        {
            entity.HasIndex(e => e.UserId).IsUnique();
        });

        // NotificationLog Fluent Configuration
        modelBuilder.Entity<NotificationLog>(entity =>
        {
            entity.HasIndex(e => e.ExceptionId);
            entity.HasIndex(e => e.DeliveryStatus);

            entity.HasOne(d => d.ExceptionRecord)
                .WithMany(p => p.Notifications)
                .HasForeignKey(d => d.ExceptionId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
