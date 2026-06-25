using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pace.Api.Data;
using Pace.Api.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;

namespace Pace.Api.Controllers
{
    public class HabitLogsController : PaceBaseController
    {
        private readonly IRepositoryX<HabitLog> _repo;
        private readonly IRepositoryX<Habit> _habitRepo;
        private readonly IUnitOfWork _uow;
        private readonly PaceContext _db;

        public HabitLogsController(IRepositoryX<HabitLog> repo, IRepositoryX<Habit> habitRepo, IUnitOfWork uow, PaceContext db)
        {
            _repo = repo;
            _habitRepo = habitRepo;
            _uow = uow;
            _db = db;
        }

        [HttpGet]
        public async Task<IEnumerable<HabitLog>> Get([FromQuery] int? habitId = null)
        {
            var query = _repo.Query().Where(x => !x.IsDelete && x.UserId == UserId);
            if (habitId.HasValue)
                query = query.Where(x => x.HabitId == habitId.Value);
            return await query.OrderByDescending(x => x.LogDate).SelectAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HabitLog>> Get(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete || item.UserId != UserId)
                return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<HabitLog>> Post([FromBody] HabitLog item)
        {
            var habit = await _habitRepo.FindAsync(item.HabitId);
            if (habit == null || habit.IsDelete || habit.UserId != UserId)
                return NotFound("Habit not found");

            item.UserId = UserId;
            _repo.Insert(item);
            await _uow.SaveChangesAsync();

            // Recalculate streak after saving log
            if (item.IsCompleted)
                await RecalcStreak(habit);

            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] HabitLog item)
        {
            var existing = await _repo.FindAsync(id);
            if (existing == null || existing.IsDelete || existing.UserId != UserId)
                return NotFound();
            item.Id = id;
            item.UserId = UserId;
            _repo.Update(item);
            await _uow.SaveChangesAsync();

            // Recalculate streak after update
            var habit = await _habitRepo.FindAsync(item.HabitId);
            if (habit != null)
                await RecalcStreak(habit);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete || item.UserId != UserId)
                return NotFound();
            item.IsDelete = true;
            _repo.Update(item);
            await _uow.SaveChangesAsync();

            // Recalculate streak after deleting a log
            var habit = await _habitRepo.FindAsync(item.HabitId);
            if (habit != null)
                await RecalcStreak(habit);

            return NoContent();
        }

        // Recalculates CurrentStreak and LongestStreak for a habit
        private async Task RecalcStreak(Habit habit)
        {
            var today = DateTime.UtcNow.Date;

            var completedDates = await _db.HabitLogs
                .Where(l => !l.IsDelete && l.HabitId == habit.Id && l.IsCompleted)
                .Select(l => l.LogDate.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .ToListAsync();

            int current = 0;
            int longest = 0;
            int run = 0;
            DateTime? prev = null;
            bool currentStreakDone = false;

            foreach (var date in completedDates)
            {
                if (prev == null)
                {
                    run = 1;
                    // Current streak only counts if first date is today or yesterday
                    if (!currentStreakDone && (date == today || date == today.AddDays(-1)))
                        current = 1;
                    else
                        currentStreakDone = true;
                }
                else if (date == prev.Value.AddDays(-1))
                {
                    run++;
                    if (!currentStreakDone)
                        current = run;
                }
                else
                {
                    currentStreakDone = true;
                    if (run > longest) longest = run;
                    run = 1;
                }
                prev = date;
            }

            if (run > longest) longest = run;
            if (current > longest) longest = current;

            habit.CurrentStreak = current;
            if (longest > habit.LongestStreak)
                habit.LongestStreak = longest;

            _habitRepo.Update(habit);
            await _uow.SaveChangesAsync();
        }
    }
}
