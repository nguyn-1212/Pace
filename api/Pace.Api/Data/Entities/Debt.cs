using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class Debt : BaseEntity
    {
        public int UserId { get; set; }

        [Required, MaxLength(200)]
        public string PersonName { get; set; }

        public decimal Amount { get; set; }

        public int Type { get; set; }        // 0=tôi vay (I owe), 1=họ vay (they owe)

        [MaxLength(500)]
        public string Note { get; set; }

        public DateTime? DueDate { get; set; }

        public bool IsPaid { get; set; }

        public DateTime? PaidDate { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
