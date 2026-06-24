using Microsoft.AspNetCore.Mvc;
using Pace.Api.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;

namespace Pace.Api.Controllers
{
    public class RemindersController : PaceBaseController
    {
        private readonly IRepositoryX<Reminder> _repo;
        private readonly IUnitOfWork _uow;

        public RemindersController(IRepositoryX<Reminder> repo, IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        [HttpGet]
        public async Task<IEnumerable<Reminder>> Get()
            => await _repo.Query()
                .Where(x => !x.IsDelete && x.UserId == UserId)
                .OrderBy(x => x.ReminderTime)
                .SelectAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Reminder>> Get(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete || item.UserId != UserId)
                return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<Reminder>> Post([FromBody] Reminder item)
        {
            item.UserId = UserId;
            _repo.Insert(item);
            await _uow.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Reminder item)
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
