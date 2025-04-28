import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get timezone from environment variable with fallback to 'Asia/Manila'
  const timezone = import.meta.env.VITE_TIMEZONE || "Asia/Manila";

  // Check if we're in an /operation route or stored state is true
  const [isOperationOpen, setIsOperationOpen] = useState(() => {
    const fromStorage = localStorage.getItem("operationOpen");
    return fromStorage
      ? fromStorage === "true"
      : location.pathname.startsWith("/operation");
  });

  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("operationOpen", isOperationOpen);
  }, [isOperationOpen]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, []);

  // Format date and time for display with proper timezone
  const formatLocalDateTime = () => {
    return currentTime.toLocaleString("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const toggleOperation = () => {
    setIsOperationOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="fixed left-0 top-0 h-full w-72 bg-red-800 text-white flex flex-col">
        {/* Time Display */}
        <div className="px-4 py-3 bg-red-900 text-white text-sm">
          <div className="font-bold mb-1">
            {timezone.replace("_", " ")} Time
          </div>
          <div>{formatLocalDateTime()}</div>
        </div>
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center h-44 pt-4">
          <img
            src="/src/assets/images/municipal-logo.png"
            alt="Logo"
            className="h-40 w-auto"
          />
          <p
            className="tracking-wider text-sm"
            style={{ fontFamily: "PlayfairDisplay, sans-serif" }}
          >
            MUNICIPALITY OF BALAYAN{" "}
          </p>
        </div>
        <ul className="pt-4 space-y-2 ">
          <Link to="/dashboard">
            <li
              className={`px-4 py-2 hover:bg-red-700 cursor-pointer flex items-center space-x-2 ${
                location.pathname === "/dashboard" ? "bg-red-700" : ""
              }`}
            >
              <img
                src="/src/assets/dashboard.svg"
                alt="Dashboard Icon"
                className="h-5 w-5"
              />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link to="/customer">
            <li
              className={`px-4 py-2 hover:bg-red-700 cursor-pointer flex items-center space-x-2 ${
                location.pathname === "/customer" ? "bg-red-700" : ""
              }`}
            >
              <img
                src="/src/assets/customer.svg"
                alt="Customer Icon"
                className="h-5 w-5"
              />
              <span>Customer</span>
            </li>
          </Link>
          <Link to="/transaction">
            <li
              className={`px-4 py-2 hover:bg-red-700 cursor-pointer flex items-center space-x-2 ${
                location.pathname === "/transaction" ? "bg-red-700" : ""
              }`}
            >
              <img
                src="/src/assets/transaction.svg"
                alt="Transaction Icon"
                className="h-5 w-5"
              />
              <span>Transaction</span>
            </li>
          </Link>

          {/* Operation Dropdown */}
          <li
            onClick={toggleOperation}
            className="px-4 py-2 hover:bg-red-700 cursor-pointer flex justify-between items-center"
          >
            <span>Operation</span>
            <span>{isOperationOpen ? "▲" : "▼"}</span>
          </li>

          {isOperationOpen && (
            <ul className="pl-6 space-y-1">
              <Link to="/operation/employee-salaries">
                <li className="px-4 py-2 hover:bg-red-700 cursor-pointer">
                  Employee Salaries
                </li>
              </Link>
              <Link to="/operation/operational-expenses">
                <li className="px-4 py-2 hover:bg-red-700 cursor-pointer">
                  Operational Expenses
                </li>
              </Link>
              {/* <Link to="/operation/other-expenses">
                <li className="px-4 py-2 hover:bg-red-700 cursor-pointer">
                  Other Expenses
                </li>
              </Link> */}
            </ul>
          )}

          <li className="px-4 py-2 hover:bg-red-700 cursor-pointer">
            Settings
          </li>
        </ul>
        <div className="mt-auto mb-20">
          <ul>
            <li
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-red-700 cursor-pointer flex items-center space-x-2"
            >
              <img
                src="/src/assets/logout.svg"
                alt="Logout Icon"
                className="h-5 w-5"
              />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 p-8 ml-72 relative bg-[url('/src/assets/images/bgc-front.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
