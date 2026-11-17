
import { Wallet, Search, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import  { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import TransactionCard from "../Finance/TransactionCard";

const TransactionGrid = ({
  transactions,
  emptyMessage,
  isLoading,
  onEdit,
  onDeleteTransaction,
  onFinanceChange,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <Wallet className="mx-auto h-12 w-12 text-muted-foreground" />

          <h3 className="mt-4 text-sm font-medium text-foreground">
            No transactions found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction._id}
          transaction={transaction}
          onEdit={onEdit}
          onDeleteTransaction={onDeleteTransaction}
          onFinanceChange={onFinanceChange}
        />
      ))}
    </div>
  );
};

const TransactionList = ({
  transactions = [],
  isLoading = false,
  onEdit,
  onDeleteTransaction,
  onFinanceChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");


  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : transactions?.transactions || transactions?.data || [];

  const filteredTransactions = safeTransactions.filter((transaction) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      transaction.title?.toLowerCase().includes(search) ||
      transaction.description?.toLowerCase().includes(search) ||
      transaction.category?.toLowerCase().includes(search) ||
      transaction.type?.toLowerCase().includes(search);

    return matchesSearch;
  });


  const getFinanceStats = () => {
    const totalIncome = safeTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const totalExpenses = safeTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const totalBalance = totalIncome - totalExpenses;

    const categorizedTransactions = {
      all: filteredTransactions,
      balance: filteredTransactions,
      income: filteredTransactions.filter(
        (transaction) => transaction.type === "income"
      ),
      expenses: filteredTransactions.filter(
        (transaction) => transaction.type === "expense"
      ),
    };

    const stats = {
      total: safeTransactions.length,
      totalIncome,
      totalExpenses,
      totalBalance,
    };

    return { stats, categorizedTransactions };
  };

  const { stats, categorizedTransactions } = getFinanceStats();

  return (
    <div className="space-y-6">
   
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Balance
            </p>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>

          <p className="text-2xl font-bold text-foreground">
            ${stats.totalBalance.toFixed(2)}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Income
            </p>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </div>

          <p className="text-2xl font-bold text-green-600">
            ${stats.totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </p>
            <ArrowDownCircle className="h-4 w-4 text-red-600" />
          </div>

          <p className="text-2xl font-bold text-red-600">
            ${stats.totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />

          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            <Badge variant="secondary">{stats.total}</Badge>
          </TabsTrigger>

          <TabsTrigger value="balance" className="flex items-center gap-2">
            Balance
            <Badge variant="secondary">${stats.totalBalance.toFixed(2)}</Badge>
          </TabsTrigger>

          <TabsTrigger value="income" className="flex items-center gap-2">
            Income
            <Badge variant="secondary">${stats.totalIncome.toFixed(2)}</Badge>
          </TabsTrigger>

          <TabsTrigger value="expenses" className="flex items-center gap-2">
            Expenses
            <Badge variant="secondary">${stats.totalExpenses.toFixed(2)}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TransactionGrid
            transactions={categorizedTransactions.all}
            emptyMessage="You haven't added any transactions yet."
            isLoading={isLoading}
            onEdit={onEdit}
            onDeleteTransaction={onDeleteTransaction}
            onFinanceChange={onFinanceChange}
          />
        </TabsContent>

   
        <TabsContent value="balance">
          <TransactionGrid
            transactions={categorizedTransactions.balance}
            emptyMessage="No transactions available to calculate your balance."
            isLoading={isLoading}
            onEdit={onEdit}
            onDeleteTransaction={onDeleteTransaction}
            onFinanceChange={onFinanceChange}
          />
        </TabsContent>

     
        <TabsContent value="income">
          <TransactionGrid
            transactions={categorizedTransactions.income}
            emptyMessage="No income transactions found."
            isLoading={isLoading}
            onEdit={onEdit}
            onDeleteTransaction={onDeleteTransaction}
            onFinanceChange={onFinanceChange}
          />
        </TabsContent>

    
        <TabsContent value="expenses">
          <TransactionGrid
            transactions={categorizedTransactions.expenses}
            emptyMessage="No expense transactions found."
            isLoading={isLoading}
            onEdit={onEdit}
            onDeleteTransaction={onDeleteTransaction}
            onFinanceChange={onFinanceChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionList;
