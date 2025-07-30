import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import PortfolioPreview from './PortfolioPreview.jsx';
import CreatePortfolio from './CreatePortfolio.jsx';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import EmailConfirm from './pages/EmailConfirm.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/confirm" element={<EmailConfirm />} />
      <Route path="/create" element={
        <ProtectedRoute>
          <CreatePortfolio />
        </ProtectedRoute>
      } />
      <Route path="/preview" element={<PortfolioPreview />} />
    </Routes>
  </BrowserRouter>
);


