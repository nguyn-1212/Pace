using Microsoft.AspNetCore.Mvc;
using Pace.Api.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;

namespace Pace.Api.Controllers
{
    public class GoalLogsController : PaceBaseController
    {
        private readonly IRepositoryX<GoalLog> _repo;
        private readonly IRepositoryX<Goal> _goalRepo;
        private readonly IUnitOfWork _uow;

        public GoalLogsController(IRepositoryX<GoalLog> repo, IRepositoryX<Goal> goalRepo, IUnitOfWork uow)
        {
            _repo = repo;
            _goalRepo = goalRepo;
            _uow = uow;
        }

        [HttpGet]
        public async Task<IEnumerable<GoalLog>> Get([FromQuery] int? goalId = null)
        {
            var query = _repo.Query().Where(x => x.IsDelete != true && x.UserId == UserId);
            if (goalId.HasValue)
                query = query.Where(x => x.GoalId == goalId.Value);
            return await query.OrderByDescending(x => x.LogDate).SelectAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GoalLog>> Get(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete == true || item.UserId != UserId)
                return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<GoalLog>> Post([FromBody] GoalLog item)
        {
            var goal = await _goalRepo.FindAsync(item.GoalId);
            if (goal == null || goal.IsDelete == true || goal.UserId != UserId)
                return NotFound("Goal not found");
            item.UserId = UserId;
            _repo.Insert(item);
            await _uow.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] GoalLog item)
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
