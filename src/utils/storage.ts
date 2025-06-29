import { Transaction, RecurringTransaction, Theme } from '../types';

const TRANSACTIONS_KEY = 'finance-tracker-transactions';
const RECURRING_KEY = 'finance-tracker-recurring';
const THEME_KEY = 'finance-tracker-theme';

export const storageUtils = {
  // Transactions
  getTransactions: (): Transaction[] => {
    try {
      const data = localStorage.getItem(TRANSACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  },

  saveTransactions: (transactions: Transaction[]): void => {
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  },

  // Recurring Transactions
  getRecurringTransactions: (): RecurringTransaction[] => {
    try {
      const data = localStorage.getItem(RECURRING_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading recurring transactions:', error);
      return [];
    }
  },

  saveRecurringTransactions: (recurring: RecurringTransaction[]): void => {
    try {
      localStorage.setItem(RECURRING_KEY, JSON.stringify(recurring));
    } catch (error) {
      console.error('Error saving recurring transactions:', error);
    }
  },

  // Theme
  getTheme: (): Theme => {
    try {
      const theme = localStorage.getItem(THEME_KEY) as Theme;
      return theme || 'light';
    } catch (error) {
      console.error('Error loading theme:', error);
      return 'light';
    }
  },

  saveTheme: (theme: Theme): void => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  // Clear all data
  clearAll: (): void => {
    try {
      localStorage.removeItem(TRANSACTIONS_KEY);
      localStorage.removeItem(RECURRING_KEY);
      localStorage.removeItem(THEME_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
};