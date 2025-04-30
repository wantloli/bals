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
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

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
  const filteredExpenses = expenses.filter((expense) =>
    expense.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
        });
        alert("Expense updated successfully!");
      } else {
        await addDoc(collection(db, "expenses"), {
          description,
          amount: parseFloat(amount),
          timestamp: serverTimestamp(),
        });
        alert("Expense added successfully!");
      }
      setDescription("");
      setAmount("");
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
    setEditId(null);
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <AuthLayout>
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white uppercase">
              Operational Expenses
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Expense
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search expenses by description..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500"
            />
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedExpenses.map((expense) => (
                  <tr key={expense.id} className="odd:bg-white even:bg-red-200">
                    <td className="px-6 py-4 whitespace-nowrap uppercase">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.amount}
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
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            isEditing={!!editId}
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
