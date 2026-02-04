import { Plant } from './plant.entity';

export interface CartItem {
    plant: Plant;
    quantity: number;
    selectedVariant?: {
        id: string;
        size: string;
        price: number;
        discountPrice?: number;
    };
}

export interface Cart {
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    totalAmount: number;
    customerName?: string;
    customerPhone?: string;
    createdAt: Date;
    status: 'pending' | 'completed' | 'cancelled';
}
