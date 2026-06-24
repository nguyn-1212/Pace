using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using URF.Core.EF.Trackable.Models;

namespace URF.Core.Helper.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAndMigrateTenantDatabases<T>(this IServiceCollection services, IConfiguration config) where T : DbContext
        {
            var options = services.GetOptions<TenantSettings>(nameof(TenantSettings));
            var defaultConnectionString = options.Defaults?.ConnectionString;
            var defaultDbProvider = options.Defaults?.DBProvider;
            if (defaultDbProvider.ToLower() == "mysql")
            {
                services.AddDbContext<T>(m => m.UseMySQL(defaultConnectionString, e => e.MigrationsAssembly(typeof(T).Assembly.FullName)));
            }         
            return services;
        }
        public static T GetOptions<T>(this IServiceCollection services, string sectionName) where T : new()
        {
            using var serviceProvider = services.BuildServiceProvider();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var section = configuration.GetSection(sectionName);
            var options = new T();
            section.Bind(options);
            return options;
        }
    }
}
