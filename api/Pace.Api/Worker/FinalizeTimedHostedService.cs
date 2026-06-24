using Lazy.Travel.Api.Data;
using Lazy.Travel.Api.Data.Enums;
using Lazy.Travel.Api.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using URF.Core.EF.Trackable;

namespace Lazy.Travel.Api.Worker
{
    public class FinalizeTimedHostedService : IHostedService, IDisposable
    {

        private Timer _timer;
        private static bool processing = false;
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;

        public FinalizeTimedHostedService(
            IConfiguration configuration,
            IServiceProvider serviceProvider)
        {
            _configuration = configuration;
            _serviceProvider = serviceProvider;
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
            catch
            {

            }
            processing = false;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        public int KillSleepingConnections(int iMinSecondsToExpire)
        {
            string strSQL = "show processlist";
            System.Collections.ArrayList m_ProcessesToKill = new ArrayList();

            var appSettingsSection = _configuration.GetSection("AppSettings");
            var appSettings = appSettingsSection.Get<AppSettings>();
            var connectionString = _configuration.GetConnectionString(nameof(LazyContext));

            MySqlConnection myConn = new MySqlConnection(connectionString);
            MySqlCommand myCmd = new MySqlCommand(strSQL, myConn);
            MySqlDataReader MyReader = null;

            try
            {
                myConn.Open();

                // Get a list of processes to kill.
                MyReader = myCmd.ExecuteReader();
                while (MyReader.Read())
                {
                    // Find all processes sleeping with a timeout value higher than our threshold.
                    int iPID = Convert.ToInt32(MyReader["Id"].ToString());
                    string strState = MyReader["Command"].ToString();
                    int iTime = Convert.ToInt32(MyReader["Time"].ToString());

                    if (strState == "Sleep" && iTime >= iMinSecondsToExpire && iPID > 0)
                    {
                        // This connection is sitting around doing nothing. Kill it.
                        m_ProcessesToKill.Add(iPID);
                    }
                }

                MyReader.Close();

                foreach (int aPID in m_ProcessesToKill)
                {
                    strSQL = "kill " + aPID;
                    myCmd.CommandText = strSQL;
                    myCmd.ExecuteNonQuery();
                }
            }
            catch
            {
            }
            finally
            {
                if (MyReader != null && !MyReader.IsClosed)
                {
                    MyReader.Close();
                }

                if (myConn != null && myConn.State == ConnectionState.Open)
                {
                    myConn.Close();
                }
            }

            return m_ProcessesToKill.Count;
        }
    }
}
