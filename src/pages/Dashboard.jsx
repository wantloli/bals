import AuthLayout from "../components/AuthLayout";
import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import { useCustomers } from "../contexts/CustomerContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import SummaryCards from "../components/SummaryCards";
import SalesChart from "../components/SalesChart";
import TodaysTransactionsTable from "../components/TodaysTransactionsTable";
import { startOfWeek, startOfMonth, startOfYear, isAfter } from "date-fns";

function Dashboard() {
  const { transactions, fetchTransactions, isLoading } = useTransactions();
  const { customers, isLoading: isCustomersLoading } = useCustomers();
  const navigate = useNavigate();

  const [expensesTotal, setExpensesTotal] = useState(0);
  const [employeeSalariesTotal, setEmployeeSalariesTotal] = useState(0);
  const [salesFilter, setSalesFilter] = useState("monthly");

  // Calculate monthly loss
  const monthlyLoss = expensesTotal + employeeSalariesTotal;

  // Calculate this month's total sales
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  const monthlySales = useMemo(() => {
    return transactions.reduce((sum, tx) => {
      let dateObj;
      if (tx.timestamp?.seconds) {
        dateObj = new Date(tx.timestamp.seconds * 1000);
      } else {
        dateObj = new Date();
      }
      if (
        dateObj.getFullYear() === currentYear &&
        dateObj.getMonth() === currentMonth
      ) {
        return sum + (tx.totalAmount || 0);
      }
      return sum;
    }, 0);
  }, [transactions, currentYear, currentMonth]);

  // Calculate monthly income
  const monthlyIncome = monthlySales - expensesTotal;

  const totalAnnualSales = useMemo(() => {
    return transactions.reduce((sum, tx) => {
      let dateObj;
      if (tx.timestamp?.seconds) {
        dateObj = new Date(tx.timestamp.seconds * 1000);
      } else {
        dateObj = new Date();
      }
      if (dateObj.getFullYear() === currentYear) {
        return sum + (tx.totalAmount || 0);
      }
      return sum;
    }, 0);
  }, [transactions, currentYear]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.timestamp?.toDate) {
          const expenseDate = data.timestamp.toDate();
          if (
            expenseDate.getFullYear() === currentYear &&
            expenseDate.getMonth() === currentMonth
          ) {
            total += Number(data.amount) || 0;
          }
        }
      });
      setExpensesTotal(total);
    };
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, "employees"));
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += Number(data.salary) || 0;
      });
      setEmployeeSalariesTotal(total);
    };
    fetchExpenses();
    fetchEmployees();
  }, [currentYear, currentMonth]);

  useEffect(() => {
    if (!isCustomersLoading && customers && customers.length > 0) {
      fetchTransactions(customers);
    }
  }, [isCustomersLoading, customers, fetchTransactions]);

  const salesData = useMemo(() => {
    let startDate;
    if (salesFilter === "weekly") {
      startDate = startOfWeek(new Date());
    } else if (salesFilter === "monthly") {
      startDate = startOfMonth(new Date());
    } else {
      startDate = startOfYear(new Date());
    }
    const dateMap = {};
    transactions.forEach((tx) => {
      let dateObj;
      if (tx.timestamp?.seconds) {
        dateObj = new Date(tx.timestamp.seconds * 1000);
      } else {
        dateObj = new Date();
      }
      if (!isAfter(dateObj, startDate) && salesFilter !== "yearly") return;
      const dateStr = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
      dateMap[dateStr] = (dateMap[dateStr] || 0) + (tx.totalAmount || 0);
    });
    return Object.entries(dateMap)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, salesFilter]);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todaysTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        let dateObj;
        if (tx.timestamp?.seconds) {
          dateObj = new Date(tx.timestamp.seconds * 1000);
        } else {
          dateObj = new Date();
        }
        const dateStr = dateObj.toISOString().slice(0, 10);
        return dateStr === todayStr;
      })
      .sort((a) => {
        const aTime = a.timestamp?.seconds || 0;
        const bTime = a.timestamp?.seconds || 0;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map((tx) => {
        let dateObj;
        if (tx.timestamp?.seconds) {
          dateObj = new Date(tx.timestamp.seconds * 1000);
        } else {
          dateObj = new Date();
        }
        const dateStr = dateObj.toISOString().slice(0, 10);
        return {
          id: tx.id,
          date: dateStr,
          customerName: tx.customerName || "",
          totalAmount: tx.totalAmount || 0,
        };
      });
  }, [transactions, todayStr]);

  return (
    <AuthLayout>
      <div className="mx-auto px-4 py-8">
        <h1 className="text-7xl font-bold mb-2 text-white">Dashboard</h1>
        <p className="mb-8 text-white">Welcome to the dashboard!</p>
        <SummaryCards
          totalAnnualSales={totalAnnualSales}
          currentYear={currentYear}
          expensesTotal={expensesTotal}
          currentMonthName={currentMonthName}
          monthlyLoss={monthlyLoss}
          monthlyIncome={monthlyIncome}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SalesChart
            salesData={salesData}
            isLoading={isLoading}
            filter={salesFilter}
            setFilter={setSalesFilter}
          />
          <TodaysTransactionsTable
            todaysTransactions={todaysTransactions}
            isLoading={isLoading}
            navigate={navigate}
          />
        </div>
      </div>
    </AuthLayout>
  );
}

export { Dashboard };
