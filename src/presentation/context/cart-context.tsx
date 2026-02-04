'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem } from '@/domain/entities/cart.entity';
import { Plant } from '@/domain/entities/plant.entity';
import { LocalCartRepository } from '@/data/repositories/local-cart.repository';
import { toast } from 'react-toastify';

interface CartContextType {
    cart: Cart;
    isLoading: boolean;
    addToCart: (plant: Plant, quantity: number, variant?: { id: string; size: string; price: number }) => Promise<void>;
    removeFromCart: (plantId: string, variantId?: string) => Promise<void>;
    updateQuantity: (plantId: string, quantity: number, variantId?: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Initialize repository
    // Initialize repository - ensure it's stable or instantiated outside if stateless.
    // LocalCartRepository is stateless/singleton-like so simpler is better, but let's memoize just in case.
    const repository = React.useMemo(() => new LocalCartRepository(), []);

    const refreshCart = React.useCallback(async () => {
        const data = await repository.getCart();
        setCart(data);
    }, [repository]);

    useEffect(() => {
        const initCart = async () => {
            setIsLoading(true);
            await refreshCart();
            setIsLoading(false);
        };
        initCart();
    }, [refreshCart]);

    const addToCart = React.useCallback(async (plant: Plant, quantity: number, variant?: { id: string; size: string; price: number }) => {
        await repository.addItem({
            plant,
            quantity,
            selectedVariant: variant
        });
        await refreshCart();
        toast.success(`${plant.name} added to cart!`);
    }, [repository, refreshCart]);

    const removeFromCart = React.useCallback(async (plantId: string, variantId?: string) => {
        await repository.removeItem(plantId, variantId);
        await refreshCart();
    }, [repository, refreshCart]);

    const updateQuantity = React.useCallback(async (plantId: string, quantity: number, variantId?: string) => {
        await repository.updateQuantity(plantId, quantity, variantId);
        await refreshCart();
    }, [repository, refreshCart]);

    const clearCart = React.useCallback(async () => {
        await repository.clearCart();
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }, [repository]);

    return (
        <CartContext.Provider value={{ cart, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
