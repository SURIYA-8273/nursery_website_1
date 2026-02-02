'use client';

import { useState } from 'react';
import { useCartStore } from '@/presentation/store/cart.store';
import { Plant } from '@/domain/entities/plant.entity';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

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

            <Button
                onClick={handleAdd}
                disabled={isAdding || (plant.stock || 0) === 0}
                
            >
                <ShoppingBag size={20} />
                {'Add to Cart'}
            </Button>
        </div>
    );
};
