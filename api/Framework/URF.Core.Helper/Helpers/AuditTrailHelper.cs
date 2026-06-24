using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using URF.Core.EF.Trackable.Entities;
using URF.Core.Helper.Extensions;

namespace URF.Core.Helper.Helpers
{
    public class AuditTrailHelper
    {
        private readonly string[] TablesToExclude = { "LogActivity", "LogException", "Audit", "UserActivity" };
        private readonly string[] PropertiesToExclude = { "CreatedDate", "CreatedBy", "UpdatedDate", "UpdatedBy", "TenantId" };

        public enum AuditActions
        {
            I,
            U,
            D
        }
        public static long? GetKeyValue(EntityEntry entry)
        {
            try
            {
                long id = 0;
                if (entry.Metadata.FindPrimaryKey().Properties.Select(p => entry.Property(p.Name).CurrentValue).FirstOrDefault() != null)
                    id = Convert.ToInt64(entry.Metadata.FindPrimaryKey().Properties.Select(p => entry.Property(p.Name).CurrentValue).FirstOrDefault());
                return id;
            }
            catch
            {
                return null;
            }
        }
        public Audit GetAudit(EntityEntry entry, int userId)
        {
            var tableName = entry.Entity.GetType().Name;
            if (TablesToExclude.Contains(tableName))
                return null;

            var tableIdValue = GetKeyValue(entry);
            if (tableIdValue.IsNumberNull())
                return null;

            var audit = new Audit
            {
                UserId = userId,
                CreatedBy = userId,
                StartTime = DateTime.Now,
                TableIdValue = GetKeyValue(entry),
                MachineName = Environment.MachineName,
                TableName = entry.Entity.GetType().Name,
            };
            if (entry.State == EntityState.Added)
            {
                audit.NewData = GetAddedData(entry);
                audit.Action = AuditActions.I.ToString();
                if (audit.NewData.IsStringNullOrEmpty())
                    return null;
            }
            else if (entry.State == EntityState.Deleted)
            {
                audit.OldData = GetDeletedData(entry);
                audit.Action = AuditActions.D.ToString();
                if (audit.OldData.IsStringNullOrEmpty())
                    return null;
            }
            else if (entry.State == EntityState.Modified)
            {
                var items = GetModifiedData(entry);
                audit.OldData = items[0].ToString();
                audit.NewData = items[1].ToString();
                audit.Action = AuditActions.U.ToString();
                if (audit.NewData.IsStringNullOrEmpty() || audit.OldData.IsStringNullOrEmpty())
                    return null;
            }
            return audit;
        }

        private string GetAddedData(EntityEntry entry)
        {
            var newData = new Dictionary<string, object>();
            foreach (var property in entry.Properties)
            {
                string propertyName = property.Metadata.Name;
                if (!PropertiesToExclude.Contains(propertyName))
                {
                    var newVal = entry.CurrentValues[propertyName];
                    if (newVal != null)
                        newData.Add(propertyName, newVal);
                }
            }
            return newData.IsNullOrEmpty() ? string.Empty : newData.ToJson();
        }
        private string GetDeletedData(EntityEntry entry)
        {
            var oldData = new Dictionary<string, object>();
            foreach (var property in entry.Properties)
            {
                string propertyName = property.Metadata.Name;
                if (!PropertiesToExclude.Contains(propertyName))
                {
                    var oldVal = property.OriginalValue;
                    if (oldVal != null)
                        oldData.Add(propertyName, oldVal);
                }
            }
            return oldData.IsNullOrEmpty() ? string.Empty : oldData.ToJson();
        }
        private List<string> GetModifiedData(EntityEntry entry)
        {
            var oldData = new Dictionary<string, object>();
            var newData = new Dictionary<string, object>();
            foreach (var property in entry.Properties)
            {
                string propertyName = property.Metadata.Name;
                if (!PropertiesToExclude.Contains(propertyName))
                {
                    var oldVal = property.OriginalValue;
                    var newVal = property.CurrentValue;
                    if (!Equals(oldVal, newVal))
                    {
                        newData.Add(propertyName, newVal);
                        oldData.Add(propertyName, oldVal);
                    }
                }
            }
            return new List<string> { oldData.IsNullOrEmpty() ? string.Empty : oldData.ToJson(), newData.IsNullOrEmpty() ? string.Empty : newData.ToJson() };
        }
    }
}
