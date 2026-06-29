using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Pace.Api.Data;
using Pace.Api.Data.Entities;
using Pace.Api.Helpers;
using Pace.Api.Middlewares;
using Pace.Api.Worker;
using System;
using System.IO;
using System.Text;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;
using URF.Core.EF;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Constants;
using URF.Core.EF.Trackable.Entities;
using URF.Core.EF.Trackable.Entities.Message;
using URF.Core.EF.Trackable.Models;
using URF.Core.Helper.Extensions;
using URF.Core.Services.Hubs;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var configuration = builder.Configuration;

        var appSettingsSection = configuration.GetSection("AppSettings");
        var appSettings = appSettingsSection.Get<AppSettings>();
        builder.Services.Configure<AppSettings>(appSettingsSection);

        builder.Services.Configure<IISServerOptions>(options =>
        {
            options.AllowSynchronousIO = true;
            options.MaxRequestBodySize = long.MaxValue;
        });
        builder.Services.Configure<KestrelServerOptions>(options =>
        {
            options.AllowSynchronousIO = true;
            options.Limits.MaxRequestBodySize = long.MaxValue;
            options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(30);
        });
        builder.Services
            .AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
                options.MaximumReceiveMessageSize = 102400000;
            })
            .AddNewtonsoftJsonProtocol(options =>
            {
                options.PayloadSerializerSettings.ContractResolver = new DefaultContractResolver();
                options.PayloadSerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });
        builder.Services.AddMemoryCache();
        builder.Services.AddHttpContextAccessor();
        builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        builder.Services.AddControllers()
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
            });

        builder.Services.ConfigureSwaggerGen(options => options.CustomSchemaIds(x => x.FullName));
        builder.Services.AddHostedService<BackgroundInitialWorker>();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowedOrigins", policy =>
            {
                policy.WithOrigins(
                    "http://localhost:8080",
                    "https://localhost:8080",
                    "http://pace.lazy.vn",
                    "https://pace.lazy.vn",
                    "http://api-pace.lazy.vn",
                    "https://api-pace.lazy.vn"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithExposedHeaders("*");
            });
        });

        // Base services
        builder.Services.AddScoped<INotifyHub, NotifyHub>();
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IMemoryCache, MemoryCache>();
        builder.Services.AddScoped<DbContext, PaceContext>();

        // Identity
        builder.Services.AddIdentity<User, Role>(o =>
        {
            o.Password.RequiredLength = 8;
            o.User.RequireUniqueEmail = true;
            o.Lockout.AllowedForNewUsers = true;
            o.Lockout.MaxFailedAccessAttempts = 3;
            o.Password.RequireNonAlphanumeric = false;
            o.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        })
        .AddEntityFrameworkStores<PaceContext>()
        .AddDefaultTokenProviders();

        // JWT
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.TokenKey));
        builder.Services.AddAuthentication()
            .AddCookie(c => c.SlidingExpiration = true)
            .AddJwtBearer(c =>
            {
                c.SaveToken = true;
                c.RequireHttpsMetadata = false;
                c.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = key,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = Constant.Issuer,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = Constant.Audience,
                };
            });

        // Framework repositories
        builder.Services.AddScoped<IRepositoryX<User>, RepositoryX<User>>();
        builder.Services.AddScoped<IRepositoryX<Role>, RepositoryX<Role>>();
        builder.Services.AddScoped<IRepositoryX<Team>, RepositoryX<Team>>();
        builder.Services.AddScoped<IRepositoryX<Audit>, RepositoryX<Audit>>();
        builder.Services.AddScoped<IRepositoryX<Notify>, RepositoryX<Notify>>();
        builder.Services.AddScoped<IRepositoryX<Language>, RepositoryX<Language>>();
        builder.Services.AddScoped<IRepositoryX<UserRole>, RepositoryX<UserRole>>();
        builder.Services.AddScoped<IRepositoryX<UserTeam>, RepositoryX<UserTeam>>();
        builder.Services.AddScoped<IRepositoryX<Permission>, RepositoryX<Permission>>();
        builder.Services.AddScoped<IRepositoryX<Department>, RepositoryX<Department>>();
        builder.Services.AddScoped<IRepositoryX<LogActivity>, RepositoryX<LogActivity>>();
        builder.Services.AddScoped<IRepositoryX<SmtpAccount>, RepositoryX<SmtpAccount>>();
        builder.Services.AddScoped<IRepositoryX<UserActivity>, RepositoryX<UserActivity>>();
        builder.Services.AddScoped<IRepositoryX<LogException>, RepositoryX<LogException>>();
        builder.Services.AddScoped<IRepositoryX<EmailTemplate>, RepositoryX<EmailTemplate>>();
        builder.Services.AddScoped<IRepositoryX<RequestFilter>, RepositoryX<RequestFilter>>();
        builder.Services.AddScoped<IRepositoryX<LanguageDetail>, RepositoryX<LanguageDetail>>();
        builder.Services.AddScoped<IRepositoryX<LinkPermission>, RepositoryX<LinkPermission>>();
        builder.Services.AddScoped<IRepositoryX<UserPermission>, RepositoryX<UserPermission>>();
        builder.Services.AddScoped<IRepositoryX<RolePermission>, RepositoryX<RolePermission>>();
        builder.Services.AddScoped<IRepositoryX<Group>, RepositoryX<Group>>();
        builder.Services.AddScoped<IRepositoryX<Message>, RepositoryX<Message>>();
        builder.Services.AddScoped<IRepositoryX<UserGroup>, RepositoryX<UserGroup>>();
        builder.Services.AddScoped<IRepositoryX<Category>, RepositoryX<Category>>();

        // Pace repositories
        builder.Services.AddScoped<IRepositoryX<TransactionCategory>, RepositoryX<TransactionCategory>>();
        builder.Services.AddScoped<IRepositoryX<Transaction>, RepositoryX<Transaction>>();
        builder.Services.AddScoped<IRepositoryX<SavingGoal>, RepositoryX<SavingGoal>>();
        builder.Services.AddScoped<IRepositoryX<Debt>, RepositoryX<Debt>>();
        builder.Services.AddScoped<IRepositoryX<Goal>, RepositoryX<Goal>>();
        builder.Services.AddScoped<IRepositoryX<GoalLog>, RepositoryX<GoalLog>>();
        builder.Services.AddScoped<IRepositoryX<Habit>, RepositoryX<Habit>>();
        builder.Services.AddScoped<IRepositoryX<HabitLog>, RepositoryX<HabitLog>>();
        builder.Services.AddScoped<IRepositoryX<Reminder>, RepositoryX<Reminder>>();
        builder.Services.AddScoped<IRepositoryX<Journal>, RepositoryX<Journal>>();

        // Config & DB
        builder.Services.Configure<TenantSettings>(configuration.GetSection(nameof(TenantSettings)));
        builder.Services.AddAndMigrateTenantDatabases<PaceContext>(configuration);
        StoreHelper.SchemaApi = appSettings.SchemaApi;
        StoreHelper.SchemaWebAdmin = appSettings.SchemaWebAdmin;

        if (!appSettings.SentryDsn.IsStringNullOrEmpty())
            Sentry.SentrySdk.Init(appSettings.SentryDsn);

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseMiddleware<LoggerMiddleware>();
        app.UseCors("AllowedOrigins");
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseStaticFiles();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHub<NotifyHub>("/notifyhub");
        });

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"resources")),
            RequestPath = new PathString("/resources")
        });
        app.Use(async (context, next) =>
        {
            context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null;
            await next.Invoke();
        });
        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        });

        app.Run();
    }
}
