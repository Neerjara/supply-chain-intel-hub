using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SCIH.Domain.Entities;

[Table("exceptions")]
public class ExceptionRecord
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("transaction_id")]
    public Guid TransactionId { get; set; }

    [Required]
    [MaxLength(20)]
    [Column("severity")]
    public string Severity { get; set; } = "MEDIUM";

    [Required]
    [MaxLength(50)]
    [Column("exception_type")]
    public string ExceptionType { get; set; } = string.Empty;

    [Required]
    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Column("status")]
    public string Status { get; set; } = "OPEN";

    [Column("resolution_notes")]
    public string? ResolutionNotes { get; set; }

    [MaxLength(100)]
    [Column("resolved_by")]
    public string? ResolvedBy { get; set; }

    [Column("resolved_at")]
    public DateTime? ResolvedAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    [ForeignKey(nameof(TransactionId))]
    public Transaction? Transaction { get; set; }

    public ICollection<NotificationLog> Notifications { get; set; } = new List<NotificationLog>();
}
