import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

  const loadCart = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load cart");
      }

      const data = await response.json();

      setItems(data.items || []);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }, [token, API_URL]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (token) {
      setShowAuthPrompt(false);
    }
  }, [token]);

  const addItem = useCallback(
    async (product) => {
      if (!token) {
        setShowAuthPrompt(true);
        return false;
      }

      try {
        const response = await fetch(`${API_URL}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }

        await loadCart();
        return true;
      } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error;
      }
    },
    [token, API_URL, loadCart]
  );

  const removeItem = useCallback(
    async (cartItemId) => {
      try {
        const response = await fetch(
          `${API_URL}/cart/${cartItemId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove item");
        }

        await loadCart();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    },
    [token, API_URL, loadCart]
  );

  const updateItemQuantity = useCallback(
    async (cartItemId, quantity) => {
      try {
        const response = await fetch(
          `${API_URL}/cart/${cartItemId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              quantity,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update quantity");
        }

        await loadCart();
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    },
    [token, API_URL, loadCart]
  );

  const clearCart = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/cart/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }, [token, API_URL]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        total,
        count,
        reloadCart: loadCart,
      }}
    >
      {children}
      {showAuthPrompt && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-cart-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-luxury-gold/30 bg-[#16100d] p-7 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAuthPrompt(false)}
              className="absolute right-4 top-3 text-2xl text-white/60 transition hover:text-white"
              aria-label="Close sign-in prompt"
            >
              ×
            </button>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">
              Your perfume cart
            </p>
            <h2 id="auth-cart-title" className="text-2xl font-semibold text-white">
              Sign in to add items
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Create an account or log in to save this fragrance to your cart and continue to checkout.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/signup"
                onClick={() => setShowAuthPrompt(false)}
                className="rounded-lg bg-luxury-gold px-4 py-3 text-sm font-semibold text-[#1a120d] transition hover:bg-[#f4d18e]"
              >
                Create account
              </Link>
              <Link
                to="/login"
                onClick={() => setShowAuthPrompt(false)}
                className="rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
