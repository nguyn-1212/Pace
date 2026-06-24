using Microsoft.Extensions.DependencyInjection;
using Pace.Api.Data.Entities;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;
using URF.Core.EF;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;
using URF.Core.EF.Trackable.Entities.Message;
using URF.Core.Services.Hubs;

namespace Pace.Api.Settings
{
    public static class AppStartup
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<INotifyHub, NotifyHub>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Framework repos
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
            services.AddScoped<IRepositoryX<Category>, RepositoryX<Category>>();

            // Pace repos
            services.AddScoped<IRepositoryX<TransactionCategory>, RepositoryX<TransactionCategory>>();
            services.AddScoped<IRepositoryX<Transaction>, RepositoryX<Transaction>>();
            services.AddScoped<IRepositoryX<SavingGoal>, RepositoryX<SavingGoal>>();
            services.AddScoped<IRepositoryX<Debt>, RepositoryX<Debt>>();
            services.AddScoped<IRepositoryX<Goal>, RepositoryX<Goal>>();
            services.AddScoped<IRepositoryX<GoalLog>, RepositoryX<GoalLog>>();
            services.AddScoped<IRepositoryX<Habit>, RepositoryX<Habit>>();
            services.AddScoped<IRepositoryX<HabitLog>, RepositoryX<HabitLog>>();
            services.AddScoped<IRepositoryX<Reminder>, RepositoryX<Reminder>>();
            services.AddScoped<IRepositoryX<Journal>, RepositoryX<Journal>>();

            return services;
        }
    }
}
