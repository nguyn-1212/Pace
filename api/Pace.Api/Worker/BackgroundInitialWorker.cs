using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Pace.Api.Data;
using Pace.Api.Data.Entities;
using Pace.Api.Helpers;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;
using URF.Core.EF.Trackable.Enums;
using URF.Core.Helper.Extensions;
using URF.Core.Helper.Helpers;

namespace Pace.Api.Worker
{
    public class BackgroundInitialWorker : BackgroundService
    {
        private readonly AppSettings _appSettings;
        private readonly IServiceProvider _serviceProvider;

        public BackgroundInitialWorker(
            IServiceProvider serviceProvider,
            IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            if (!_appSettings.InitDb.HasValue()) return;

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var db = scope.ServiceProvider.GetRequiredService<PaceContext>();

            // Seed admin user
            var admin = await userManager.FindByNameAsync(StoreHelper.UserAdmin);
            if (admin == null)
            {
                var password = SecurityHelper.CreateHash256("rDC4MgRnyHjjtNvhZj2zqaJQGgTgM8dnbC3Gkc7eLiU=", _appSettings.Secret);
                admin = new User
                {
                    IsAdmin = true,
                    IsActive = true,
                    IsDelete = false,
                    FullName = "Admin",
                    Birthday = DateTime.Now,
                    Email = "admin@pace.vn",
                    Gender = GenderType.Male,
                    PhoneNumber = "888888888",
                    CreatedDate = DateTime.Now,
                    UserName = StoreHelper.UserAdmin,
                    UserType = (int)UserType.Management,
                };
                await userManager.CreateAsync(admin, password);
            }

            // Seed default transaction categories (system-wide, UserId = null)
            var hasCategories = await db.TransactionCategories.AnyAsync(c => c.UserId == null && c.IsDelete != true, stoppingToken);
            if (!hasCategories)
            {
                var now = DateTime.UtcNow;
                var categories = new List<TransactionCategory>
                {
                    // Expense (Type=0)
                    new() { Name = "Ăn uống",    Icon = "🍜", Color = "#FF6B35", Type = 0, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Di chuyển",  Icon = "🚗", Color = "#2B5BFF", Type = 0, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Mua sắm",    Icon = "🛍️", Color = "#7C3AED", Type = 0, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Sức khỏe",   Icon = "💊", Color = "#00C48C", Type = 0, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Giải trí",   Icon = "🎮", Color = "#FF2D78", Type = 0, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Hoá đơn",    Icon = "📄", Color = "#6B7280", Type = 0, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Giáo dục",   Icon = "📚", Color = "#0EA5E9", Type = 0, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Khác",       Icon = "📦", Color = "#9CA3AF", Type = 0, IsDefault = false, IsActive = true, IsDelete = false, CreatedDate = now },
                    // Income (Type=1)
                    new() { Name = "Tiền lương", Icon = "💼", Color = "#00C48C", Type = 1, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Thưởng",     Icon = "🎁", Color = "#FF6B35", Type = 1, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Đầu tư",     Icon = "📈", Color = "#2B5BFF", Type = 1, IsDefault = true, IsActive = true, IsDelete = false, CreatedDate = now },
                    new() { Name = "Thu nhập khác", Icon = "💰", Color = "#7C3AED", Type = 1, IsDefault = false, IsActive = true, IsDelete = false, CreatedDate = now },
                };
                await db.TransactionCategories.AddRangeAsync(categories, stoppingToken);
                await db.SaveChangesAsync(stoppingToken);
            }
        }
    }
}
