import { WishlistClient } from './wishlist-client';

export const metadata = {
    title: 'Your Wishlist | Verdant',
    description: 'Plants you have saved to your wishlist.',
};

export default function WishlistPage() {
    return <WishlistClient />;
}
