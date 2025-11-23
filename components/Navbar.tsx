import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { APP_NAME, APP_VERSION } from '../constants';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Terminal', path: '/terminal' },
    { name: 'Database', path: '/database' },
    { name: 'About', path: '/about' }
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-red-900 bg-black/90 backdrop-blur-md shadow-[0_4px_20px_rgba(139,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <i className="fa-solid fa-biohazard text-red-600 text-2xl animate-pulse group-hover:rotate-180 transition-transform duration-700"></i>
            <span className="text-white font-['Press_Start_2P'] text-sm md:text-lg tracking-tighter">
              {APP_NAME} <span className="text-red-600">{APP_VERSION}</span>
            </span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${
                      isActive 
                        ? 'text-red-500 bg-red-900/20' 
                        : 'text-gray-300 hover:text-red-400 hover:bg-red-900/10'
                    }`
                  }
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-red-500 hover:text-white hover:bg-red-900 focus:outline-none border border-red-900 transition-colors"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-red-900 absolute w-full animate-slide-down shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium font-['Press_Start_2P'] text-xs ${
                    isActive
                      ? 'text-red-500 bg-red-900/20 border-l-4 border-red-600'
                      : 'text-gray-300 hover:text-red-500 hover:bg-gray-900'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {'>'} {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;