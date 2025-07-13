import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CreatePortfolio from './CreatePortfolio';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to Devfolio
                </h1>
                <p className="text-gray-600 mb-8">
                  Create your professional portfolio in minutes
                </p>
                <Link
                  to="/create"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Portfolio
                </Link>
              </div>
            </div>
          } />
          <Route path="/create" element={<CreatePortfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;