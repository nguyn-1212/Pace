using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using TrackableEntities.Common.Core;
using URF.Core.EF.Trackable.Enums;
using System.ComponentModel.DataAnnotations;
using URF.Core.EF.Trackable.Entities.Message;

namespace URF.Core.EF.Trackable.Entities
{
    public partial class User : IdentityUser<int>, ITrackable, IMergeable, ISqlTenantEntity
    {
        public bool? Locked { get; set; }
        public int? UserType { get; set; }
        public string Avatar { get; set; }
        public bool? IsAdmin { get; set; }
        public int? ParentId { get; set; }
        public string Address { get; set; }
        public string FullName { get; set; }
        public string VerifyCode { get; set; }
        public string ReasonLock { get; set; }
        public int? DepartmentId { get; set; }
        public GenderType? Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public DateTime? VerifyTime { get; set; }
        public string ExtPhoneNumber { get; set; }

        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        [MaxLength(100)]
        public string TenantId { get; set; }
        public int? OtherLoginId { get; set; }
        public string GoogleToken { get; set; }
        public string FacebookToken { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        [IgnoreDataMember]
        public virtual User Parent { get; set; }

        [IgnoreDataMember]
        public virtual List<Audit> Audits { get; set; }

        [IgnoreDataMember]
        [ForeignKey("CreatedBy")]
        public virtual User CreatedByUser { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UpdatedBy")]
        public virtual User UpdatedByUser { get; set; }

        [IgnoreDataMember]
        public virtual Department Department { get; set; }

        [IgnoreDataMember]
        public virtual List<Notify> Notifies { get; set; }

        [IgnoreDataMember]
        public virtual List<User> ChildUsers { get; set; }

        [IgnoreDataMember]
        public virtual List<UserRole> UserRoles { get; set; }

        [IgnoreDataMember]
        public virtual List<UserTeam> UserTeams { get; set; }

        [IgnoreDataMember]
        public virtual List<UserGroup> UserGroups { get; set; }

        [IgnoreDataMember]
        public virtual List<Message.Group> Groups { get; set; }

        [IgnoreDataMember]
        public virtual List<UserActivity> Activities { get; set; }

        [IgnoreDataMember]
        public virtual List<LogActivity> LogActivities { get; set; }

        [IgnoreDataMember]
        public virtual List<LogException> LogExceptions { get; set; }

        [IgnoreDataMember]
        public virtual List<RequestFilter> RequestFilters { get; set; }

        [IgnoreDataMember]
        public virtual List<Message.Message> SendMessages { get; set; }

        [IgnoreDataMember]
        public virtual List<UserPermission> UserPermissions { get; set; }

        [IgnoreDataMember]
        public virtual List<Message.Message> ReceiveMessages { get; set; }

        [NotMapped]
        [IgnoreDataMember]
        public Guid EntityIdentifier { get; set; }

        [NotMapped]
        [IgnoreDataMember]
        public TrackingState TrackingState { get; set; }

        [NotMapped]
        [IgnoreDataMember]
        public ICollection<string> ModifiedProperties { get; set; }
    }
}
