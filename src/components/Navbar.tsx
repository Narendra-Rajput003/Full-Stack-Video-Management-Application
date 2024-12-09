import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">VideoApp</Link>
        <div className="space-x-4">
          {['/', '/record'].map((path) => (
            <Link
              key={path}
              to={path}
              className="relative text-white hover:text-purple-200 transition-colors"
            >
              {path === '/' ? 'Dashboard' : 'Record'}
              {location.pathname === path && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  layoutId="navbar-underline"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

