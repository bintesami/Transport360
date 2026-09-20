import React from 'react';
import prisma from '@/lib/prisma';
import FinancialReportsClient from './FinancialReportsClient';


async function getFinancialData() {
  const accounts = await prisma.account.findMany({
    orderBy: { code: 'asc' },
  });

  // Calculate Trial Balance
  let totalDebit = 0;
  let totalCredit = 0;

  const trialBalance = accounts.map((acc) => {
    let debit = 0;
    let credit = 0;

    // Normal debit balances: ASSET, EXPENSE
    // Normal credit balances: LIABILITY, EQUITY, REVENUE
    if (acc.type === 'ASSET' || acc.type === 'EXPENSE') {
      if (acc.balance >= 0) debit = acc.balance;
      else credit = Math.abs(acc.balance);
    } else {
      if (acc.balance >= 0) credit = acc.balance;
      else debit = Math.abs(acc.balance);
    }

    totalDebit += debit;
    totalCredit += credit;

    return {
      code: acc.code,
      name: acc.name,
      type: acc.type,
      debit,
      credit,
    };
  });

  // Profit & Loss
  const revenueAccounts = accounts.filter((a) => a.type === 'REVENUE');
  const expenseAccounts = accounts.filter((a) => a.type === 'EXPENSE');
  const totalRevenue = revenueAccounts.reduce((s, a) => s + a.balance, 0);
  const totalExpenses = expenseAccounts.reduce((s, a) => s + a.balance, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Balance Sheet
  const assetAccounts = accounts.filter((a) => a.type === 'ASSET');
  const liabilityAccounts = accounts.filter((a) => a.type === 'LIABILITY');
  const equityAccounts = accounts.filter((a) => a.type === 'EQUITY');

  const totalAssets = assetAccounts.reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = liabilityAccounts.reduce((s, a) => s + a.balance, 0);
  const totalEquity = equityAccounts.reduce((s, a) => s + a.balance, 0) + netIncome; // Including current profit

  return {
    trialBalance,
    totalDebit,
    totalCredit,
    profitAndLoss: {
      revenueAccounts,
      expenseAccounts,
      totalRevenue,
      totalExpenses,
      netIncome,
    },
    balanceSheet: {
      assetAccounts,
      liabilityAccounts,
      equityAccounts,
      totalAssets,
      totalLiabilities,
      totalEquity,
    },
  };
}

export default async function FinancialReportsPage() {
  const data = await getFinancialData();

  return <FinancialReportsClient initialData={data} />;
}
