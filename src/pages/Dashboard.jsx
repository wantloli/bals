import AuthLayout from "../components/AuthLayout";
import { useEffect, useMemo } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import { useCustomers } from "../contexts/CustomerContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { transactions, fetchTransactions, isLoading } = useTransactions();
  const { customers, isLoading: isCustomersLoading } = useCustomers(); // <-- get isLoading from customers
  const navigate = useNavigate();

  // Fetch transactions only after customers are loaded and not empty
  useEffect(() => {
    if (!isCustomersLoading && customers && customers.length > 0) {
      fetchTransactions(customers);
    }
  }, [isCustomersLoading, customers, fetchTransactions]);

  // Aggregate sales by date
  const salesData = useMemo(() => {
    const dateMap = {};
    transactions.forEach((tx) => {
      let dateObj;
      if (tx.timestamp?.seconds) {
        dateObj = new Date(tx.timestamp.seconds * 1000);
      } else {
        dateObj = new Date();
      }
      const dateStr = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
      dateMap[dateStr] = (dateMap[dateStr] || 0) + (tx.totalAmount || 0);
    });
    return Object.entries(dateMap)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions]);

  // Only show last 5 transactions from today
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
      .sort((a, b) => {
        // Sort by timestamp descending
        const aTime = a.timestamp?.seconds || 0;
        const bTime = b.timestamp?.seconds || 0;
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
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="mb-8 text-gray-600">Welcome to the dashboard!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-10 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Sales Over Time</h2>
            <div className="w-full h-72">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500">Loading sales data...</span>
                </div>
              ) : (
                <ResponsiveContainer>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#6366f1" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          {/* Right: Last 5 transactions today */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Today's Latest Transactions
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <span className="text-gray-500">Loading transactions...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {todaysTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-6 text-gray-400"
                        >
                          No transactions found for today.
                        </td>
                      </tr>
                    ) : (
                      todaysTransactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="cursor-pointer hover:bg-indigo-50 transition"
                          onClick={() => navigate("/transaction")}
                        >
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                            {tx.date}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                            {tx.customerName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                            {tx.totalAmount.toLocaleString(undefined, {
                              style: "currency",
                              currency: "PHP",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export { Dashboard };
