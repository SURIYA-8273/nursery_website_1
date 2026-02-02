export interface PlantVariant {
    id: string; // e.g., '101-4x6'
    size: string; // e.g., '4 x 6'
    price: number;
    discountPrice?: number; // discount in the JSON seems to be percentage? User JSON: "discount: 19". Let's assume user meant percentage or value. The existing entity had discountPrice as number. I will map it as number value for now or clarifications.
    // Wait, the JSON says "discount: 19", "price: 15". 19% of 15 is ~2.85. If it's a value, 19 is > 15. So likely percentage.
    // However, the existing entity has `discountPrice?: number`.
    // I will keep `discountPrice` as the calculated final price or discount amount? 
    // The previous implementation had `discountPrice` which usually means the *new* price.
    // But in the user JSON: "price: 15, discount: 19". If 19 is percent, new price is 15 * 0.81 = 12.15.
    // Let's stick to the interface definition first. I will add `discount` as percentage if needed, or stick to `discountPrice`.
    // For now, I'll add `discount` (percentage) and keep `discountPrice` (value) for backward compat/ease.
    discount?: number; // percentage

    ratings?: number;
    reviewsCount?: number;
    growthRate?: string;
    height?: string;
    weight?: string;
    potSize?: string;
    quantityInStock: number;
    isAvailable: boolean;
    coverImages: string[];
}

export interface Plant {
    id: string; // number in JSON (101), but string in existing entity. Keeping string for ID is safer.
    name: string;
    description: string;

    // Category & Tags
    category?: string; // "flowering" (User JSON has 'category' string)
    categoryId: string; // Existing relational ID
    tags?: string[]; // ['ritual use', '...']

    // Care & Info
    careInstructions?: string; // Existing field, alias to careInfo?
    fertilizingInfo?: string; // "Use organic compost..."
    usageInfo?: string; // "Commonly used in pooja..."

    // Images
    images: string[];

    // Status
    isAvailable: boolean; // boolean
    isActive: boolean; // Existing field

    // Variants
    variants: PlantVariant[];

    // Meta info for UI
    rating?: number;
    reviewCount?: number;

    // Summary fields (usually from default variant or root fallback)
    price?: number;
    discountPrice?: number;
    stock?: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    image?: string;
    description?: string;
}
