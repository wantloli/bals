import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const BarGraph = ({ transactions }) => {
  // Get all months/years present in transactions for filter options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Find all years in transactions
  const yearsSet = useMemo(() => {
    const set = new Set();
    transactions.forEach((tx) => {
      let dateObj;
      if (tx.timestamp?.seconds) {
        dateObj = new Date(tx.timestamp.seconds * 1000);
      } else {
        dateObj = new Date();
      }
      set.add(dateObj.getFullYear());
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleReset = () => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  };

  // Filter transactions by selected month/year
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      let dateObj;
      if (tx.timestamp?.seconds) {
        dateObj = new Date(tx.timestamp.seconds * 1000);
      } else {
        dateObj = new Date();
      }
      return (
        dateObj.getFullYear() === Number(selectedYear) &&
        dateObj.getMonth() === Number(selectedMonth)
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Aggregate kilos per animal type for filtered transactions
  const data = useMemo(() => {
    const typeMap = {};
    filteredTransactions.forEach((tx) => {
      (tx.animals || []).forEach((animal) => {
        const type = animal.type || animal.name || "Unknown";
        const kilos = Number(animal.kilos) || 0;
        if (!typeMap[type]) {
          typeMap[type] = 0;
        }
        typeMap[type] += kilos;
      });
    });
    return Object.entries(typeMap).map(([type, kilos]) => ({
      type,
      kilos,
    }));
  }, [filteredTransactions]);

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <h2 className="text-lg font-semibold">Sales (kg) per Animal Type</h2>
        <select
          className="border rounded px-2 py-1"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map((m, idx) => (
            <option key={m} value={idx}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {yearsSet.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button
          className="border rounded px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm"
          onClick={handleReset}
          type="button"
        >
          Reset
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis
            label={{ value: "Kilos", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="kilos" fill="#ef4444" name="Kilos Sold" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph;
