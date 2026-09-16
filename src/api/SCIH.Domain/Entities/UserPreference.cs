using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SCIH.Domain.Entities;

[Table("user_preferences")]
public class UserPreference
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Column("theme")]
    public string Theme { get; set; } = "light";

    [MaxLength(100)]
    [Column("default_carrier")]
    public string? DefaultCarrier { get; set; }

    [Column("notification_channels", TypeName = "jsonb")]
    public string NotificationChannelsJson { get; set; } = "{\"email\": true, \"slack\": true}";

    [Column("dashboard_layout", TypeName = "jsonb")]
    public string DashboardLayoutJson { get; set; } = "{}";

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
