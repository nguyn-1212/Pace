using Microsoft.AspNetCore.Mvc;
using Pace.Api.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;

namespace Pace.Api.Controllers
{
    public class HabitsController : PaceBaseController
    {
        private readonly IRepositoryX<Habit> _repo;
        private readonly IUnitOfWork _uow;

        public HabitsController(IRepositoryX<Habit> repo, IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        [HttpGet]
        public async Task<IEnumerable<Habit>> Get()
            => await _repo.Query()
                .Where(x => !x.IsDelete && x.UserId == UserId)
                .OrderByDescending(x => x.CreatedDate)
                .SelectAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Habit>> Get(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete || item.UserId != UserId)
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
