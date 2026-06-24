using Microsoft.AspNetCore.Mvc;
using Pace.Api.Data.Entities;
using System.Collections.Generic;
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

        public HabitLogsController(IRepositoryX<HabitLog> repo, IRepositoryX<Habit> habitRepo, IUnitOfWork uow)
        {
            _repo = repo;
            _habitRepo = habitRepo;
            _uow = uow;
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
            return NoContent();
        }
    }
}
