import { useState } from 'react';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button
        className="text-white p-2 focus:outline-none focus:bg-gray-700"
        onClick={toggleMenu}
      >
        <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
        </svg>
      </button>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center transition-transform transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-white p-4 rounded shadow-md">
          
          <ul className="space-y-2">
            <li>
              <button
              className="left-0 text-gray-700"
              onClick={closeMenu}
            >
              X
            </button>
            </li>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/movies">Movies</a>
            </li>
            <li>
              <a href="/news">News</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;