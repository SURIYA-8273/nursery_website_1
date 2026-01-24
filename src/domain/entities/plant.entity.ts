export interface Plant {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    description: string;
    careInstructions?: string;
    categoryId: string;
    images: string[];
    stock: number;
    isActive: boolean;
    isFeatured?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
}
