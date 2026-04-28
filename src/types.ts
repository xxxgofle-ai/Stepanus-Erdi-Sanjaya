export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Rent', 'Shopping', 'Health', 'Education', 'Entertainment', 'Bills', 'Other']
};
