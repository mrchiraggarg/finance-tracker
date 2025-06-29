import { Transaction } from '../types';
import { format } from 'date-fns';

export const exportToCSV = (transactions: Transaction[], filename?: string): void => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  const headers = [
    'Date',
    'Type',
    'Category',
    'Description',
    'Amount',
    'Notes',
    'Recurring',
    'Created At'
  ];

  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      format(new Date(transaction.date), 'yyyy-MM-dd'),
      transaction.type,
      `"${transaction.category}"`,
      `"${transaction.description}"`,
      transaction.amount.toFixed(2),
      `"${transaction.notes || ''}"`,
      transaction.isRecurring ? 'Yes' : 'No',
      format(new Date(transaction.createdAt), 'yyyy-MM-dd HH:mm:ss')
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

export const formatDateTimeShort = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, HH:mm');
};