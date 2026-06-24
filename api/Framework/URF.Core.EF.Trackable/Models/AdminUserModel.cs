using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using URF.Core.EF.Trackable.Entities;
using URF.Core.EF.Trackable.Enums;

namespace URF.Core.EF.Trackable.Models
{
    public class AdminUserModel
    {
        public int Id { get; set; }
        public bool IsSale { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public bool IsAdmin { get; set; }
        public string Phone { get; set; }
        public int? UserType { get; set; }
        public string Avatar { get; set; }
        public bool IsSupport { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public DateTime? Expires { get; set; }
        public int? DepartmentId { get; set; }
        public int? OtherLoginId { get; set; }
        public GenderType? Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string ProfileJson { get; set; }

        public AdminUserModel()
        {

        }

        public AdminUserModel(User entity, JwtSecurityToken jwtToken = null)
        {
            if (entity != null)
            {
                Id = entity.Id;
                Email = entity.Email;
                Avatar = entity.Avatar;
                Phone = entity.PhoneNumber;
                FullName = entity.FullName;
                UserName = entity.UserName;
                UserType = entity.UserType;
                DepartmentId = entity.DepartmentId;
                OtherLoginId = entity.OtherLoginId;
                IsAdmin = entity.IsAdmin ?? false;
                if (jwtToken != null)
                {
                    Expires = jwtToken.ValidTo;
                    Token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
                }
            }
        }
    }
    public class AdminVerifyModel
    {
        public string Password { get; set; }
    }
    public class AdminUserLockModel
    {
        public string ReasonLock { get; set; }
    }
    public class AdminUserLoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public UserActivityModel Activity { get; set; }
    }
    public class AdminUserUpdateModel
    {
        public string Phone { get; set; }
        public string Email { get; set; }
        public bool? Locked { get; set; }
        public string Avatar { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public int? DepartmentId { get; set; }
        public int? OtherLoginId { get; set; }
        public string FirstName { get; set; }
        public List<int> RoleIds { get; set; }
        public List<int> TeamIds { get; set; }
        public GenderType? Gender { get; set; }
        public string RawPassword { get; set; }
        public DateTime? Birthday { get; set; }
        public List<AdminUserPermissionModel> Permissions { get; set; }
    }
    public class AdminUserPermissionModel
    {
        public int Id { get; set; }
        public PermissionType Type { get; set; }
    }
    public class AdminUserSetPasswordModel
    {
        public string Code { get; set; }
        public string Password { get; set; }
    }
    public class AdminUserResetPasswordModel
    {
        public string Email { get; set; }
    }
    public class AdminUserSendMailActiveModel
    {
        public string Email { get; set; }
    }
    public class AdminUserChangePasswordModel
    {
        public string Password { get; set; }
        public string OldPassword { get; set; }
        public UserActivityModel Activity { get; set; }
    }
    public class AdminUserForgotPasswordModel
    {
        public string Email { get; set; }
        public UserActivityModel Activity { get; set; }
    }
    public class AdminSocialUserModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public bool IsVerified { get; set; }
        public string SocialUserId { get; set; }

        public AdminSocialUserModel()
        {
            IsVerified = false;
        }
    }
    public class AdminExternalAuthModel
    {
        public string Token { get; set; }
        public string Provider { get; set; }
    }
}
