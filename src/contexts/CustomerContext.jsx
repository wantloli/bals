import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 15;
  const STORAGE_KEY = "cached_customers";

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const cachedData = localStorage.getItem(STORAGE_KEY);
      if (cachedData) {
        setCustomers(JSON.parse(cachedData));
      }

      const querySnapshot = await getDocs(collection(db, "customers"));
      const customersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCustomers(customersList);
      setFilteredCustomers(customersList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customersList));
    } catch (error) {
      console.error("Error fetching customers:", error);
      const cachedData = localStorage.getItem(STORAGE_KEY);
      if (cachedData) {
        setCustomers(JSON.parse(cachedData));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const searchCustomers = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(lowerCaseQuery) ||
        customer.address.toLowerCase().includes(lowerCaseQuery) ||
        customer.contact.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers: paginatedCustomers,
        fetchCustomers,
        searchCustomers,
        currentPage,
        changePage,
        totalPages: Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE),
        isLoading, // <-- expose isLoading
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
};
