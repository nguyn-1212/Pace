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
    public class HabitsController : PaceBaseController
    {
        private readonly IRepositoryX<Habit> _repo;
        private readonly IUnitOfWork _uow;
        private readonly PaceContext _db;

        public HabitsController(IRepositoryX<Habit> repo, IUnitOfWork uow, PaceContext db)
        {
            _repo = repo;
            _uow = uow;
            _db = db;
        }

        /// <summary>Today's active habits with completion status</summary>
        [HttpGet("today")]
        public async Task<IActionResult> Today()
        {
            var today = DateTime.UtcNow.Date;
            var uid = UserId;

            var habits = await _db.Habits
                .Where(h => h.IsDelete != true && h.UserId == uid && h.Status == 0)
                .ToListAsync();

            var logs = await _db.HabitLogs
                .Where(l => l.IsDelete != true && l.UserId == uid && l.LogDate.Date == today)
                .ToListAsync();

            var result = habits.Select(h => new
            {
                h.Id, h.Name, h.Icon, h.Color, h.Type,
                h.CurrentStreak, h.LongestStreak,
                IsDoneToday = logs.Any(l => l.HabitId == h.Id && l.IsCompleted),
                LogId = logs.FirstOrDefault(l => l.HabitId == h.Id)?.Id,
            });

            return Ok(result);
        }

        [HttpGet]
        public async Task<IEnumerable<Habit>> Get()
            => await _repo.Query()
                .Where(x => x.IsDelete != true && x.UserId == UserId)
                .OrderByDescending(x => x.CreatedDate)
                .SelectAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Habit>> Get(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete == true || item.UserId != UserId)
                return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<Habit>> Post([FromBody] Habit item)
        {
            item.UserId = UserId;
            _repo.Insert(item);
            await _uow.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Habit item)
        {
            var existing = await _repo.FindAsync(id);
            if (existing == null || existing.IsDelete == true || existing.UserId != UserId)
                return NotFound();
            item.Id = id;
            item.UserId = UserId;
            _repo.Update(item);
            await _uow.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete == true || item.UserId != UserId)
                return NotFound();
            item.IsDelete = true;
            _repo.Update(item);
            await _uow.SaveChangesAsync();
            return NoContent();
        }
    }
}
