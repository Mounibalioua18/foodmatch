
import React from 'react';
import { UtensilsCrossed, Settings, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  onSettingsClick: () => void;
  onProfileClick: () => void;
  currentUser: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ onSettingsClick, onProfileClick, currentUser }) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-amber-100/50 shadow-sm">
      {/* Beautiful Profile Button - Top Left */}
      <button 
        onClick={onProfileClick}
        className="group relative flex items-center justify-center active:scale-90 transition-all"
        aria-label="View Profile"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl flex items-center justify-center border-2 border-orange-100 shadow-sm group-hover:shadow-orange-200 group-hover:border-orange-400 group-hover:bg-orange-50 transition-all duration-300">
          <div className="relative">
            <UserIcon size={24} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
            {/* Small status indicator for polish */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </button>

      {/* Logo - Center */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-tr from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
          <UtensilsCrossed size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-black text-gray-800 tracking-tight italic">FoodMatch</h1>
      </div>

      {/* Settings Button - Top Right */}
      <button 
        onClick={onSettingsClick}
        className="group p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-gray-200"
        aria-label="Settings"
      >
        <Settings size={22} className="group-hover:rotate-45 transition-transform duration-500" />
      </button>
    </nav>
  );
};

export default Navbar;
