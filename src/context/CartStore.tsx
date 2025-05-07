"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    itemCount: number;
    totalAmount: number;

    // Actions
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;

    // Helpers
    isInCart: (id: number) => boolean;
    getItemQuantity: (id: number) => number;
}

const calculateItemCount = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
};

const calculateTotalAmount = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            itemCount: 0,
            totalAmount: 0,

            addItem: (item: CartItem) => {
                const { items } = get();
                const existingIndex = items.findIndex(cartItem => cartItem.id === item.id);

                let updatedItems;
                if (existingIndex !== -1) {
                    // Item already exists, update quantity
                    updatedItems = [...items];
                    updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        quantity: updatedItems[existingIndex].quantity + item.quantity
                    };
                } else {
                    // Add new item
                    updatedItems = [...items, item];
                }

                set({
                    items: updatedItems,
                    itemCount: calculateItemCount(updatedItems),
                    totalAmount: calculateTotalAmount(updatedItems)
                });
            },

            removeItem: (id: number) => {
                const { items } = get();
                const updatedItems = items.filter(item => item.id !== id);

                set({
                    items: updatedItems,
                    itemCount: calculateItemCount(updatedItems),
                    totalAmount: calculateTotalAmount(updatedItems)
                });
            },

            updateQuantity: (id: number, quantity: number) => {
                const { items } = get();

                if (quantity <= 0) {
                    // Remove item if quantity is 0 or less
                    const updatedItems = items.filter(item => item.id !== id);
                    set({
                        items: updatedItems,
                        itemCount: calculateItemCount(updatedItems),
                        totalAmount: calculateTotalAmount(updatedItems)
                    });
                    return;
                }

                const updatedItems = items.map(item =>
                    item.id === id ? { ...item, quantity } : item
                );

                set({
                    items: updatedItems,
                    itemCount: calculateItemCount(updatedItems),
                    totalAmount: calculateTotalAmount(updatedItems)
                });
            },

            clearCart: () => {
                set({
                    items: [],
                    itemCount: 0,
                    totalAmount: 0
                });
            },

            isInCart: (id: number) => {
                return get().items.some(item => item.id === id);
            },

            getItemQuantity: (id: number) => {
                const item = get().items.find(item => item.id === id);
                return item ? item.quantity : 0;
            }
        }),
        {
            name: "nexus-cart-storage"
        }
    )
);