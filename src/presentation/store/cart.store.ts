import { create } from 'zustand';
import { Cart } from '@/domain/entities/cart.entity';
import { ICartRepository } from '@/domain/repositories/cart.repository';
import { Plant } from '@/domain/entities/plant.entity';
import { LocalCartRepository } from '@/data/repositories/local-cart.repository';

interface CartState {
    cart: Cart;
    isLoading: boolean;
    addToCart: (plant: Plant, quantity: number, variant?: { id: string; size: string; price: number }) => Promise<void>;
    removeFromCart: (plantId: string, variantId?: string) => Promise<void>;
    updateQuantity: (plantId: string, quantity: number, variantId?: string) => Promise<void>;
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

        addToCart: async (plant: Plant, quantity: number, variant?: { id: string; size: string; price: number }) => {
            await repository.addItem({
                plant,
                quantity,
                selectedVariant: variant
            });
            await get().refreshCart();
        },

        removeFromCart: async (plantId: string, variantId?: string) => {
            await repository.removeItem(plantId, variantId);
            await get().refreshCart();
        },

        updateQuantity: async (plantId: string, quantity: number, variantId?: string) => {
            await repository.updateQuantity(plantId, quantity, variantId);
            await get().refreshCart();
        },

        clearCart: async () => {
            await repository.clearCart();
            set({ cart: { items: [], totalItems: 0, totalPrice: 0 } });
        },
    };
});
