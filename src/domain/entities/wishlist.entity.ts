import { Plant } from './plant.entity';

export interface WishlistItem {
    plant: Plant;
    addedAt: Date;
}

export interface Wishlist {
    items: WishlistItem[];
    totalItems: number;
}
