import { Transaction, FinancialSummary, CategoryData, TransactionFilters } from '../types';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export const calculateSummary = (transactions: Transaction[]): FinancialSummary => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance: income - expenses,
    transactionCount: transactions.length
  };
};

export const getCategoryData = (transactions: Transaction[], type: 'income' | 'expense'): CategoryData[] => {
  const filtered = transactions.filter(t => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  
  const categoryMap = new Map<string, { amount: number; count: number }>();
  
  filtered.forEach(transaction => {
    const existing = categoryMap.get(transaction.category) || { amount: 0, count: 0 };
    categoryMap.set(transaction.category, {
      amount: existing.amount + transaction.amount,
      count: existing.count + 1
    });
  });

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      percentage: total > 0 ? (data.amount / total) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const filterTransactions = (transactions: Transaction[], filters: TransactionFilters): Transaction[] => {
  return transactions.filter(transaction => {
    // Type filter
    if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }

    // Category filter
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const transactionDate = parseISO(transaction.date);
      
      if (filters.dateFrom && filters.dateTo) {
        const fromDate = startOfDay(parseISO(filters.dateFrom));
        const toDate = endOfDay(parseISO(filters.dateTo));
        
        if (!isWithinInterval(transactionDate, { start: fromDate, end: toDate })) {
          return false;
        }
      } else if (filters.dateFrom) {
        const fromDate = startOfDay(parseISO(filters.dateFrom));
        if (transactionDate < fromDate) {
          return false;
        }
      } else if (filters.dateTo) {
        const toDate = endOfDay(parseISO(filters.dateTo));
        if (transactionDate > toDate) {
          return false;
        }
      }
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesDescription = transaction.description.toLowerCase().includes(searchTerm);
      const matchesCategory = transaction.category.toLowerCase().includes(searchTerm);
      const matchesNotes = transaction.notes?.toLowerCase().includes(searchTerm) || false;
      
      if (!matchesDescription && !matchesCategory && !matchesNotes) {
        return false;
      }
    }

    return true;
  });
};

export const getUniqueCategories = (transactions: Transaction[]): string[] => {
  const categories = new Set(transactions.map(t => t.category));
  return Array.from(categories).sort();
};

export const getMonthlyData = (transactions: Transaction[], months: number = 6) => {
  const now = new Date();
  const monthlyData: { month: string; income: number; expenses: number }[] = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = date.toISOString().slice(0, 7); // YYYY-MM format
    
    const monthTransactions = transactions.filter(t => 
      t.date.startsWith(monthStr)
    );
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income,
      expenses
    });
  }
  
  return monthlyData;
};