import React, { useState, useEffect } from "react";
import { useCustomers } from "../contexts/CustomerContext";
import { useTransactions } from "../contexts/TransactionContext";
import AuthLayout from "../components/AuthLayout";
import TransactionForm from "../components/TransactionForm";
import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";
import ClipLoader from "react-spinners/ClipLoader";

const Transaction = () => {
  const { customers, fetchCustomers } = useCustomers();
  const { transactions, fetchTransactions, isLoading, deleteTransaction } =
    useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // "" means all
  const [selectedYear, setSelectedYear] = useState(""); // "" means all

  // Get all years from transactions for dropdown
  const years = Array.from(
    new Set(
      transactions
        .map((t) => {
          let date;
          if (t.timestamp instanceof Date) date = t.timestamp;
          else if (t.timestamp?.seconds)
            date = new Date(t.timestamp.seconds * 1000);
          else return null;
          return date.getFullYear();
        })
        .filter(Boolean)
    )
  ).sort((a, b) => b - a);

  // Months for dropdown
  const months = [
    { value: "", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  // Add a helper to get current month/year as string
  const getCurrentMonth = () => new Date().getMonth().toString();
  const getCurrentYear = () => new Date().getFullYear().toString();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    if (customers.length > 0) {
      fetchTransactions(customers);
    }
  }, [customers, fetchTransactions]);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleSearch = (query) => {
    filterTransactions(query, selectedMonth, selectedYear);
  };

  // New: filter by search, month, year
  const filterTransactions = (query, month, year) => {
    const lowerCaseQuery = query ? query.toLowerCase() : "";
    const filtered = transactions.filter((transaction) => {
      // Search filter
      const matchesSearch = transaction.customerName
        .toLowerCase()
        .includes(lowerCaseQuery);

      // Date filter
      let date;
      if (transaction.timestamp instanceof Date) date = transaction.timestamp;
      else if (transaction.timestamp?.seconds)
        date = new Date(transaction.timestamp.seconds * 1000);
      else date = null;

      const matchesMonth =
        month === "" || (date && date.getMonth().toString() === month);
      const matchesYear =
        year === "" || (date && date.getFullYear().toString() === year);

      return matchesSearch && matchesMonth && matchesYear;
    });
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  // When month/year changes, re-filter
  useEffect(() => {
    filterTransactions("", selectedMonth, selectedYear);
    // eslint-disable-next-line
  }, [selectedMonth, selectedYear, transactions]);

  // Add a reset handler
  const handleResetFilters = () => {
    setSelectedMonth(getCurrentMonth());
    setSelectedYear(getCurrentYear());
    filterTransactions("", getCurrentMonth(), getCurrentYear());
  };

  // On mount, set default to current month/year
  useEffect(() => {
    setSelectedMonth(getCurrentMonth());
    setSelectedYear(getCurrentYear());
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (timestamp instanceof Date) return timestamp.toLocaleDateString();
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return "Invalid Date";
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      await deleteTransaction(
        transactionToDelete.id,
        transactionToDelete.customerId
      );
      fetchTransactions(customers);
      setTransactionToDelete(null);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setTransactionToDelete(null);
    setConfirmOpen(false);
  };

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AuthLayout>
      <div className="min-h-screen py-6 px-4">
        <div className="mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white uppercase">
              Transactions
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              New Transaction
            </button>
          </div>

          {/* Filter Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <h3 className="text-white font-semibold">Filter Transactions</h3>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <label className="block text-white text-sm font-medium mb-1">
                  Month
                </label>
                <select
                  className="p-2 w-60 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/90"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-white text-sm font-medium mb-1">
                  Year
                </label>
                <select
                  className="p-2 w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/90"
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 h-[38px]"
                onClick={handleResetFilters}
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1">
            <SearchBar
              placeholder="Search by customer name..."
              onSearch={handleSearch}
            />
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <ClipLoader color="#6366f1" size={48} />
              <p className="text-white mt-4">Loading transactions...</p>
            </div>
          ) : (
            <div className="shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Animals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="odd:bg-white even:bg-slate-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(transaction.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap uppercase">
                          {transaction.customerName}
                        </td>
                        <td className="px-6 py-4">
                          {transaction.animals.map((animal, index) => {
                            const details = [];
                            if (animal.heads)
                              details.push(`${animal.heads} heads`);
                            if (animal.kilos) details.push(`${animal.kilos}kg`);

                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="font-medium">
                                  {animal.name || animal.type || "N/A"}
                                </span>
                                {details.length > 0 && (
                                  <span className="text-gray-500">
                                    ({details.join(", ")})
                                  </span>
                                )}
                                <span>- ₱{animal.price}</span>
                              </div>
                            );
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₱{transaction.totalAmount}
                        </td>
                        {/* Edit & Delete Buttons */}
                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                          <button
                            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                            onClick={() => {
                              // Set modal open and pass transaction for editing
                              setIsModalOpen(transaction);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleDeleteClick(transaction)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-sm text-white disabled:bg-gray-600"
            >
              <img
                src="/src/assets/arrow-left.svg"
                alt="Previous Page"
                className="h-5 w-5"
              />
            </button>
            <span className="text-white text-sm uppercase">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md text-white disabled:bg-gray-600"
            >
              <img
                src="/src/assets/arrow-right.svg"
                alt="Next Page"
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <TransactionForm
            onClose={() => setIsModalOpen(false)}
            // Pass transaction data if editing
            transaction={
              typeof isModalOpen === "object" ? isModalOpen : undefined
            }
          />
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Transaction"
        message={
          transactionToDelete
            ? `Are you sure you want to delete this transaction for "${transactionToDelete.customerName}"?`
            : ""
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </AuthLayout>
  );
};

export default Transaction;
