import { Cart, CartItem } from '../entities/cart.entity';

export interface ICartRepository {
    getCart(): Promise<Cart>;
    addItem(item: CartItem): Promise<void>;
    removeItem(plantId: string, variantId?: string): Promise<void>;
    updateQuantity(plantId: string, quantity: number, variantId?: string): Promise<void>;
    clearCart(): Promise<void>;
}
