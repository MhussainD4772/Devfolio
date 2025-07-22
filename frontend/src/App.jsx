import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl"
        initial={{ scale: 0, x: -200, y: -200 }}
        animate={{ scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, type: 'spring' }}
        style={{ zIndex: 0 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl"
        initial={{ scale: 0, x: 200, y: 200 }}
        animate={{ scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, type: 'spring' }}
        style={{ zIndex: 0 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full opacity-20 blur-2xl"
        initial={{ scale: 0, x: '-50%', y: '-50%' }}
        animate={{ scale: 1, x: '-50%', y: '-50%' }}
        transition={{ duration: 1.4, delay: 0.4, type: 'spring' }}
        style={{ zIndex: 0 }}
      />
      {/* Main content (no entrance animation) */}
      <div className="relative z-10 text-center p-10 bg-white/80 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-100">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Welcome to <span className="text-indigo-600">Devfolio</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-10">
          Build your professional developer portfolio in minutes.<br />
          <span className="text-indigo-500 font-semibold">Showcase your skills. Land your dream job.</span>
        </p>
        <div>
          <Link
            to="/create"
            className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xl font-bold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-600 hover:scale-105 transform transition-all duration-300"
          >
            🚀 Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;