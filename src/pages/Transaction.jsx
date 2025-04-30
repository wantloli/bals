import React, { useState, useEffect } from "react";
import { useCustomers } from "../contexts/CustomerContext";
import { useTransactions } from "../contexts/TransactionContext";
import AuthLayout from "../components/AuthLayout";
import TransactionForm from "../components/TransactionForm";
import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";

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
    const lowerCaseQuery = query.toLowerCase();
    const filtered = transactions.filter((transaction) =>
      transaction.customerName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

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
        <div className="max-w-6xl mx-auto">
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

          {/* Reusable Search Bar */}
          <SearchBar
            placeholder="Search by customer name..."
            onSearch={handleSearch}
          />

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading transactions...</p>
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
                        className="odd:bg-white even:bg-red-200"
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
