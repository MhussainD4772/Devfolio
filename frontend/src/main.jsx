import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import PortfolioPreview from './PortfolioPreview.jsx';
import CreatePortfolio from './CreatePortfolio.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/create" element={<CreatePortfolio />} />
      <Route path="/preview" element={<PortfolioPreview />} />
    </Routes>
  </BrowserRouter>
);


