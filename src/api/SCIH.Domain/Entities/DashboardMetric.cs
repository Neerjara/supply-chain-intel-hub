using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SCIH.Domain.Entities;

[Table("dashboard_metrics")]
public class DashboardMetric
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Column("metric_date")]
    public DateTime MetricDate { get; set; }

    [Column("total_shipments")]
    public int TotalShipments { get; set; }

    [Column("in_transit_count")]
    public int InTransitCount { get; set; }

    [Column("delivered_count")]
    public int DeliveredCount { get; set; }

    [Column("delayed_count")]
    public int DelayedCount { get; set; }

    [Column("exception_count")]
    public int ExceptionCount { get; set; }

    [Column("on_time_rate_percent", TypeName = "decimal(5,2)")]
    public decimal OnTimeRatePercent { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
