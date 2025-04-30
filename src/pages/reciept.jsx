import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTransactions } from "../contexts/TransactionContext";
import AuthLayout from "../components/AuthLayout";

const Reciept = () => {
  const { id } = useParams();
  const { transactions, fetchTransactions } = useTransactions();
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
    }
    // Find transaction by id
    const found = transactions.find((t) => t.id === id);
    setTransaction(found);
  }, [id, transactions, fetchTransactions]);

  if (!transaction) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-white">Loading receipt...</div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="max-w-xl mx-auto bg-white/90 rounded-lg shadow-lg p-8 mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Transaction Receipt
        </h1>
        <div className="mb-2">
          <span className="font-semibold">Transaction ID:</span>{" "}
          {transaction.id}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Customer:</span>{" "}
          {transaction.customerName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Date:</span>{" "}
          {transaction.timestamp instanceof Date
            ? transaction.timestamp.toLocaleDateString()
            : transaction.timestamp?.seconds
            ? new Date(
                transaction.timestamp.seconds * 1000
              ).toLocaleDateString()
            : "N/A"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Animals:</span>
          <ul className="list-disc ml-6">
            {transaction.animals.map((animal, idx) => (
              <li key={idx}>
                {animal.name || animal.type || "N/A"} -{" "}
                {animal.heads && `${animal.heads} heads`}{" "}
                {animal.kilos && `${animal.kilos}kg`} - ₱{animal.price}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 text-xl font-bold text-right">
          Total: ₱{transaction.totalAmount}
        </div>
      </div>
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 mx-auto w-full mt-4"
        onClick={() => navigate("/transaction")}
      >
        &larr; Back
      </button>
    </AuthLayout>
  );
};

export default Reciept;
