import React from "react";
import mockPortfolio from "./mockPortfolio";
import PortfolioViewer from "./PortfolioViewer";

export default function PortfolioPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Devfolio</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Portfolio Preview</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Portfolio Preview
            </h1>
            <p className="text-lg text-gray-600">
              This is how your portfolio will look to visitors
            </p>
          </div>
          <PortfolioViewer data={mockPortfolio} />
        </div>
      </div>
    </div>
  );
} 