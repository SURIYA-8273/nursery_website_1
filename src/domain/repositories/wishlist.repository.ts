import { Wishlist, WishlistItem } from '../entities/wishlist.entity';

export interface IWishlistRepository {
    getWishlist(): Promise<Wishlist>;
    addItem(item: WishlistItem): Promise<void>;
    removeItem(plantId: string): Promise<void>;
    clearWishlist(): Promise<void>;
    isInWishlist(plantId: string): Promise<boolean>;
}
