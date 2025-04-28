import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { useCustomers } from "./CustomerContext";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { customers } = useCustomers();

  // Always fetch fresh data when called
  const fetchTransactions = useCallback(
    async (customersArg) => {
      const customersList = customersArg || customers;
      if (!customersList || customersList.length === 0) {
        return;
      }
      setIsLoading(true);
      try {
        const transactionsData = [];
        for (const customer of customersList) {
          const q = query(
            collection(db, "customers", customer.id, "transactions"),
            orderBy("timestamp", "desc")
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            transactionsData.push({
              id: doc.id,
              customerName: customer.name,
              customerId: customer.id,
              ...doc.data(),
            });
          });
        }
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [customers]
  );

  useEffect(() => {
    if (customers && customers.length > 0) {
      fetchTransactions(customers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers]);

  const addTransaction = async (customerId, animals) => {
    try {
      const timestamp = serverTimestamp();
      const totalAmount = animals.reduce(
        (sum, animal) => sum + (Number(animal.price) || 0),
        0
      );

      const customerRef = doc(db, "customers", customerId);
      const customerSnap = await getDoc(customerRef);
      const customerName = customerSnap.data()?.name;

      const transactionRef = collection(
        db,
        "customers",
        customerId,
        "transactions"
      );
      const newTransactionDoc = await addDoc(transactionRef, {
        animals,
        timestamp,
        totalAmount,
      });

      setTransactions((prev) => [
        {
          id: newTransactionDoc.id,
          customerId,
          customerName,
          animals,
          totalAmount,
          timestamp: {
            seconds: Math.floor(Date.now() / 1000),
            nanoseconds: 0,
          },
        },
        ...prev,
      ]);

      await updateDoc(customerRef, {
        lastTransactionDate: timestamp,
      });

      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return false;
    }
  };

  const value = {
    transactions,
    fetchTransactions,
    addTransaction,
    isLoading,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
