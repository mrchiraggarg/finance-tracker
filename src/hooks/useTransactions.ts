import { useState, useEffect, useCallback } from 'react';
import { Transaction, RecurringTransaction } from '../types';
import { storageUtils } from '../utils/storage';
import { addDays, addWeeks, addMonths, addYears, isBefore, parseISO } from 'date-fns';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadedTransactions = storageUtils.getTransactions();
    const loadedRecurring = storageUtils.getRecurringTransactions();
    
    setTransactions(loadedTransactions);
    setRecurringTransactions(loadedRecurring);
    setLoading(false);
  }, []);

  // Save transactions when they change
  useEffect(() => {
    if (!loading) {
      storageUtils.saveTransactions(transactions);
    }
  }, [transactions, loading]);

  // Save recurring transactions when they change
  useEffect(() => {
    if (!loading) {
      storageUtils.saveRecurringTransactions(recurringTransactions);
    }
  }, [recurringTransactions, loading]);

  // Process recurring transactions
  useEffect(() => {
    if (loading) return;

    const processRecurringTransactions = () => {
      const now = new Date();
      const updates: { transactions: Transaction[]; recurring: RecurringTransaction[] } = {
        transactions: [],
        recurring: []
      };

      recurringTransactions.forEach(recurring => {
        if (!recurring.isActive) return;

        const nextDue = parseISO(recurring.nextDueDate);
        if (isBefore(nextDue, now)) {
          // Create new transaction
          const newTransaction: Transaction = {
            id: `recurring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...recurring.templateTransaction,
            date: recurring.nextDueDate,
            isRecurring: true,
            recurringFrequency: recurring.frequency,
            createdAt: new Date().toISOString()
          };

          updates.transactions.push(newTransaction);

          // Calculate next due date
          let nextDueDate: Date;
          switch (recurring.frequency) {
            case 'daily':
              nextDueDate = addDays(nextDue, 1);
              break;
            case 'weekly':
              nextDueDate = addWeeks(nextDue, 1);
              break;
            case 'monthly':
              nextDueDate = addMonths(nextDue, 1);
              break;
            case 'yearly':
              nextDueDate = addYears(nextDue, 1);
              break;
            default:
              nextDueDate = addMonths(nextDue, 1);
          }

          // Update recurring transaction
          updates.recurring.push({
            ...recurring,
            nextDueDate: nextDueDate.toISOString().split('T')[0]
          });
        } else {
          updates.recurring.push(recurring);
        }
      });

      if (updates.transactions.length > 0) {
        setTransactions(prev => [...prev, ...updates.transactions]);
        setRecurringTransactions(updates.recurring);
      }
    };

    processRecurringTransactions();
  }, [recurringTransactions, loading]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...transaction, ...updates }
          : transaction
      )
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  }, []);

  const addRecurringTransaction = useCallback((recurring: Omit<RecurringTransaction, 'id' | 'createdAt'>) => {
    const newRecurring: RecurringTransaction = {
      ...recurring,
      id: `recurring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    setRecurringTransactions(prev => [...prev, newRecurring]);
  }, []);

  const updateRecurringTransaction = useCallback((id: string, updates: Partial<RecurringTransaction>) => {
    setRecurringTransactions(prev => 
      prev.map(recurring => 
        recurring.id === id 
          ? { ...recurring, ...updates }
          : recurring
      )
    );
  }, []);

  const deleteRecurringTransaction = useCallback((id: string) => {
    setRecurringTransactions(prev => prev.filter(recurring => recurring.id !== id));
  }, []);

  const clearAllData = useCallback(() => {
    setTransactions([]);
    setRecurringTransactions([]);
    storageUtils.clearAll();
  }, []);

  return {
    transactions,
    recurringTransactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    clearAllData
  };
};