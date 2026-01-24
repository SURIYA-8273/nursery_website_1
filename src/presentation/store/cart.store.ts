import { create } from 'zustand';
import { Cart } from '@/domain/entities/cart.entity';
import { ICartRepository } from '@/domain/repositories/cart.repository';
import { Plant } from '@/domain/entities/plant.entity';
import { LocalCartRepository } from '@/data/repositories/local-cart.repository';

interface CartState {
    cart: Cart;
    isLoading: boolean;
    addToCart: (plant: Plant, quantity: number) => Promise<void>;
    removeFromCart: (plantId: string) => Promise<void>;
    updateQuantity: (plantId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => {
    // Initialize repository lazily or outside
    const repository: ICartRepository = new LocalCartRepository();

    return {
        cart: { items: [], totalItems: 0, totalPrice: 0 },
        isLoading: true,

        refreshCart: async () => {
            set({ isLoading: true });
            const cart = await repository.getCart();
            set({ cart, isLoading: false });
        },

        addToCart: async (plant: Plant, quantity: number) => {
            await repository.addItem({ plant, quantity });
            await get().refreshCart();
        },

        removeFromCart: async (plantId: string) => {
            await repository.removeItem(plantId);
            await get().refreshCart();
        },

        updateQuantity: async (plantId: string, quantity: number) => {
            await repository.updateQuantity(plantId, quantity);
            await get().refreshCart();
        },

        clearCart: async () => {
            await repository.clearCart();
            set({ cart: { items: [], totalItems: 0, totalPrice: 0 } });
        },
    };
});
