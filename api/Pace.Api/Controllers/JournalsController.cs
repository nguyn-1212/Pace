using Microsoft.AspNetCore.Mvc;
using Pace.Api.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;

namespace Pace.Api.Controllers
{
    public class JournalsController : PaceBaseController
    {
        private readonly IRepositoryX<Journal> _repo;
        private readonly IUnitOfWork _uow;

        public JournalsController(IRepositoryX<Journal> repo, IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        [HttpGet]
        public async Task<IEnumerable<Journal>> Get([FromQuery] int page = 1, [FromQuery] int size = 20)
            => await _repo.Query()
                .Where(x => !x.IsDelete && x.UserId == UserId)
                .OrderByDescending(x => x.JournalDate)
                .Skip((page - 1) * size)
                .Take(size)
                .SelectAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Journal>> Get(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete || item.UserId != UserId)
                return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<Journal>> Post([FromBody] Journal item)
        {
            item.UserId = UserId;
            _repo.Insert(item);
            await _uow.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Journal item)
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
