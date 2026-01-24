import { Cart, CartItem } from '../entities/cart.entity';

export interface ICartRepository {
    getCart(): Promise<Cart>;
    addItem(item: CartItem): Promise<void>;
    removeItem(plantId: string): Promise<void>;
    updateQuantity(plantId: string, quantity: number): Promise<void>;
    clearCart(): Promise<void>;
}
