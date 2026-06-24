using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using URF.Core.EF.Trackable.Models;
using URF.Core.Helper.Extensions;
using URF.Core.Services.Contract;

namespace URF.Core.Services.Implement
{
    public class TenantService : ITenantService
    {
        private Tenant _currentTenant;
        private readonly TenantSettings _tenantSettings;

        public TenantService(
            IOptions<TenantSettings> tenantSettings,
            IHttpContextAccessor httpContextAccessor)
        {
            _tenantSettings = tenantSettings.Value;
            if (httpContextAccessor != null && httpContextAccessor.HttpContext != null)
            {
                var tenantId = httpContextAccessor.GetTenant();
                if (string.IsNullOrEmpty(tenantId))
                {
                    if (httpContextAccessor.HttpContext.Request.Headers.TryGetValue("tenant", out var tenantValue))
                        tenantId = tenantValue.ToString();
                    else
                    {
                        if (httpContextAccessor.HttpContext.Request.Headers.TryGetValue("Origin", out var origin))
                        {
                            var domain = ToDomain(origin);
                            var tenant = _tenantSettings?.Tenants?.FirstOrDefault(c => c.Domain == domain);
                            tenantId = tenant?.TID;
                        }
                        else if (httpContextAccessor.HttpContext.Request.Headers.TryGetValue("Referer", out var referer))
                        {
                            var domain = ToDomain(referer);
                            var tenant = _tenantSettings?.Tenants?.FirstOrDefault(c => c.Domain == domain);
                            tenantId = tenant?.TID;
                        }
                    }
                }
                if (!string.IsNullOrEmpty(tenantId))
                    SetTenant(tenantId);
                else
                {
                    var tenantIds = _tenantSettings?.Tenants?.Select(c => c.TID).Distinct().ToList();
                    if (!tenantIds.IsNullOrEmpty() && tenantIds.Count == 1)
                    {
                        tenantId = tenantIds.FirstOrDefault();
                        if (!string.IsNullOrEmpty(tenantId))
                            SetTenant(tenantId);
                        else throw new Exception("Invalid Tenant!");
                    }
                    else throw new Exception("Invalid Tenant!");
                }
            }
            else
            {
                var tenantIds = _tenantSettings?.Tenants?.Select(c => c.TID).Distinct().ToList();
                if (!tenantIds.IsNullOrEmpty() && tenantIds.Count == 1)
                {
                    var tenantId = tenantIds.FirstOrDefault();
                    if (!string.IsNullOrEmpty(tenantId))
                        SetTenant(tenantId);
                    else throw new Exception("Invalid Tenant!");
                }
                else throw new Exception("Invalid Tenant!");
            }
        }

        public Tenant GetTenant()
        {
            return _currentTenant;
        }
        public string GetConnectionString()
        {
            return _currentTenant?.ConnectionString;
        }
        public string GetDatabaseProvider()
        {
            return _tenantSettings.Defaults?.DBProvider;
        }
        public string GetMongoConnectionString()
        {
            return _currentTenant?.MongoConnectionString;
        }

        private string ToDomain(string source)
        {
            source = source
                .Replace("http://m.", string.Empty)
                .Replace("https://m.", string.Empty);
            source = Regex.Replace(source, @"www\d{1,}\.", string.Empty);
            source = source.Replace("https://", "")
                    .Replace("http://", "")
                    .Replace("&amp;", "&")
                    .Replace("www.", "")
                    .ToLowerInvariant()
                    .Trim(new[] { ' ', '\r', '\n', '\t', '-', '/', '\\' });
            var index = source.IndexOfAny(new[] { ' ', '/', '?', '#', ':' });
            if (index > 0) source = source.Substring(0, index);
            return source.Trim();
        }
        private void SetTenant(string tenantId)
        {
            _currentTenant = _tenantSettings.Tenants.Where(a => a.TID == tenantId).FirstOrDefault();
            if (_currentTenant == null) throw new Exception("Invalid Tenant!");
            if (string.IsNullOrEmpty(_currentTenant.ConnectionString))
            {
                SetDefaultConnectionStringToCurrentTenant();
            }
        }
        private void SetDefaultConnectionStringToCurrentTenant()
        {
            _currentTenant.ConnectionString = _tenantSettings.Defaults.ConnectionString;
            _currentTenant.MongoConnectionString = _tenantSettings.Defaults.MongoConnectionString;
        }
    }

    public static class TenantContextService
    {
        public static string GetTenant(this IHttpContextAccessor accessor)
        {
            return accessor.HttpContext.User?.FindFirst(ClaimTypes.PrimarySid)?.Value?.ToString();
        }
    }
}
