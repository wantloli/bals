import React, { useState } from "react";
import { useCustomers } from "../contexts/CustomerContext";
import { useTransactions } from "../contexts/TransactionContext";
import { Combobox } from "@headlessui/react";

const TransactionForm = ({ onClose }) => {
  const { customers } = useCustomers();
  const { addTransaction, fetchTransactions } = useTransactions();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [animals, setAnimals] = useState([
    { type: "", price: "", kilos: "", heads: "" },
  ]);
  const [query, setQuery] = useState("");

  const handleAnimalChange = (index, field, value) => {
    const updatedAnimals = [...animals];
    updatedAnimals[index][field] = value;
    setAnimals(updatedAnimals);
  };

  const addAnimalField = () => {
    setAnimals([...animals, { type: "", price: "", kilos: "", heads: "" }]);
  };

  const removeAnimalField = (index) => {
    const updatedAnimals = animals.filter((_, i) => i !== index);
    setAnimals(updatedAnimals);
  };

  const calculateTotal = () => {
    return animals.reduce(
      (sum, animal) => sum + (Number(animal.price) || 0),
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    const success = await addTransaction(selectedCustomer, animals);

    if (success) {
      alert("Transaction added successfully!");
      setAnimals([{ type: "", price: "", kilos: "", heads: "" }]);
      fetchTransactions(customers);
      onClose();
    } else {
      alert("Failed to add transaction.");
    }
  };

  const filteredCustomers =
    query === ""
      ? customers
      : customers.filter((customer) =>
        customer.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""))
      );

  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center w-full"
      style={{
        backgroundImage:
          "url('/src/assets/images/front-slaughter-house-2.png')",
      }}
    >
      <div className="absolute inset-0 bg-red-200 opacity-50"></div>
      <div className="relative bg-white rounded-lg p-8 max-w-1/2 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-bold tracking-wider"
            style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
          >
            Add New Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Select Customer
            </label>
            <Combobox value={selectedCustomer} onChange={setSelectedCustomer}>
              <div className="relative mt-1">
                <Combobox.Input
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  displayValue={(customerId) =>
                    customers.find((c) => c.id === customerId)?.name || ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search customer..."
                />
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredCustomers.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                      No customers found.
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <Combobox.Option
                        key={customer.id}
                        value={customer.id}
                        as="li"
                        role="option"
                        className="list-none"
                      >
                        {({ selected, active }) => (
                          <div
                            className={`relative cursor-pointer select-none py-2 px-4 ${active ? "bg-indigo-600 text-white" : "text-gray-900"
                              } ${selected ? "font-medium" : "font-normal"}`}
                          >
                            {customer.name}
                            {selected && (
                              <span
                                className={`absolute inset-y-0 right-4 flex items-center ${active ? "text-white" : "text-indigo-600"
                                  }`}
                              >
                                ✓
                              </span>
                            )}
                          </div>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

          <div className="space-y-4">
            <h2
              className="text-lg font-semibold text-gray-800 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Animals
            </h2>
            {animals.map((animal, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Animal Type"
                  value={animal.type}
                  onChange={(e) =>
                    handleAnimalChange(index, "type", e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Kilos"
                  value={animal.kilos}
                  onChange={(e) =>
                    handleAnimalChange(index, "kilos", e.target.value)
                  }
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Heads"
                  value={animal.heads}
                  onChange={(e) =>
                    handleAnimalChange(index, "heads", e.target.value)
                  }
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={animal.price}
                  onChange={(e) =>
                    handleAnimalChange(index, "price", e.target.value)
                  }
                  className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeAnimalField(index)}
                  disabled={animals.length === 1}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:text-gray-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAnimalField}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Add Animal
            </button>
          </div>

          <div className="mt-4 text-right">
            <p
              className="text-lg font-semibold text-gray-800 tracking-wider"
              style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
            >
              Total Amount: ₱{calculateTotal()}
            </p>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 uppercase"
          >
            Submit Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
