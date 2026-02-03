'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/presentation/store/cart.store';
import { WhatsAppService } from '@/data/services/whatsapp.service';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { CartSummary } from '@/presentation/components/features/cart-summary';
import { PlantCard } from '@/presentation/components/ui/plant-card';
import { Plant } from '@/domain/entities/plant.entity';
import { Heading } from '@/presentation/components/home/heading';
import { Button } from '@/presentation/components/ui/button';

interface CartClientProps {
    relatedPlants: Plant[];
}

export function CartClient({ relatedPlants }: CartClientProps) {
    const { cart, isLoading, refreshCart, updateQuantity, removeFromCart, clearCart } = useCartStore();

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2D5A42]"></div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 pt-20 text-center bg-white">
                <div className="w-24 h-24 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-2">
                    <span className="text-4xl text-[#2D5A42]">🛒</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#1A2E26]">Your cart is empty</h1>
                <p className="text-[#4A5D54] max-w-md">
                    Looks like you haven't added any plants to your jungle yet.
                    Start exploring our lush collection!
                </p>
                <Link
                    href="/plants"
                    className="bg-[#2D5A42] text-white px-8 py-3 rounded-full hover:bg-[#234734] transition-all shadow-lg active:scale-95"
                >
                    Browse Plants
                </Link>
            </div>
        );
    }

    const checkoutUrl = WhatsAppService.generateCheckoutLink(cart.items);

    return (
        <main className="min-h-screen bg-[var(--color-surface)] max-w-7xl mx-auto pb-12 md:pb-20">
            <div className='mb-4'></div>

            <Heading title="Shopping Cart" subtitle={`${cart.totalItems} ${cart.totalItems === 1 ? 'item' : 'items'} in your cart`} />


            <div className="px-4 md:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="space-y-4">
                            {cart.items.map((item) => {
                                const price = item.selectedVariant ? item.selectedVariant.price : item.plant.price;
                                return (
                                    <div key={`${item.plant.id}-${item.selectedVariant?.id || 'default'}`} className="flex gap-4 md:gap-8 p-2 md:p-4 bg-[var(--color-surface-hover)] rounded-[10px] border border-primary/50 shadow-sm group relative">
                                        {/* Image */}
                                        <div className="w-24 h-24 md:w-40 md:h-40 bg-[var(--color-surface)] rounded-2xl md:rounded-[24px] overflow-hidden shrink-0 relative shadow-sm">
                                            {item.plant.images[0] && (
                                                <img
                                                    src={item.plant.images[0]}
                                                    alt={item.plant.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-between py-1 md:py-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="space-y-1">
                                                    <h3 className="font-serif font-bold text-lg md:text-2xl text-[var(--color-text-primary)] leading-tight">{item.plant.name}</h3>
                                                    {item.plant.description && (
                                                        <p className="text-xs md:text-sm text-[var(--color-text-secondary)] italic font-medium opacity-80">{item.plant.name.toLowerCase()}</p>
                                                    )}
                                                    {item.selectedVariant && (
                                                        <p className="text-xs md:text-sm text-[var(--color-text-muted)] font-medium mt-1">Size: {item.selectedVariant.size}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.plant.id, item.selectedVariant?.id)}
                                                    className="bg-[#FF4D4D] text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-sm active:scale-95"
                                                    title="Remove from wishlist"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 md:border-none">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center gap-4 bg-[var(--color-surface)] rounded-full px-2 py-1 shadow-sm border border-primary">
                                                    <button
                                                        onClick={() => updateQuantity(item.plant.id, Math.max(1, item.quantity - 1), item.selectedVariant?.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] transition-colors disabled:opacity-30 border border-primary"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-bold w-4 text-center text-sm md:text-base text-[var(--color-text-primary)]">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.plant.id, item.quantity + 1, item.selectedVariant?.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] transition-colors border border-primary"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right flex items-center gap-3">
                                                    <p className="font-serif font-bold text-lg md:text-2xl text-[var(--color-text-primary)]">
                                                        ₹{((price || 0) * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className='flex justify-center items-center'>
                            <Button
                                onClick={clearCart}
                            >
                                Clear all items
                            </Button>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <CartSummary totalPrice={cart.totalPrice} checkoutUrl={checkoutUrl} />
                    </div>
                </div>

                {/* Related Products */}
                {relatedPlants.length > 0 && (
                    <div className="mt-24 pt-16 border-t border-white/10">
                        <div className="flex items-center justify-between mb-10 px-2">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">You Might Also Like</h2>
                            <Link href="/plants" className="text-[var(--color-primary-light)] font-bold hover:underline flex items-center gap-1 transition-all">
                                View All <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 px-2">
                            {relatedPlants.slice(0, 4).map(plant => (
                                <PlantCard key={plant.id} plant={plant} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
