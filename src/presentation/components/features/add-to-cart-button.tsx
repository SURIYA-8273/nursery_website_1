'use client';

import { useState } from 'react';
import { useCartStore } from '@/presentation/store/cart.store';
import { Plant } from '@/domain/entities/plant.entity';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    plant: Plant;
    selectedVariant?: {
        id: string;
        size: string;
        price: number;
    };
    className?: string;
}

export const AddToCartButton = ({ plant, selectedVariant, className }: Props) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAdd = async () => {
        setIsAdding(true);
        await addToCart(plant, quantity, selectedVariant);

        // Simulate feedback delay
        setTimeout(() => {
            setIsAdding(false);
            setQuantity(1);
        }, 500);
    };

    return (
        <div className={cn("flex flex-col sm:flex-row gap-4 flex-1", className)}>
            <div className="flex items-center justify-between bg-surface rounded-xl px-4 py-3 border border-secondary/20 min-w-[140px]">
                <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 hover:text-primary transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                >
                    <Minus size={18} />
                </button>
                <span className="font-bold text-lg min-w-[2ch] text-center">{quantity}</span>
                <button
                    onClick={() => setQuantity(q => Math.min(plant.stock || 0, q + 1))}
                    className="p-1 hover:text-primary transition-colors disabled:opacity-50"
                    disabled={quantity >= (plant.stock || 0)}
                >
                    <Plus size={18} />
                </button>
            </div>

            <button
                onClick={handleAdd}
                disabled={isAdding || (plant.stock || 0) === 0}
                className={cn(
                    "flex-1 flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg active:scale-95 text-lg",
                    isAdding
                        ? "bg-secondary text-white cursor-wait"
                        : "bg-primary text-white hover:bg-primary-hover hover:shadow-primary/30"
                )}
            >
                <ShoppingBag size={20} className={isAdding ? "animate-bounce" : ""} />
                {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
        </div>
    );
};
