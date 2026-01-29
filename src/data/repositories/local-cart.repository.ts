import { ICartRepository } from '@/domain/repositories/cart.repository';
import { Cart, CartItem } from '@/domain/entities/cart.entity';

const CART_STORAGE_KEY = 'plant_shop_cart';

export class LocalCartRepository implements ICartRepository {
    async getCart(): Promise<Cart> {
        if (typeof window === 'undefined') {
            return { items: [], totalItems: 0, totalPrice: 0 };
        }

        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) {
            return { items: [], totalItems: 0, totalPrice: 0 };
        }

        try {
            return JSON.parse(stored);
        } catch {
            return { items: [], totalItems: 0, totalPrice: 0 };
        }
    }

    async addItem(item: CartItem): Promise<void> {
        const cart = await this.getCart();
        const existingItemIndex = cart.items.findIndex(i =>
            i.plant.id === item.plant.id &&
            i.selectedVariant?.id === item.selectedVariant?.id
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += item.quantity;
        } else {
            cart.items.push(item);
        }

        this._updateTotals(cart);
        this._saveCart(cart);
    }

    async removeItem(plantId: string, variantId?: string): Promise<void> {
        const cart = await this.getCart();
        cart.items = cart.items.filter(item =>
            !(item.plant.id === plantId && item.selectedVariant?.id === variantId)
        );
        this._updateTotals(cart);
        this._saveCart(cart);
    }

    async updateQuantity(plantId: string, quantity: number, variantId?: string): Promise<void> {
        const cart = await this.getCart();
        const item = cart.items.find(item =>
            item.plant.id === plantId && item.selectedVariant?.id === variantId
        );

        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                cart.items = cart.items.filter(i =>
                    !(i.plant.id === plantId && i.selectedVariant?.id === variantId)
                );
            }
        }

        this._updateTotals(cart);
        this._saveCart(cart);
    }

    async clearCart(): Promise<void> {
        this._saveCart({ items: [], totalItems: 0, totalPrice: 0 });
    }

    private _updateTotals(cart: Cart): void {
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => {
            const price = item.selectedVariant?.price
                ? item.selectedVariant.price
                : (item.plant.discountPrice || item.plant.price || 0);
            return sum + (price * item.quantity);
        }, 0);
    }

    private _saveCart(cart: Cart): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            // Dispatch event for reactive updates if needed across tabs/components
            window.dispatchEvent(new Event('cart-updated'));
        }
    }
}
