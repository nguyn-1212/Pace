using URF.Core.EF.Trackable.Entities;
using URF.Core.EF.Trackable;
using Lazy.Travel.Api.Service.Caching;
using Microsoft.Extensions.DependencyInjection;
using URF.Core.Abstractions;
using URF.Core.EF;
using URF.Core.Services;
using URF.Core.Services.Hubs;
using URF.Core.Abstractions.Trackable;
using Lazy.Travel.Api.Services.Contract;
using Lazy.Travel.Api.Services.Implement;
using Lazy.Travel.Api.Data.Entities;

namespace Lazy.Travel.Api.Settings
{
    public static class AppStartup
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            // unitOfWork, context
            services.AddScoped<ICacheBase, CacheBase>();
            services.AddScoped<INotifyHub, NotifyHub>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // base repo
            services.AddScoped<IRepositoryX<Role>, RepositoryX<Role>>();
            services.AddScoped<IRepositoryX<User>, RepositoryX<User>>();
            services.AddScoped<IRepositoryX<Notify>, RepositoryX<Notify>>();
            services.AddScoped<IRepositoryX<UserRole>, RepositoryX<UserRole>>();
            services.AddScoped<IRepositoryX<Permission>, RepositoryX<Permission>>();
            services.AddScoped<IRepositoryX<LogActivity>, RepositoryX<LogActivity>>();
            services.AddScoped<IRepositoryX<LogException>, RepositoryX<LogException>>();
            services.AddScoped<IRepositoryX<UserActivity>, RepositoryX<UserActivity>>();
            services.AddScoped<IRepositoryX<RequestFilter>, RepositoryX<RequestFilter>>();
            services.AddScoped<IRepositoryX<LinkPermission>, RepositoryX<LinkPermission>>();
            services.AddScoped<IRepositoryX<UserPermission>, RepositoryX<UserPermission>>();
            services.AddScoped<IRepositoryX<RolePermission>, RepositoryX<RolePermission>>();

            // services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IHttpClientEx, HttpClientEx>();
            services.AddScoped<INotifyService, NotifyService>();
            services.AddScoped<IUtilityService, UtilityService>();
            services.AddScoped<ISecurityService, SecurityService>();
            services.AddScoped<IPermissionService, PermissionService>();
            services.AddScoped<IRefreshDataService, RefreshDataService>();

            // repositories
            services.AddScoped<IRepositoryX<Configuration>, RepositoryX<Configuration>>();
            services.AddScoped<IRepositoryX<Data.Entities.Category>, RepositoryX<Data.Entities.Category>>();

            return services;
        }
    }
}
