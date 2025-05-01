import { calculateCarbonFootprint } from "./services/carbonCalculator";
import { findEcoAlternatives } from "./services/ecoAlternatives";
import { analyzeProduct } from "./services/productAnalyzer";

interface CartItem {
  name: string;
  price: number;
  brand: string;
  quantity: number;
  url: string;
}

class EcoCartAI {
  private cartItems: CartItem[] = [];
  private currentSite: string;

  constructor() {
    this.currentSite = window.location.hostname;
    this.initialize();
  }

  private async initialize() {
    this.detectCart();
    this.setupMutationObserver();
  }

  private detectCart() {
    switch (this.currentSite) {
      case "www.amazon.com":
        this.detectAmazonCart();
        break;
      case "www.flipkart.com":
        this.detectFlipkartCart();
        break;
      // Add more sites as needed
    }
  }

  private detectAmazonCart() {
    const cartItems = document.querySelectorAll("[data-asin]");
    cartItems.forEach((item) => {
      const name = item.querySelector(".a-truncate")?.textContent?.trim();
      const price = parseFloat(
        item
          .querySelector(".a-price-whole")
          ?.textContent?.replace(/[^0-9.]/g, "") || "0"
      );
      const brand = item
        .querySelector(".a-size-base-plus")
        ?.textContent?.trim();

      if (name && price) {
        this.cartItems.push({
          name,
          price,
          brand: brand || "Unknown",
          quantity: 1,
          url: window.location.href,
        });
      }
    });
  }

  private detectFlipkartCart() {
    // Implement Flipkart cart detection
    // Similar to Amazon but with Flipkart-specific selectors
  }

  private setupMutationObserver() {
    const observer = new MutationObserver(() => {
      this.detectCart();
      this.analyzeCart();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private async analyzeCart() {
    for (const item of this.cartItems) {
      const analysis = await analyzeProduct(item);
      const carbonFootprint = await calculateCarbonFootprint(item);
      const alternatives = await findEcoAlternatives(item);

      this.displayResults(item, analysis, carbonFootprint, alternatives);
    }
  }

  private displayResults(
    item: CartItem,
    analysis: any,
    carbonFootprint: number,
    alternatives: any[]
  ) {
    // Create and inject the results UI
    const resultsDiv = document.createElement("div");
    resultsDiv.className = "eco-cart-results";
    resultsDiv.innerHTML = `
      <div class="eco-cart-item">
        <h3>${item.name}</h3>
        <p>Environmental Impact: ${analysis.impact}</p>
        <p>Carbon Footprint: ${carbonFootprint} kg CO2e</p>
        ${
          alternatives.length > 0
            ? `
          <div class="eco-alternatives">
            <h4>Eco-Friendly Alternatives:</h4>
            <ul>
              ${alternatives
                .map(
                  (alt) => `
                <li>
                  <a href="${alt.url}">${alt.name}</a>
                  <span>${alt.impact}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    `;

    // Find the appropriate location to inject the results
    const cartContainer =
      document.querySelector("#cart-container") || document.body;
    cartContainer.appendChild(resultsDiv);
  }
}

// Initialize the extension
new EcoCartAI();
