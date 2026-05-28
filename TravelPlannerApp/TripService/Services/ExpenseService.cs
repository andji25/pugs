using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.DTOs;
using TripService.Models;

namespace TripService.Services
{
    public class ExpenseService
    {
        private readonly AppDbContext _context;

        public ExpenseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ExpenseResponseDto>> GetExpensesByTrip(int tripId)
        {
            return await _context.Expenses
                .Where(e => e.TripId == tripId)
                .Select(e => new ExpenseResponseDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Category = e.Category,
                    Amount = e.Amount,
                    Date = e.Date,
                    Description = e.Description,
                    TripId = e.TripId
                })
                .ToListAsync();
        }

        public async Task<ExpenseResponseDto> CreateExpense(CreateExpenseDto dto)
        {
            if (dto.Amount <= 0)
                throw new Exception("Amount must be greater than zero");

            var expense = new Expense
            {
                Name = dto.Name,
                Category = dto.Category,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description,
                TripId = dto.TripId
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return new ExpenseResponseDto
            {
                Id = expense.Id,
                Name = expense.Name,
                Category = expense.Category,
                Amount = expense.Amount,
                Date = expense.Date,
                Description = expense.Description,
                TripId = expense.TripId
            };
        }

        public async Task<ExpenseResponseDto> UpdateExpense(int id, CreateExpenseDto dto)
        {
            var expense = await _context.Expenses.FindAsync(id);

            if (expense == null)
                throw new Exception("Expense not found");

            if (dto.Amount <= 0)
                throw new Exception("Amount must be greater than zero");

            expense.Name = dto.Name;
            expense.Category = dto.Category;
            expense.Amount = dto.Amount;
            expense.Date = dto.Date;
            expense.Description = dto.Description;

            await _context.SaveChangesAsync();

            return new ExpenseResponseDto
            {
                Id = expense.Id,
                Name = expense.Name,
                Category = expense.Category,
                Amount = expense.Amount,
                Date = expense.Date,
                Description = expense.Description,
                TripId = expense.TripId
            };
        }

        public async Task DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);

            if (expense == null)
                throw new Exception("Expense not found");

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
        }
    }
}
