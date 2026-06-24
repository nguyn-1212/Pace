using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class Transaction : BaseEntity
    {
        public int UserId { get; set; }

        public int? CategoryId { get; set; }

        public decimal Amount { get; set; }

        public int Type { get; set; }         // 0=expense, 1=income

        [MaxLength(500)]
        public string Note { get; set; }

        public DateTime TransactionDate { get; set; }

        [MaxLength(200)]
        public string Tags { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [IgnoreDataMember]
        [ForeignKey("CategoryId")]
        public virtual TransactionCategory Category { get; set; }
    }
}
