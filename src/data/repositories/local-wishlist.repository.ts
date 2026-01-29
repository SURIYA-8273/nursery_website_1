import { IWishlistRepository } from '@/domain/repositories/wishlist.repository';
import { Wishlist, WishlistItem } from '@/domain/entities/wishlist.entity';

const WISHLIST_STORAGE_KEY = 'plant_shop_wishlist';

export class LocalWishlistRepository implements IWishlistRepository {
    async getWishlist(): Promise<Wishlist> {
        if (typeof window === 'undefined') {
            return { items: [], totalItems: 0 };
        }

        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (!stored) {
            return { items: [], totalItems: 0 };
        }

        try {
            return JSON.parse(stored);
        } catch {
            return { items: [], totalItems: 0 };
        }
    }

    async addItem(item: WishlistItem): Promise<void> {
        const wishlist = await this.getWishlist();
        const exists = wishlist.items.some(i => i.plant.id === item.plant.id);

        if (!exists) {
            wishlist.items.push(item);
            this._updateTotals(wishlist);
            this._saveWishlist(wishlist);
        }
    }

    async removeItem(plantId: string): Promise<void> {
        const wishlist = await this.getWishlist();
        wishlist.items = wishlist.items.filter(i => i.plant.id !== plantId);
        this._updateTotals(wishlist);
        this._saveWishlist(wishlist);
    }

    async clearWishlist(): Promise<void> {
        this._saveWishlist({ items: [], totalItems: 0 });
    }

    async isInWishlist(plantId: string): Promise<boolean> {
        const wishlist = await this.getWishlist();
        return wishlist.items.some(i => i.plant.id === plantId);
    }

    private _updateTotals(wishlist: Wishlist): void {
        wishlist.totalItems = wishlist.items.length;
    }

    private _saveWishlist(wishlist: Wishlist): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
            window.dispatchEvent(new Event('wishlist-updated'));
        }
    }
}
