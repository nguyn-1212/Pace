using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Models;

namespace Pace.Api.Worker
{
    public class FinalizeTimedHostedService : IHostedService, IDisposable
    {
        private Timer _timer;
        private static bool processing = false;
        private readonly IConfiguration _configuration;

        public FinalizeTimedHostedService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(10));
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            if (processing) return;
            try
            {
                KillSleepingConnections(100);
            }
            catch { }
            processing = false;
        }

        public void Dispose() => _timer?.Dispose();

        private void KillSleepingConnections(int minSecondsToExpire)
        {
            var options = _configuration.GetSection(nameof(TenantSettings)).Get<TenantSettings>();
            var connectionString = options?.Defaults?.ConnectionString;
            if (string.IsNullOrEmpty(connectionString)) return;

            var processesToKill = new ArrayList();
            using var conn = new MySqlConnection(connectionString);
            using var cmd = new MySqlCommand("show processlist", conn);
            try
            {
                conn.Open();
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    int pid = Convert.ToInt32(reader["Id"].ToString());
                    string state = reader["Command"].ToString();
                    int time = Convert.ToInt32(reader["Time"].ToString());
                    if (state == "Sleep" && time >= minSecondsToExpire && pid > 0)
                        processesToKill.Add(pid);
                }
                reader.Close();
                foreach (int pid in processesToKill)
                {
                    cmd.CommandText = $"kill {pid}";
                    cmd.ExecuteNonQuery();
                }
            }
            catch { }
        }
    }
}
