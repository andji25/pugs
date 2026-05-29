using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [ApiController]
    [Route("api/expenses")]
    [Authorize]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpenseService _expenseService;

        public ExpensesController(ExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet("trip/{tripId}")]
        public async Task<IActionResult> GetByTrip(int tripId)
        {
            try
            {
                var expenses = await _expenseService.GetExpensesByTrip(tripId);
                return Ok(expenses);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateExpenseDto dto)
        {
            try
            {
                var expense = await _expenseService.CreateExpense(dto);
                return Ok(expense);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateExpenseDto dto)
        {
            try
            {
                var expense = await _expenseService.UpdateExpense(id, dto);
                return Ok(expense);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _expenseService.DeleteExpense(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
