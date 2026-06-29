using Microsoft.AspNetCore.Mvc;
using Pace.Api.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;

namespace Pace.Api.Controllers
{
    public class DebtsController : PaceBaseController
    {
        private readonly IRepositoryX<Debt> _repo;
        private readonly IUnitOfWork _uow;

        public DebtsController(IRepositoryX<Debt> repo, IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        [HttpGet]
        public async Task<IEnumerable<Debt>> Get()
            => await _repo.Query()
                .Where(x => x.IsDelete != true && x.UserId == UserId)
                .OrderByDescending(x => x.CreatedDate)
                .SelectAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Debt>> Get(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete == true || item.UserId != UserId)
                return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<Debt>> Post([FromBody] Debt item)
        {
            item.UserId = UserId;
            _repo.Insert(item);
            await _uow.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Debt item)
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
