import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CUSTOMERS_COLLECTION = "customers";
const COLLECTION_NAME = "transactions";

const Settings = () => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset (delete all docs in) the collection
  const handleResetCollection = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(colRef);
      const deletions = snapshot.docs.map((d) =>
        deleteDoc(doc(db, COLLECTION_NAME, d.id))
      );
      await Promise.all(deletions);
      alert("Collection reset!");
    } catch (e) {
      alert("Error resetting collection: " + e.message);
    }
    setLoading(false);
  };

  // Show usage (number of docs)
  const handleShowUsage = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(colRef);
      setUsage({ count: snapshot.size });
    } catch (e) {
      alert("Error fetching usage: " + e.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="mx-auto px-4 py-8">
        <h1 className="text-7xl font-bold mb-2 text-white">Settings</h1>
        <p className="mb-8 text-white">Manage your Firebase data and usage.</p>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-xl mx-auto">
          <ul className="space-y-6">
            {/* Option-style navigation */}
            <li
              className="cursor-pointer border border-gray-300 rounded-lg px-6 py-4 hover:bg-blue-50 flex items-center"
              onClick={() => navigate("/download")}
            >
              <span className="text-blue-700 font-semibold text-lg">
                Download Transactions
              </span>
              <span className="ml-auto text-gray-400">&rarr;</span>
            </li>
            <li
              className="cursor-pointer border border-gray-300 rounded-lg px-6 py-4 hover:bg-red-50 flex items-center"
              onClick={loading ? undefined : handleResetCollection}
            >
              <span className="text-red-700 font-semibold text-lg">
                Reset Firebase Collection
              </span>
              {loading && (
                <span className="ml-4 text-gray-500 text-sm">Loading...</span>
              )}
            </li>
            <li
              className="cursor-pointer border border-gray-300 rounded-lg px-6 py-4 hover:bg-green-50 flex items-center"
              onClick={loading ? undefined : handleShowUsage}
            >
              <span className="text-green-700 font-semibold text-lg">
                See Firebase Usage
              </span>
              {usage && (
                <span className="ml-auto text-gray-700 font-semibold">
                  Documents: {usage.count}
                </span>
              )}
              {loading && (
                <span className="ml-4 text-gray-500 text-sm">Loading...</span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Settings;
