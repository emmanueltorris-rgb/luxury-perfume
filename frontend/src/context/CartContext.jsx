import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
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

  const addItem = useCallback(
    async (product) => {
      if (!token) {
        console.warn("User is not logged in");
        return;
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
      } catch (error) {
        console.error("Error adding item to cart:", error);
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