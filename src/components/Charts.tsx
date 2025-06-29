import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { CategoryData } from '../types';
import { formatCurrency } from '../utils/export';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

interface ChartsProps {
  incomeCategories: CategoryData[];
  expenseCategories: CategoryData[];
  monthlyData: { month: string; income: number; expenses: number }[];
}

const Charts: React.FC<ChartsProps> = ({ incomeCategories, expenseCategories, monthlyData }) => {
  const pieColors = [
    '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#14B8A6'
  ];

  const expensePieData = {
    labels: expenseCategories.map(cat => cat.category),
    datasets: [{
      data: expenseCategories.map(cat => cat.amount),
      backgroundColor: pieColors.slice(0, expenseCategories.length),
      borderWidth: 2,
      borderColor: '#fff',
      hoverBorderWidth: 3,
      hoverBorderColor: '#fff'
    }]
  };

  const incomePieData = {
    labels: incomeCategories.map(cat => cat.category),
    datasets: [{
      data: incomeCategories.map(cat => cat.amount),
      backgroundColor: pieColors.slice(0, incomeCategories.length),
      borderWidth: 2,
      borderColor: '#fff',
      hoverBorderWidth: 3,
      hoverBorderColor: '#fff'
    }]
  };

  const monthlyBarData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(data => data.income),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(data => data.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#4b5563',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed || context.raw;
            return `${context.label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        }
      }
    }
  };

  if (incomeCategories.length === 0 && expenseCategories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Data Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add some transactions to see your financial charts and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      {monthlyData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Monthly Income vs Expenses
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={monthlyBarData} options={barOptions} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        {expenseCategories.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Expenses by Category
            </h3>
            <div style={{ height: '300px' }}>
              <Pie data={expensePieData} options={chartOptions} />
            </div>
            <div className="mt-4 space-y-2">
              {expenseCategories.slice(0, 5).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pieColors[index] }}
                    />
                    <span className="text-gray-600 dark:text-gray-300">{category.category}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(category.amount)} ({category.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Income Categories */}
        {incomeCategories.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Income by Category
            </h3>
            <div style={{ height: '300px' }}>
              <Pie data={incomePieData} options={chartOptions} />
            </div>
            <div className="mt-4 space-y-2">
              {incomeCategories.slice(0, 5).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pieColors[index] }}
                    />
                    <span className="text-gray-600 dark:text-gray-300">{category.category}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(category.amount)} ({category.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;