using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pace.Api.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Pace.Api.Controllers
{
    public class DashboardController : PaceBaseController
    {
        private readonly PaceContext _db;

        public DashboardController(PaceContext db) => _db = db;

        /// <summary>Home screen summary — totals for current month + active counts</summary>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var uid = UserId;
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1);
            var today = now.Date;

            // Finance
            var txThisMonth = await _db.Transactions
                .Where(t => !t.IsDelete && t.UserId == uid && t.TransactionDate >= monthStart)
                .ToListAsync();

            var income = txThisMonth.Where(t => t.Type == 1).Sum(t => t.Amount);
            var expense = txThisMonth.Where(t => t.Type == 0).Sum(t => t.Amount);

            // Goals
            var activeGoals = await _db.Goals
                .CountAsync(g => !g.IsDelete && g.UserId == uid && g.Status == 0);

            // Habits — active habits + how many done today
            var activeHabits = await _db.Habits
                .Where(h => !h.IsDelete && h.UserId == uid && h.Status == 0)
                .Select(h => h.Id)
                .ToListAsync();

            var doneTodayCount = await _db.HabitLogs
                .CountAsync(l => !l.IsDelete && l.UserId == uid
                    && activeHabits.Contains(l.HabitId)
                    && l.LogDate.Date == today && l.IsCompleted);

            // Journal — count this month
            var journalsThisMonth = await _db.Journals
                .CountAsync(j => !j.IsDelete && j.UserId == uid && j.JournalDate >= monthStart);

            // Debts — unpaid total
            var debtOwed = await _db.Debts
                .Where(d => !d.IsDelete && d.UserId == uid && !d.IsPaid)
                .SumAsync(d => (decimal?)d.Amount) ?? 0;

            return Ok(new
            {
                Finance = new { Income = income, Expense = expense, Balance = income - expense },
                Goals = new { Active = activeGoals },
                Habits = new { Active = activeHabits.Count, DoneToday = doneTodayCount },
                Journal = new { ThisMonth = journalsThisMonth },
                Debts = new { TotalUnpaid = debtOwed },
            });
        }
    }
}
