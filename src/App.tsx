import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import Filters from './components/Filters';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import { useTransactions } from './hooks/useTransactions';
import { TransactionFilters } from './types';
import { 
  calculateSummary, 
  getCategoryData, 
  filterTransactions, 
  getUniqueCategories,
  getMonthlyData
} from './utils/calculations';

function App() {
  const {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addRecurringTransaction,
    clearAllData
  } = useTransactions();

  const [filters, setFilters] = useState<TransactionFilters>({});

  // Memoized filtered transactions
  const filteredTransactions = useMemo(() => 
    filterTransactions(transactions, filters), 
    [transactions, filters]
  );

  // Memoized calculations
  const summary = useMemo(() => 
    calculateSummary(filteredTransactions), 
    [filteredTransactions]
  );

  const incomeCategories = useMemo(() => 
    getCategoryData(filteredTransactions, 'income'), 
    [filteredTransactions]
  );

  const expenseCategories = useMemo(() => 
    getCategoryData(filteredTransactions, 'expense'), 
    [filteredTransactions]
  );

  const uniqueCategories = useMemo(() => 
    getUniqueCategories(transactions), 
    [transactions]
  );

  const monthlyData = useMemo(() => 
    getMonthlyData(transactions, 6), 
    [transactions]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <Summary summary={summary} />

        {/* Transaction Form */}
        <div className="mb-8">
          <TransactionForm 
            onAddTransaction={addTransaction}
            onAddRecurring={addRecurringTransaction}
          />
        </div>

        {/* Filters */}
        <Filters
          filters={filters}
          onFiltersChange={setFilters}
          transactions={filteredTransactions}
          categories={uniqueCategories}
          onClearData={clearAllData}
        />

        {/* Charts */}
        <div className="mb-8">
          <Charts
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
            monthlyData={monthlyData}
          />
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions.slice(0, 50)} // Limit for performance
          onUpdateTransaction={updateTransaction}
          onDeleteTransaction={deleteTransaction}
        />
      </main>
    </div>
  );
}

export default App;