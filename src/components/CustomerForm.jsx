import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function CustomerForm({ onClose, onSuccess }) {
  const barangays = [
    "Baclaran",
    "Barangay 1",
    "Barangay 10",
    "Barangay 11",
    "Barangay 12",
    "Barangay 2",
    "Barangay 3",
    "Barangay 4",
    "Barangay 5",
    "Barangay 6",
    "Barangay 7",
    "Barangay 8",
    "Barangay 9",
    "Calan",
    "Caloocan",
    "Calzada",
    "Canda",
    "Carenahan",
    "Caybunga",
    "Cayponce",
    "Dalig",
    "Dao",
    "Dilao",
    "Duhatan",
    "Durungao",
    "Gimalas",
    "Gumamela",
    "Lagnas",
    "Lanatan",
    "Langgangan",
    "Lucban Putol",
    "Lucban Pook",
    "Magabe",
    "Malalay",
    "Munting Tubig",
    "Navotas",
    "Patugo",
    "Palikpikan",
    "Pooc",
    "Sambat",
    "Sampaga",
    "San Juan",
    "San Piro",
    "Santol",
    "Sukol",
    "Tactac",
    "Taludtud",
    "Tanggoy",
  ];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
  });
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [status, setStatus] = useState({ message: "", error: false });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAddress =
      selectedBarangay === "Other" ? customAddress : selectedBarangay;
    try {
      await addDoc(collection(db, "customers"), {
        ...formData,
        address: finalAddress,
      });
      setStatus({ message: "Customer added successfully!", error: false });
      setFormData({ name: "", address: "", contact: "" });
      setSelectedBarangay("");
      setCustomAddress("");
      onSuccess();
    } catch (error) {
      setStatus({
        message: "Error adding customer: " + error.message,
        error: true,
      });
    }
  };

  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center w-full"
      style={{
        backgroundImage:
          "url('/src/assets/images/front-slaughter-house-2.png')",
      }}
    >
      <div className="absolute inset-0 bg-red-200 opacity-50"></div>
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-bold tracking-wider"
            style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
          >
            Add New Customer
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {status.message && (
          <div
            className={`p-4 rounded-md ${
              status.error
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Name of the customer
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Address of the customer
            </label>
            <select
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              required
            >
              <option value="" disabled>
                Select Barangay
              </option>
              {barangays.map((barangay) => (
                <option key={barangay} value={barangay}>
                  {barangay}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {selectedBarangay === "Other" && (
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Enter address"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                required
              />
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Contact of the customer
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 uppercase"
          >
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}

export { CustomerForm };
