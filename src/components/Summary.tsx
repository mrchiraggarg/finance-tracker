import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Hash } from 'lucide-react';
import { FinancialSummary } from '../types';
import { formatCurrency } from '../utils/export';

interface SummaryProps {
  summary: FinancialSummary;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const cards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Balance',
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 
        ? 'text-indigo-600 dark:text-indigo-400' 
        : 'text-red-600 dark:text-red-400',
      bgColor: summary.balance >= 0 
        ? 'bg-indigo-50 dark:bg-indigo-900/20' 
        : 'bg-red-50 dark:bg-red-900/20',
      borderColor: summary.balance >= 0 
        ? 'border-indigo-200 dark:border-indigo-800' 
        : 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Transactions',
      value: summary.transactionCount,
      icon: Hash,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      isCount: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`
              ${card.bgColor} ${card.borderColor} 
              border rounded-xl p-6 
              hover:shadow-lg hover:scale-105 
              transition-all duration-300 
              transform hover:-translate-y-1
              animate-fade-in
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.color} mt-1`}>
                  {card.isCount 
                    ? card.value.toLocaleString()
                    : formatCurrency(card.value)
                  }
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Summary;