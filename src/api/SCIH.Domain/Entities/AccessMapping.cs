using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SCIH.Domain.Entities;

[Table("access_mappings")]
public class AccessMapping
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [Column("role")]
    public string Role { get; set; } = "DISPATCH_OPERATOR";

    [Column("allowed_regions")]
    public string[] AllowedRegions { get; set; } = Array.Empty<string>();

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("granted_at")]
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
}
