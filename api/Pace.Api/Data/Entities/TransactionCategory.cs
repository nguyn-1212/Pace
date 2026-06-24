using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class TransactionCategory : BaseEntity
    {
        [Required, MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Icon { get; set; }

        [MaxLength(20)]
        public string Color { get; set; }

        public int Type { get; set; }         // 0=expense (chi tiêu), 1=income (thu nhập)

        public bool IsDefault { get; set; }   // true = system default category

        public int? UserId { get; set; }      // null = system default, non-null = user-created

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
