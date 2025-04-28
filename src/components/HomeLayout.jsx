import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function HomeLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-red-50 bg-fixed bg-cover bg-center relative"
      style={{ backgroundImage: "url('src/assets/images/bgc-front.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-25"></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-red-800 text-white h-24 flex ">
          <div className="max-w-7xl px-6 sm:px-6 lg:px-8 mx-auto">
            <div className="flex items-center justify-between h-full">
              {/* Changed h-16 to h-full */}
              <img
                src="src/assets/images/municipal-logo.png"
                className="h-16"
                alt=""
              />
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <p className="text-sm">Republic of the Philippines</p>
                  <h1 className="text-xl font-bold">MUNICIPALITY OF BALAYAN</h1>
                  <p className="text-sm">
                    Together we move forward, Just Right for Balayan
                  </p>
                </div>
              </div>
              <div className="ml-auto hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-900 text-white"
                  >
                    Home
                  </Link>
                  <a
                    href="#"
                    className="px-3 py-2 rounded-md text-sm font-medium text-red-100 hover:bg-red-700"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="px-3 py-2 rounded-md text-sm font-medium text-red-100 hover:bg-red-700"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="px-3 py-2 rounded-md text-sm font-medium text-red-100 hover:bg-red-700"
                  >
                    Contact
                  </a>
                </div>
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-red-100 hover:bg-red-700 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-red-900 text-white"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-100 hover:bg-red-700"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-100 hover:bg-red-700"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-100 hover:bg-red-700"
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-red-900 text-red-100 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Brand</h3>
                <p className="text-sm">
                  Providing exceptional services and products since 2023.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white">
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <address className="text-sm not-italic">
                  <p>123 Main Street</p>
                  <p>City, Country 12345</p>
                  <p className="mt-2">Email: info@example.com</p>
                  <p>Phone: +1 (123) 456-7890</p>
                </address>
              </div>
            </div>
            <div className="border-t border-red-800 mt-8 pt-8 text-sm text-center">
              <p>&copy; 2025 Brand. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomeLayout;
