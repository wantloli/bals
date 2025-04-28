import React from "react";

const COLORS = {
  success: "bg-green-100 text-green-800 border-green-400",
  error: "bg-red-100 text-red-800 border-red-400",
  info: "bg-blue-100 text-blue-800 border-blue-400",
};

const TITLES = {
  success: "Success",
  error: "Error",
  info: "Info",
};

const ModalMessage = ({ open, type = "info", message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`rounded-lg border p-6 shadow-lg w-full max-w-sm ${
          COLORS[type] || COLORS.info
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">{TITLES[type] || TITLES.info}</h3>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="text-base">{message}</div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMessage;
