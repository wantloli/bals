import { useState, useEffect } from "react";
import { CustomerForm } from "../components/CustomerForm";
import AuthLayout from "../components/AuthLayout";
import { useCustomers } from "../contexts/CustomerContext";
import SearchBar from "../components/SearchBar";

function CustomerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const {
    customers,
    fetchCustomers,
    searchCustomers,
    currentPage,
    changePage,
    totalPages,
  } = useCustomers();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (query) => {
    searchCustomers(query);
    setSelectedLetter("All");
  };

  const handleLetterFilter = (letter) => {
    setSelectedLetter(letter);
    if (letter === "All") {
      fetchCustomers();
    }
  };

  const handleSuccess = () => {
    fetchCustomers(); // Refresh the customer list
    setIsModalOpen(false); // Close the modal
  };

  const filteredCustomers =
    selectedLetter === "All"
      ? customers
      : customers.filter(
          (customer) =>
            typeof customer.name === "string" &&
            customer.name.charAt(0).toUpperCase() === selectedLetter
        );

  return (
    <AuthLayout>
      <div className="min-h-screen py-6 px-4">
        <div className="mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white uppercase">
              Customers
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Register a Customer
            </button>
          </div>

          {/* A-Z Filter Bar */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterFilter(letter)}
                className={`px-3 py-2 rounded text-xs font-semibold uppercase ${
                  selectedLetter === letter
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Reusable Search Bar */}
          <SearchBar
            placeholder="Search customers by name..."
            onSearch={handleSearch}
          />

          {/* Table */}
          <div className=" shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="odd:bg-white even:bg-slate-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap uppercase">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 uppercase">{customer.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap uppercase">
                      {customer.contact}
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
                alt="Customer Icon"
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
                alt="Customer Icon"
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <CustomerForm
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleSuccess} // Pass the handleSuccess function
          />
        </div>
      )}
    </AuthLayout>
  );
}

export { CustomerPage };
