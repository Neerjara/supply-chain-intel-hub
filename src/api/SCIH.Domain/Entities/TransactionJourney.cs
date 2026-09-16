using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SCIH.Domain.Entities;

[Table("transaction_journey")]
public class TransactionJourney
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("transaction_id")]
    public Guid TransactionId { get; set; }

    [Column("step_number")]
    public int StepNumber { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("milestone_name")]
    public string MilestoneName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [Column("location_name")]
    public string LocationName { get; set; } = string.Empty;

    [Column("latitude", TypeName = "decimal(9,6)")]
    public decimal? Latitude { get; set; }

    [Column("longitude", TypeName = "decimal(9,6)")]
    public decimal? Longitude { get; set; }

    [Column("temperature_c", TypeName = "decimal(5,2)")]
    public decimal? TemperatureC { get; set; }

    [Column("humidity_percent", TypeName = "decimal(5,2)")]
    public decimal? HumidityPercent { get; set; }

    [Column("shock_g", TypeName = "decimal(5,2)")]
    public decimal? ShockG { get; set; }

    [Required]
    [MaxLength(30)]
    [Column("status")]
    public string Status { get; set; } = "ACTIVE";

    [Column("milestone_time")]
    public DateTime MilestoneTime { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Property
    [ForeignKey(nameof(TransactionId))]
    public Transaction? Transaction { get; set; }
}
