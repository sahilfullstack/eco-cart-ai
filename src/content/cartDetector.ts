import { CartItem } from "../types/cart";

class CartDetector {
  private static instance: CartDetector;
  private observer: MutationObserver | null = null;
  private currentSite: string = "";
  private cartItems: CartItem[] = [];

  private constructor() {
    this.initialize();
  }

  public static getInstance(): CartDetector {
    if (!CartDetector.instance) {
      CartDetector.instance = new CartDetector();
    }
    return CartDetector.instance;
  }

  private initialize(): void {
    this.detectCurrentSite();
    this.setupCartObserver();
  }

  private detectCurrentSite(): void {
    const hostname = window.location.hostname;
    if (hostname.includes("amazon")) {
      this.currentSite = "amazon";
    } else if (hostname.includes("flipkart")) {
      this.currentSite = "flipkart";
    } else if (hostname.includes("walmart")) {
      this.currentSite = "walmart";
    }
  }

  private setupCartObserver(): void {
    const cartSelectors = {
      amazon: "#sc-active-cart",
      flipkart: "._3dY_ZR",
      walmart: '[data-testid="cart-container"]',
    };

    const cartContainer = document.querySelector(
      cartSelectors[this.currentSite as keyof typeof cartSelectors]
    );

    if (cartContainer) {
      this.observer = new MutationObserver(() => {
        this.detectCartChanges();
      });

      this.observer.observe(cartContainer, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  }

  private detectCartChanges(): void {
    const newItems = this.extractCartItems();
    if (this.hasCartChanged(newItems)) {
      this.cartItems = newItems;
      this.notifyCartUpdate();
    }
  }

  private extractCartItems(): CartItem[] {
    const itemSelectors = {
      amazon: {
        container: ".sc-list-item",
        name: ".sc-product-title",
        price: ".sc-product-price",
        quantity: ".sc-quantity-input",
      },
      flipkart: {
        container: "._1AtVbE",
        name: "._2-uG6-",
        price: "._1-2Iqu",
        quantity: "._3dY_ZR",
      },
      walmart: {
        container: '[data-testid="cart-item"]',
        name: '[data-testid="cart-item-name"]',
        price: '[data-testid="cart-item-price"]',
        quantity: '[data-testid="cart-item-quantity"]',
      },
    };

    const selectors =
      itemSelectors[this.currentSite as keyof typeof itemSelectors];
    const items: CartItem[] = [];

    document.querySelectorAll(selectors.container).forEach((item) => {
      const name =
        item.querySelector(selectors.name)?.textContent?.trim() || "";
      const price = this.extractPrice(
        item.querySelector(selectors.price)?.textContent || ""
      );
      const quantity = parseInt(
        item.querySelector(selectors.quantity)?.getAttribute("value") || "1"
      );

      if (name && price) {
        items.push({
          name,
          price,
          quantity,
          site: this.currentSite,
          timestamp: new Date().toISOString(),
        });
      }
    });

    return items;
  }

  private extractPrice(priceText: string): number {
    return parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
  }

  private hasCartChanged(newItems: CartItem[]): boolean {
    if (this.cartItems.length !== newItems.length) return true;

    return this.cartItems.some((item, index) => {
      const newItem = newItems[index];
      return (
        item.name !== newItem.name ||
        item.price !== newItem.price ||
        item.quantity !== newItem.quantity
      );
    });
  }

  private notifyCartUpdate(): void {
    chrome.runtime.sendMessage({
      type: "CART_UPDATED",
      payload: {
        items: this.cartItems,
        site: this.currentSite,
      },
    });
  }

  public getCurrentCart(): CartItem[] {
    return [...this.cartItems];
  }

  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export default CartDetector;
