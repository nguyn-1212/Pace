using Lazy.Travel.Api.Data;
using Lazy.Travel.Api.Data.Entities;
using Lazy.Travel.Api.Helpers;
using Lazy.Travel.Api.Middlewares;
using Lazy.Travel.Api.Service.Caching;
using Lazy.Travel.Api.Services.Contract;
using Lazy.Travel.Api.Services.Implement;
using Lazy.Travel.Api.Worker;
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
using URF.Core.Services.Contract;
using URF.Core.Services.Hubs;
using URF.Core.Services.Implement;
using Category = Lazy.Travel.Api.Data.Entities.Category;
using Configuration = Lazy.Travel.Api.Data.Entities.Configuration;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // configuration
        var configuration = builder.Configuration;

        // appSettings
        var appSettingsSection = configuration.GetSection("AppSettings");
        var appSettings = appSettingsSection.Get<AppSettings>();
        builder.Services.Configure<AppSettings>(appSettingsSection);

        // startup
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

        // swagger
        builder.Services.ConfigureSwaggerGen(options =>
        {
            options.CustomSchemaIds(x => x.FullName);
        });
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
                    "http://travel.lazy.vn",
                    "https://travel.lazy.vn",
                    "http://api-travel.lazy.vn",
                    "https://api-travel.lazy.vn"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithExposedHeaders("*"); // Expose all headers
            });
        });

        // base
        builder.Services.AddScoped<ICacheBase, CacheBase>();
        builder.Services.AddScoped<INotifyHub, NotifyHub>();
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IMemoryCache, MemoryCache>();
        builder.Services.AddScoped<DbContext, LazyContext>();

        // identity
        builder.Services.AddIdentity<User, Role>(o =>
        {
            o.Password.RequiredLength = 8;
            o.User.RequireUniqueEmail = true;
            o.Lockout.AllowedForNewUsers = true;
            o.Lockout.MaxFailedAccessAttempts = 3;
            o.Password.RequireNonAlphanumeric = false;
            o.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        })
        .AddEntityFrameworkStores<LazyContext>()
        .AddDefaultTokenProviders();

        // jwt authentication
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

        // repository
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
        builder.Services.AddScoped<IRepositoryX<Configuration>, RepositoryX<Configuration>>();
        builder.Services.AddScoped<IRepositoryX<EmailTemplate>, RepositoryX<EmailTemplate>>();
        builder.Services.AddScoped<IRepositoryX<RequestFilter>, RepositoryX<RequestFilter>>();
        builder.Services.AddScoped<IRepositoryX<LanguageDetail>, RepositoryX<LanguageDetail>>();
        builder.Services.AddScoped<IRepositoryX<LinkPermission>, RepositoryX<LinkPermission>>();
        builder.Services.AddScoped<IRepositoryX<UserPermission>, RepositoryX<UserPermission>>();
        builder.Services.AddScoped<IRepositoryX<RolePermission>, RepositoryX<RolePermission>>();

        // chat
        builder.Services.AddScoped<IRepositoryX<Group>, RepositoryX<Group>>();
        builder.Services.AddScoped<IRepositoryX<Message>, RepositoryX<Message>>();
        builder.Services.AddScoped<IRepositoryX<UserGroup>, RepositoryX<UserGroup>>();

        // builder.Services
        builder.Services.AddScoped<ITeamService, TeamService>();
        builder.Services.AddScoped<IRoleService, RoleService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IEmailService, EmailService>();
        builder.Services.AddScoped<INotifyService, NotifyService>();
        builder.Services.AddScoped<IUploadService, UploadService>();
        builder.Services.AddScoped<ITenantService, TenantService>();
        builder.Services.AddScoped<IUtilityService, UtilityService>();
        builder.Services.AddScoped<ISecurityService, SecurityService>();
        builder.Services.AddScoped<IDepartmentService, DepartmentService>();
        builder.Services.AddScoped<IPermissionService, PermissionService>();
        builder.Services.AddScoped<IRefreshDataService, RefreshDataService>();
        
        
        // CRM
        builder.Services.AddScoped<IRepositoryX<Category>, RepositoryX<Category>>();

        // Lazy Travel
        builder.Services.AddScoped<IRepositoryX<UserProfile>, RepositoryX<UserProfile>>();
        builder.Services.AddScoped<IRepositoryX<UserInterest>, RepositoryX<UserInterest>>();
        builder.Services.AddScoped<IRepositoryX<UserBadge>, RepositoryX<UserBadge>>();
        builder.Services.AddScoped<IRepositoryX<UserBankAccount>, RepositoryX<UserBankAccount>>();
        builder.Services.AddScoped<IRepositoryX<Friendship>, RepositoryX<Friendship>>();
        builder.Services.AddScoped<IRepositoryX<Trip>, RepositoryX<Trip>>();
        builder.Services.AddScoped<IRepositoryX<TripMember>, RepositoryX<TripMember>>();
        builder.Services.AddScoped<IRepositoryX<TripDay>, RepositoryX<TripDay>>();
        builder.Services.AddScoped<IRepositoryX<TripActivity>, RepositoryX<TripActivity>>();
        builder.Services.AddScoped<IRepositoryX<TripDestination>, RepositoryX<TripDestination>>();
        builder.Services.AddScoped<IRepositoryX<TripInviteLink>, RepositoryX<TripInviteLink>>();
        builder.Services.AddScoped<IRepositoryX<Place>, RepositoryX<Place>>();
        builder.Services.AddScoped<IRepositoryX<PlaceTag>, RepositoryX<PlaceTag>>();
        builder.Services.AddScoped<IRepositoryX<PlaceWeather>, RepositoryX<PlaceWeather>>();
        builder.Services.AddScoped<IRepositoryX<PlaceReview>, RepositoryX<PlaceReview>>();
        builder.Services.AddScoped<IRepositoryX<CheckIn>, RepositoryX<CheckIn>>();
        builder.Services.AddScoped<IRepositoryX<CheckInReaction>, RepositoryX<CheckInReaction>>();
        builder.Services.AddScoped<IRepositoryX<Expense>, RepositoryX<Expense>>();
        builder.Services.AddScoped<IRepositoryX<ExpenseSplit>, RepositoryX<ExpenseSplit>>();
        builder.Services.AddScoped<IRepositoryX<TripSettlement>, RepositoryX<TripSettlement>>();
        builder.Services.AddScoped<IRepositoryX<ExpenseSettlement>, RepositoryX<ExpenseSettlement>>();
        builder.Services.AddScoped<IRepositoryX<PhotoAlbum>, RepositoryX<PhotoAlbum>>();
        builder.Services.AddScoped<IRepositoryX<TripPhoto>, RepositoryX<TripPhoto>>();
        builder.Services.AddScoped<IRepositoryX<PhotoComment>, RepositoryX<PhotoComment>>();
        builder.Services.AddScoped<IRepositoryX<PhotoReaction>, RepositoryX<PhotoReaction>>();
        builder.Services.AddScoped<IRepositoryX<PhotoTag>, RepositoryX<PhotoTag>>();
        builder.Services.AddScoped<IRepositoryX<Vote>, RepositoryX<Vote>>();
        builder.Services.AddScoped<IRepositoryX<VoteOption>, RepositoryX<VoteOption>>();
        builder.Services.AddScoped<IRepositoryX<VoteResponse>, RepositoryX<VoteResponse>>();
        builder.Services.AddScoped<IRepositoryX<TripAnnouncement>, RepositoryX<TripAnnouncement>>();
        builder.Services.AddScoped<IRepositoryX<TripChat>, RepositoryX<TripChat>>();
        builder.Services.AddScoped<IRepositoryX<ChatMessage>, RepositoryX<ChatMessage>>();
        builder.Services.AddScoped<IRepositoryX<ChatMessageAttachment>, RepositoryX<ChatMessageAttachment>>();
        builder.Services.AddScoped<IRepositoryX<TripDoc>, RepositoryX<TripDoc>>();
        builder.Services.AddScoped<IRepositoryX<TripDocTag>, RepositoryX<TripDocTag>>();
        builder.Services.AddScoped<IRepositoryX<TimelineEntry>, RepositoryX<TimelineEntry>>();
        builder.Services.AddScoped<IRepositoryX<ExploreArticle>, RepositoryX<ExploreArticle>>();
        builder.Services.AddScoped<IRepositoryX<TripTemplate>, RepositoryX<TripTemplate>>();
        builder.Services.AddScoped<IRepositoryX<TripTemplateActivity>, RepositoryX<TripTemplateActivity>>();
        builder.Services.AddScoped<IRepositoryX<NotificationSetting>, RepositoryX<NotificationSetting>>();
        builder.Services.AddScoped<IRepositoryX<UserPrivacySetting>, RepositoryX<UserPrivacySetting>>();
        builder.Services.AddScoped<IRepositoryX<UserAppSetting>, RepositoryX<UserAppSetting>>();
        builder.Services.AddScoped<IRepositoryX<UserActivityStat>, RepositoryX<UserActivityStat>>();
        builder.Services.AddScoped<IRepositoryX<UserLocationHistory>, RepositoryX<UserLocationHistory>>();


        // config
        builder.Services.Configure<TenantSettings>(configuration.GetSection(nameof(TenantSettings)));
        builder.Services.AddAndMigrateTenantDatabases<LazyContext>(configuration);
        StoreHelper.SchemaWebAdmin = appSettings.SchemaWebAdmin;
        StoreHelper.SchemaWeb = appSettings.SchemaWeb;
        StoreHelper.SchemaApi = appSettings.SchemaApi;

        // sentry
        if (!appSettings.SentryDsn.IsStringNullOrEmpty())
            Sentry.SentrySdk.Init(appSettings.SentryDsn);

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseMiddleware<LoggerMiddleware>();
        
        // CORS phải đặt TRƯỚC UseRouting và UseAuthorization
        app.UseCors("AllowedOrigins");
        
        //app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseStaticFiles();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHub<NotifyHub>("/notifyhub");
        });
        
        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"resources")),
            RequestPath = new PathString("/resources")
        });
        app.Use(async (context, next) =>
        {
            context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null; // unlimited I guess
            await next.Invoke();
        });
        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        });

        app.Run();
    }
}
