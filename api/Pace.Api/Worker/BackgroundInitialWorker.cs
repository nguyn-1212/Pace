using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;
using URF.Core.EF.Trackable.Enums;
using URF.Core.Helper.Extensions;
using URF.Core.Helper.Helpers;
using URF.Core.EF.Trackable.Entities;
using URF.Core.EF.Trackable;
using Pace.Api.Helpers;

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
            if (_appSettings.InitDb.HasValue())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

                // insert admin
                var user = await userManager.FindByNameAsync(StoreHelper.UserAdmin);
                if (user == null)
                {
                    var password = SecurityHelper.CreateHash256("rDC4MgRnyHjjtNvhZj2zqaJQGgTgM8dnbC3Gkc7eLiU=", _appSettings.Secret);
                    user = new User
                    {
                        IsAdmin = true,
                        IsActive = true,
                        IsDelete = false,
                        FullName = "Admin",
                        Birthday = DateTime.Now,
                        Email = "admin@lazy.vn",
                        Gender = GenderType.Male,
                        PhoneNumber = "888888888",
                        CreatedDate = DateTime.Now,
                        UserName = StoreHelper.UserAdmin,
                        UserType = (int)UserType.Management,
                    };
                    await userManager.CreateAsync(user, password);
                }
            }
        }
    }
}
