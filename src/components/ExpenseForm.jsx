import React, { useState } from "react";
import ModalMessage from "./ModalMessage";
import { ClipLoader } from "react-spinners";

const ExpenseForm = ({
  description,
  setDescription,
  amount,
  setAmount,
  timestamp,
  setTimestamp,
  onSubmit,
  onCancel,
  isEditing,
  isNew,
}) => {
  // Modal and loading state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMsg, setModalMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate async submit (replace with real onSubmit if needed)
      await new Promise((res) => setTimeout(res, 1200));
      onSubmit && onSubmit();
      setModalType("success");
      setModalMsg(isEditing ? "Expense updated!" : "Expense added!");
      setModalOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalType("error");
      setModalMsg("Something went wrong.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
      {/* ModalMessage */}
      <ModalMessage
        open={modalOpen}
        type={modalType}
        message={modalMsg}
        onClose={() => setModalOpen(false)}
      />
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Edit Expense" : "Add Expense"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter expense description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={isNew}
          />
          {isNew && (
            <div className="text-xs text-gray-500 mt-1">
              Timestamp will be set automatically.
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 items-center">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : isEditing ? (
              "Update"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
