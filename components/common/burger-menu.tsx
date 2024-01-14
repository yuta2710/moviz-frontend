import Link from 'next/link';
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
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center transition-transform transform z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="linear-dark-purple p-24 rounded shadow-md h-screen w-full">

          <ul className="space-y-16 text-center">
            <li className=''>
              <button
                className="left-0 text-white float-right top-0 text-4xl"
                onClick={closeMenu}
              >
                X
              </button>
            </li>
            <li>
              <Link href="/" className='text-white text-2xl font-medium text-center' >Home</Link>
            </li>
            <li>
              <Link href="/movies" className='text-white text-2xl font-medium text-center'>Movies</Link>
            </li>
            <li>
              <Link href="/news" className='text-white text-2xl font-medium text-center'>News</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;