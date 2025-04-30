import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import ExpenseForm from "../components/ExpenseForm";
import AuthLayout from "../components/AuthLayout";
import ConfirmModal from "../components/ConfirmModal";

const ITEMS_PER_PAGE = 10;

const OperationalExpenses = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [timestamp, setTimestamp] = useState(""); // Add timestamp state
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD
  const [monthFilter, setMonthFilter] = useState(""); // MM
  const [yearFilter, setYearFilter] = useState(""); // YYYY

  // Fetch expenses from Firestore
  const fetchExpenses = async () => {
    const querySnapshot = await getDocs(collection(db, "expenses"));
    const expensesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setExpenses(expensesData);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Search and pagination logic
  const filteredExpenses = expenses.filter((expense) => {
    // Description filter
    const matchesDescription = expense.description
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Date extraction
    let expenseDateObj = null;
    if (expense.timestamp) {
      expenseDateObj = expense.timestamp.toDate
        ? expense.timestamp.toDate()
        : new Date(expense.timestamp);
    }

    // Only one filter type is active at a time
    let matchesDate = true;
    let matchesMonth = true;
    let matchesYear = true;

    if (dateFilter && expenseDateObj) {
      const expenseDateStr = expenseDateObj.toISOString().slice(0, 10); // YYYY-MM-DD
      matchesDate = expenseDateStr === dateFilter;
      matchesMonth = true;
      matchesYear = true;
    } else if ((monthFilter || yearFilter) && expenseDateObj) {
      if (monthFilter) {
        const expenseMonth = String(expenseDateObj.getMonth() + 1).padStart(
          2,
          "0"
        );
        matchesMonth = expenseMonth === monthFilter;
      }
      if (yearFilter) {
        const expenseYear = String(expenseDateObj.getFullYear());
        matchesYear = expenseYear === yearFilter;
      }
      matchesDate = true;
    }

    return matchesDescription && matchesDate && matchesMonth && matchesYear;
  });
  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE)
  );
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setDateFilter("");
    setMonthFilter("");
    setYearFilter("");
  };

  const handleSubmit = async () => {
    if (!description || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (editId) {
        const expenseDoc = doc(db, "expenses", editId);
        await updateDoc(expenseDoc, {
          description,
          amount: parseFloat(amount),
          timestamp: timestamp ? new Date(timestamp) : serverTimestamp(),
        });
        alert("Expense updated successfully!");
      } else {
        await addDoc(collection(db, "expenses"), {
          description,
          amount: parseFloat(amount),
          timestamp: serverTimestamp(), // Always use serverTimestamp for new
        });
        alert("Expense added successfully!");
      }
      setDescription("");
      setAmount("");
      setTimestamp("");
      setEditId(null);
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense: ", error);
      alert("Failed to save expense.");
    }
  };

  const handleEdit = (expense) => {
    setDescription(expense.description);
    setAmount(expense.amount);
    setEditId(expense.id);
    // Convert Firestore Timestamp to input[type=datetime-local] string
    let ts = "";
    if (expense.timestamp) {
      const dateObj = expense.timestamp.toDate
        ? expense.timestamp.toDate()
        : new Date(expense.timestamp);
      ts = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
    setTimestamp(ts);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      alert("Expense deleted successfully!");
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense: ", error);
      alert("Failed to delete expense.");
    }
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (expenseToDelete) {
      await handleDelete(expenseToDelete.id);
      setExpenseToDelete(null);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setExpenseToDelete(null);
    setConfirmOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDescription("");
    setAmount("");
    setTimestamp("");
    setEditId(null);
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <AuthLayout>
      <div className="min-h-screen py-6 px-4">
        <div className=" mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white uppercase">
              Operational Expenses
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <img
                src="/src/assets/add.svg"
                alt="Logout Icon"
                className="h-5 w-5"
              />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
              type="text"
              placeholder="Search expenses by description..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full md:w-auto flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                if (e.target.value) {
                  setMonthFilter("");
                  setYearFilter("");
                }
              }}
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500"
              placeholder="Filter by date"
            />
            <select
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                if (e.target.value) setDateFilter("");
              }}
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500"
              disabled={!!dateFilter}
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                if (e.target.value) setDateFilter("");
              }}
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500"
              disabled={!!dateFilter}
            >
              <option value="">All Years</option>
              {/* Dynamically generate year options from expenses */}
              {Array.from(
                new Set(
                  expenses
                    .map((exp) => {
                      if (!exp.timestamp) return null;
                      const d = exp.timestamp.toDate
                        ? exp.timestamp.toDate()
                        : new Date(exp.timestamp);
                      return d.getFullYear();
                    })
                    .filter(Boolean)
                )
              )
                .sort((a, b) => b - a)
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              type="button"
            >
              Reset Filters
            </button>
          </div>

          {/* Table */}
          <div className="shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="odd:bg-white even:bg-slate-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap uppercase">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₱{expense.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.timestamp
                        ? (expense.timestamp.toDate
                            ? expense.timestamp.toDate()
                            : new Date(expense.timestamp)
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense)}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-sm text-white disabled:bg-gray-600"
            >
              <img
                src="/src/assets/arrow-left.svg"
                alt="Previous"
                className="h-5 w-5"
              />
            </button>
            <span className="text-white text-sm uppercase">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md text-white disabled:bg-gray-600"
            >
              <img
                src="/src/assets/arrow-right.svg"
                alt="Next"
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <ExpenseForm
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            timestamp={timestamp}
            setTimestamp={setTimestamp}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            isEditing={!!editId}
            isNew={!editId} // Pass isNew prop
          />
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Expense"
        message={
          expenseToDelete
            ? `Are you sure you want to delete "${expenseToDelete.description}"?`
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

export default OperationalExpenses;
