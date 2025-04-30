import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  editEmployee, // pass employee object if editing, else null
  fetchEmployees, // callback to refresh list after update
}) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add"); // "add" or "edit"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (editEmployee) {
      setMode("edit");
      setFormData({
        name: editEmployee.name || "",
        salary: editEmployee.salary || "",
        startDate: editEmployee.startDate?.toDate
          ? editEmployee.startDate.toDate().toISOString().slice(0, 10)
          : "",
      });
    } else {
      setMode("add");
      setFormData({ name: "", salary: "", startDate: "" });
    }
    setError("");
    setSuccess("");
    // eslint-disable-next-line
  }, [editEmployee, isOpen]);

  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (mode === "edit" && editEmployee) {
        await updateDoc(doc(db, "employees", editEmployee.id), {
          name: formData.name,
          salary: Number(formData.salary),
          startDate: Timestamp.fromDate(new Date(formData.startDate)),
        });
        setSuccess("Employee updated successfully!");
      } else {
        await addDoc(collection(db, "employees"), {
          name: formData.name,
          salary: Number(formData.salary),
          startDate: Timestamp.fromDate(new Date(formData.startDate)),
          createdAt: Timestamp.now(),
        });
        setSuccess("Employee added successfully!");
      }
      setTimeout(() => {
        setSuccess("");
        setFormData({ name: "", salary: "", startDate: "" });
        onClose();
        if (fetchEmployees) fetchEmployees();
      }, 1000);
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-cover bg-center min-h-screen flex items-center justify-center w-full z-50"
      style={{
        backgroundImage:
          "url('/src/assets/images/front-slaughter-house-2.png')",
      }}
    >
      <div className="absolute inset-0 bg-red-200 opacity-50"></div>
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full z-10">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-bold tracking-wider"
            style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
          >
            {mode === "edit" ? "Update Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleInternalSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Name of the employee
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Salary
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm font-semibold">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm font-semibold">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 uppercase"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader color="#fff" size={20} />
            ) : mode === "edit" ? (
              "Update Employee"
            ) : (
              "Add Employee"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
