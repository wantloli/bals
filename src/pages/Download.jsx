import React, { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";

const CUSTOMERS_COLLECTION = "customers";

const Download = () => {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      const snapshot = await getDocs(collection(db, CUSTOMERS_COLLECTION));
      setCustomers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || doc.id,
        }))
      );
    };
    fetchCustomers();
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    setDownloadUrl(null);
    try {
      let customerDocs = [];
      if (selectedCustomer) {
        // Only fetch the selected customer
        const docSnap = await getDocs(collection(db, CUSTOMERS_COLLECTION));
        customerDocs = docSnap.docs.filter(
          (doc) => doc.id === selectedCustomer
        );
      } else {
        // Fetch all customers
        const docSnap = await getDocs(collection(db, CUSTOMERS_COLLECTION));
        customerDocs = docSnap.docs;
      }
      let allTransactions = [];
      for (const customerDoc of customerDocs) {
        const customerId = customerDoc.id;
        const customerName = customerDoc.data().name || "";
        const transactionsSnapshot = await getDocs(
          collection(db, CUSTOMERS_COLLECTION, customerId, "transactions")
        );
        transactionsSnapshot.forEach((txDoc) => {
          const tx = txDoc.data();
          // Filter by month/year if selected
          let include = true;
          if (tx.timestamp && tx.timestamp.seconds) {
            const date = new Date(tx.timestamp.seconds * 1000);
            if (
              selectedMonth &&
              (date.getMonth() + 1).toString() !== selectedMonth
            ) {
              include = false;
            }
            if (
              selectedYear &&
              date.getFullYear().toString() !== selectedYear
            ) {
              include = false;
            }
          } else if (selectedMonth || selectedYear) {
            include = false;
          }
          if (!include) return;
          const animalsStr = Array.isArray(tx.animals)
            ? tx.animals
                .map((a) => `${a.type || ""} (${a.price || ""})`)
                .join("; ")
            : "";
          allTransactions.push({
            transactionId: txDoc.id,
            customerId,
            customerName,
            animals: animalsStr,
            totalAmount: tx.totalAmount,
            timestamp:
              tx.timestamp && tx.timestamp.seconds
                ? new Date(tx.timestamp.seconds * 1000).toLocaleString()
                : "",
          });
        });
      }
      const ws = XLSX.utils.json_to_sheet(allTransactions);

      // Auto-adjust column widths
      const data = [Object.keys(allTransactions[0] || {})].concat(
        allTransactions.map((obj) => Object.values(obj))
      );
      ws["!cols"] = data[0].map((_, colIdx) => {
        const maxLen = data.reduce(
          (max, row) =>
            Math.max(max, row[colIdx] ? row[colIdx].toString().length : 0),
          10 // minimum width
        );
        return { wch: maxLen + 2 }; // add some padding
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e) {
      alert("Error downloading data: " + e.message);
    }
    setLoading(false);
  };

  // Helper for years (last 10 years)
  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
  const months = [
    { value: "", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <AuthLayout>
      <div className="mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold mb-4 text-white">
          Download Transactions
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-xl mx-auto">
          <p className="mb-6 text-gray-700">
            Export transactions as an Excel file. Filter by customer, month, and
            year.
          </p>
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-semibold">Customer</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <label className="font-semibold mt-2">Month</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <label className="font-semibold mt-2">Year</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Preparing..." : "Download Excel"}
          </button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`transactions.xlsx`}
              className="ml-4 text-blue-700 underline"
            >
              Click to download
            </a>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Download;
