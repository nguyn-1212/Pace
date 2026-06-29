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
    public class TransactionsController : PaceBaseController
    {
        private readonly IRepositoryX<Transaction> _repo;
        private readonly IUnitOfWork _uow;
        private readonly PaceContext _db;

        public TransactionsController(IRepositoryX<Transaction> repo, IUnitOfWork uow, PaceContext db)
        {
            _repo = repo;
            _uow = uow;
            _db = db;
        }

        /// <summary>Monthly summary: income, expense, balance + breakdown by category</summary>
        [HttpGet("summary")]
        public async Task<IActionResult> Summary([FromQuery] int year = 0, [FromQuery] int month = 0)
        {
            if (year == 0) year = DateTime.UtcNow.Year;
            if (month == 0) month = DateTime.UtcNow.Month;

            var from = new DateTime(year, month, 1);
            var to = from.AddMonths(1);

            var txs = await _db.Transactions
                .Where(t => t.IsDelete != true && t.UserId == UserId
                    && t.TransactionDate >= from && t.TransactionDate < to)
                .Include(t => t.Category)
                .ToListAsync();

            var income = txs.Where(t => t.Type == 1).Sum(t => t.Amount);
            var expense = txs.Where(t => t.Type == 0).Sum(t => t.Amount);

            var byCategory = txs
                .GroupBy(t => new { t.CategoryId, Name = t.Category?.Name ?? "Khác" })
                .Select(g => new
                {
                    g.Key.CategoryId,
                    g.Key.Name,
                    Total = g.Sum(t => t.Amount),
                    Count = g.Count(),
                })
                .OrderByDescending(x => x.Total)
                .ToList();

            return Ok(new { Year = year, Month = month, Income = income, Expense = expense, Balance = income - expense, ByCategory = byCategory });
        }

        [HttpGet]
        public async Task<IEnumerable<Transaction>> Get([FromQuery] int page = 1, [FromQuery] int size = 20)
            => await _repo.Query()
                .Where(x => x.IsDelete != true && x.UserId == UserId)
                .OrderByDescending(x => x.TransactionDate)
                .Skip((page - 1) * size)
                .Take(size)
                .SelectAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> Get(int id)
        {
            var item = await _repo.FindAsync(id);
            if (item == null || item.IsDelete == true || item.UserId != UserId)
                return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<Transaction>> Post([FromBody] Transaction item)
        {
            item.UserId = UserId;
            _repo.Insert(item);
            await _uow.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Transaction item)
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
