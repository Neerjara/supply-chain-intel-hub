using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SCIH.Domain.Entities;

[Table("notification_status")]
public class NotificationLog
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("exception_id")]
    public Guid ExceptionId { get; set; }

    [Required]
    [MaxLength(30)]
    [Column("channel")]
    public string Channel { get; set; } = "EMAIL";

    [Required]
    [MaxLength(200)]
    [Column("recipient")]
    public string Recipient { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Column("delivery_status")]
    public string DeliveryStatus { get; set; } = "PENDING";

    [Column("sent_at")]
    public DateTime? SentAt { get; set; }

    [Column("error_message")]
    public string? ErrorMessage { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Property
    [ForeignKey(nameof(ExceptionId))]
    public ExceptionRecord? ExceptionRecord { get; set; }
}
