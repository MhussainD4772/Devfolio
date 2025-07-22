import React from "react";
import mockPortfolio from "./mockPortfolio";
import PortfolioViewer from "./PortfolioViewer";

export default function PortfolioPreview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen transition-colors duration-300">
      <PortfolioViewer data={mockPortfolio} />
    </div>
  );
} 