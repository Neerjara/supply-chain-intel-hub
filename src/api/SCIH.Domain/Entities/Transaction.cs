using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SCIH.Domain.Entities;

[Table("transactions")]
public class Transaction
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    [Column("tracking_number")]
    public string TrackingNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("origin")]
    public string Origin { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("destination")]
    public string Destination { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("carrier_name")]
    public string CarrierName { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    [Column("status")]
    public string Status { get; set; } = "IN_TRANSIT";

    [Column("estimated_delivery")]
    public DateTime EstimatedDelivery { get; set; }

    [Column("actual_delivery")]
    public DateTime? ActualDelivery { get; set; }

    [Column("weight_kg", TypeName = "decimal(10,2)")]
    public decimal WeightKg { get; set; }

    [Column("metadata", TypeName = "jsonb")]
    public string MetadataJson { get; set; } = "{}";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public ICollection<TransactionJourney> Journeys { get; set; } = new List<TransactionJourney>();
    public ICollection<ExceptionRecord> Exceptions { get; set; } = new List<ExceptionRecord>();
}
