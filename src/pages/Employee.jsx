import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import AddEmployeeModal from "../components/AddEmployeeModal";
import ConfirmModal from "../components/ConfirmModal";
import AuthLayout from "../components/AuthLayout";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    salary: "",
    startDate: "",
  });
  const [editEmployee, setEditEmployee] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Pagination state (optional, for UI consistency)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "employees"), {
        name: formData.name,
        salary: Number(formData.salary),
        startDate: Timestamp.fromDate(new Date(formData.startDate)),
        createdAt: Timestamp.now(),
      });
      setFormData({ name: "", salary: "", startDate: "" });
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employeeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const calculateTimeAgo = (startDate) => {
    if (!startDate?.toDate) return "";
    const now = new Date();
    const start = startDate.toDate();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 365
      ? `${Math.floor(diffDays / 365)} years ago`
      : `${diffDays} days ago`;
  };

  // Delete employee handler
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "employees", id));
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      await handleDelete(employeeToDelete.id);
      setEmployeeToDelete(null);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setEmployeeToDelete(null);
    setConfirmOpen(false);
  };

  // Placeholder for update (edit) action
  const handleUpdate = (employee) => {
    setEditEmployee(employee);
    setIsModalOpen(true);
  };

  // Pagination logic
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AuthLayout>
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white uppercase">
              Employees
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Employee
            </button>
          </div>

          {/* Table */}
          <div className="shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="odd:bg-white even:bg-slate-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap uppercase">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap uppercase">
                      ₱{employee.salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap uppercase">
                      {calculateTimeAgo(employee.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleUpdate(employee)}
                        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteClick(employee)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-sm text-white disabled:bg-gray-600"
            >
              <img
                src="/src/assets/arrow-left.svg"
                alt="Arrow Left"
                className="h-5 w-5"
              />
            </button>
            <span className="text-white text-sm uppercase">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-gray-300 rounded-md text-white disabled:bg-gray-600"
            >
              <img
                src="/src/assets/arrow-right.svg"
                alt="Arrow Right"
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditEmployee(null);
          }}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          editEmployee={editEmployee}
          fetchEmployees={fetchEmployees}
        />
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Employee"
        message={
          employeeToDelete
            ? `Are you sure you want to delete ${employeeToDelete.name}?`
            : ""
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </AuthLayout>
  );
}

export default Employee;
