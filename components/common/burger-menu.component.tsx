import { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose }) => {
  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      <div className='py-2 px-2 grid grid-row-3 gap-5'>
        <div className='menu-item row-span-1 text-white text-2xl px-3 py-6 menu-item'>
          <a href="/home">Home</a>
        </div>
        <div className='menu-item row-span-1 text-white text-2xl px-3 py-6 menu-item'>
          <a href="/movies">Movies</a>
        </div>
        <div className='menu-item row-span-1 text-white text-2xl px-3 py-6 menu-item'>
          <a href="/news">News</a>
        </div>
      </div>
    </Menu>
  );
};

export default BurgerMenu;