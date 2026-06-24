using System;
using System.IdentityModel.Tokens.Jwt;
using URF.Core.EF.Trackable.Entities;
using URF.Core.EF.Trackable.Enums;

namespace URF.Core.EF.Trackable.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string Phone { get; set; }
        public string Avatar { get; set; }
        public string MeeyId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public DateTime? Expires { get; set; }
        public string VoucherCode { get; set; }
        public GenderType? Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public int? ExtPhoneNumber { get; set; }

        public UserModel(User entity, JwtSecurityToken jwtToken = null)
        {
            if (entity != null)
            {
                Id = entity.Id;
                Email = entity.Email;
                Gender = entity.Gender;
                Avatar = entity.Avatar;
                Birthday = entity.Birthday;
                FullName = entity.FullName;
                Phone = entity.PhoneNumber;
                if (jwtToken != null)
                {
                    Expires = jwtToken.ValidTo;
                    Token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
                }
            }
        }
    }
    public class UserLoginModel
    {
        public string Phone { get; set; }
        public string Password { get; set; }
        public bool? SignOutAll { get; set; }
        public string DialingCode { get; set; }
        public UserActivityModel Activity { get; set; }
        public ExternalAuthModel SocialLogin { get; set; }
    }
    public class UserUpdateModel
    {
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public DateTime? Birthday { get; set; }
        public GenderType? Gender { get; set; }
        public string BirthdayString { get; set; }
    }
    public class UserRegisterModel
    {
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string VerifyCode { get; set; }
        public string DialingCode { get; set; }
        public ExternalAuthModel SocialLogin { get; set; }
    }
    public class UserRequestOtpModel
    {
        public string Phone { get; set; }
        public string DialingCode { get; set; }
    }
    public class UserVerifyOtpModel
    {
        public string Phone { get; set; }
        public string VerifyCode { get; set; }
        public string DialingCode { get; set; }
    }
    public class UserResetPasswordModel
    {
        public string Phone { get; set; }
        public string Password { get; set; }
        public string VerifyCode { get; set; }
        public string DialingCode { get; set; }
    }
    public class UserChangePasswordModel
    {
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
    public class UserForgotPasswordModel
    {
        public string Phone { get; set; }
        public string DialingCode { get; set; }
    }
    public class ExternalAuthModel
    {
        public string Token { get; set; }
        public string Provider { get; set; }
    }
    public class SocialUserModel
    {
        public Guid Id { get; set; }
        public string SocialUserId { get; set; }
        public string Email { get; set; }
        public bool IsVerified { get; set; }
        public string Name { get; set; }
        public string Avatar { get; set; }

        public SocialUserModel()
        {
            IsVerified = false;
        }
    }
}
