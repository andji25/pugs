export class Trip {
  constructor(id, name, description, startDate, endDate, budget, notes, userId, createdAt, totalExpenses, remainingBudget) {
    this.id = id
    this.name = name
    this.description = description
    this.startDate = startDate
    this.endDate = endDate
    this.budget = budget
    this.notes = notes
    this.userId = userId
    this.createdAt = createdAt
    this.totalExpenses = totalExpenses
    this.remainingBudget = remainingBudget
  }

}