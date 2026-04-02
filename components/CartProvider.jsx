'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCustomComboDiscount } from '@/lib/utils';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('combo_shop_cart');
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('combo_shop_cart', JSON.stringify(cart));
    }
  }, [cart, loaded]);

  const addProduct = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.type === 'product' && i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.type === 'product' && i.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { type: 'product', id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity }];
    });
  }, []);

  const addCombo = useCallback((combo, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.type === 'combo' && i.id === combo.id);
      if (existing) {
        return prev.map((i) =>
          i.type === 'combo' && i.id === combo.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        type: 'combo',
        id: combo.id,
        name: combo.name,
        price: combo.combo_price,
        original_price: combo.original_price,
        discount_percent: combo.discount_percent,
        image_url: combo.image_url,
        quantity,
      }];
    });
  }, []);

  const addCustomCombo = useCallback((products) => {
    const originalPrice = products.reduce((s, p) => s + p.price, 0);
    const discount = getCustomComboDiscount(products.length);
    const comboPrice = Math.round(originalPrice * (1 - discount / 100));
    const id = `custom-${Date.now()}`;
    setCart((prev) => [...prev, {
      type: 'custom_combo',
      id,
      name: `My Custom Combo (${products.length} items)`,
      price: comboPrice,
      original_price: originalPrice,
      discount_percent: discount,
      items: products.map((p) => ({ id: p.id, name: p.name, price: p.price })),
      quantity: 1,
    }]);
  }, []);

  const updateQuantity = useCallback((type, id, quantity) => {
    if (quantity < 1) return removeItem(type, id);
    setCart((prev) =>
      prev.map((i) => (i.type === type && i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const removeItem = useCallback((type, id) => {
    setCart((prev) => prev.filter((i) => !(i.type === type && i.id === id)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalSavings = cart
    .filter((i) => i.type === 'combo' || i.type === 'custom_combo')
    .reduce((s, i) => s + (i.original_price - i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addProduct, addCombo, addCustomCombo, updateQuantity, removeItem, clearCart, totalItems, totalPrice, totalSavings, loaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
