import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface CartSummary {
  totalItems: number;
  totalCarbonFootprint: number;
  greenScore: number;
  recommendations: string[];
}

const Popup: React.FC = () => {
  const [summary, setSummary] = useState<CartSummary>({
    totalItems: 0,
    totalCarbonFootprint: 0,
    greenScore: 0,
    recommendations: [],
  });

  useEffect(() => {
    // Get cart data from storage
    chrome.storage.local.get(["cartSummary"], (result) => {
      if (result.cartSummary) {
        setSummary(result.cartSummary);
      }
    });
  }, []);

  return (
    <div className="popup-container">
      <h1>EcoCart AI 🌱</h1>

      <div className="summary-section">
        <h2>Cart Summary</h2>
        <p>Items in cart: {summary.totalItems}</p>
        <p>
          Total Carbon Footprint: {summary.totalCarbonFootprint.toFixed(2)} kg
          CO2e
        </p>
        <p>Green Score: {summary.greenScore}/100</p>
      </div>

      {summary.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h2>Recommendations</h2>
          <ul>
            {summary.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="actions-section">
        <button
          onClick={() =>
            chrome.tabs.create({ url: "https://example.com/offset" })
          }
        >
          Offset Carbon Footprint
        </button>
        <button
          onClick={() =>
            chrome.tabs.create({ url: "https://example.com/leaderboard" })
          }
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById("root"));
