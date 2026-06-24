using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Constants;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly AppSettings _appSettings;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IOptions<AppSettings> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || user.IsDelete == true)
                return Unauthorized("Invalid credentials");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
            if (!result.Succeeded)
            {
                if (result.IsLockedOut)
                    return Unauthorized("Account locked. Try again later.");
                return Unauthorized("Invalid credentials");
            }

            var token = GenerateToken(user);
            return Ok(new { Token = token, User = new { user.Id, user.FullName, user.Email, user.Avatar } });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new User
            {
                Email = request.Email,
                UserName = request.Email,
                FullName = request.FullName,
                IsActive = true,
                IsDelete = false,
                CreatedDate = DateTime.UtcNow,
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var token = GenerateToken(user);
            return Ok(new { Token = token, User = new { user.Id, user.FullName, user.Email } });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return NotFound();
            return Ok(new { user.Id, user.FullName, user.Email, user.Avatar, user.PhoneNumber, user.Birthday, user.Gender });
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return NotFound();

            user.FullName = request.FullName ?? user.FullName;
            user.Avatar = request.Avatar ?? user.Avatar;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            user.Birthday = request.Birthday ?? user.Birthday;
            user.Gender = request.Gender ?? user.Gender;
            user.UpdatedDate = DateTime.UtcNow;

            await _userManager.UpdateAsync(user);
            return NoContent();
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return NotFound();

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.TokenKey));
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Name, user.FullName ?? ""),
            };

            var token = new JwtSecurityToken(
                issuer: Constant.Issuer,
                audience: Constant.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
    }

    public class UpdateProfileRequest
    {
        public string FullName { get; set; }
        public string Avatar { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? Birthday { get; set; }
        public URF.Core.EF.Trackable.Enums.GenderType? Gender { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
