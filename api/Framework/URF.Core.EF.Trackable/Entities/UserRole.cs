using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using TrackableEntities.Common.Core;
using URF.Core.EF.Trackable;

namespace URF.Core.EF.Trackable.Entities
{
    public partial class UserRole : IdentityUserRole<int>, ITrackable, IMergeable, ISqlTenantEntity
    {
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        [MaxLength(100)]
        public string TenantId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        [IgnoreDataMember]
        [ForeignKey("CreatedBy")]
        public virtual User CreatedByUser { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UpdatedBy")]
        public virtual User UpdatedByUser { get; set; }

        [IgnoreDataMember]
        public virtual Role Role { get; set; }

        [IgnoreDataMember]
        public virtual User User { get; set; }

        [NotMapped]
        public Guid EntityIdentifier { get; set; }

        [NotMapped]
        public TrackingState TrackingState { get; set; }

        [NotMapped]
        public ICollection<string> ModifiedProperties { get; set; }
    }
}
