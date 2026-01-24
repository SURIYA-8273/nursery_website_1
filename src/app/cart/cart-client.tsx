'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/presentation/store/cart.store';
import { WhatsAppService } from '@/data/services/whatsapp.service';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { CartSummary } from '@/presentation/components/features/cart-summary';
import { CheckoutSteps } from '@/presentation/components/features/checkout-steps';
import { PlantCard } from '@/presentation/components/ui/plant-card';
import { Plant } from '@/domain/entities/plant.entity';

interface CartClientProps {
    relatedPlants: Plant[];
}

export function CartClient({ relatedPlants }: CartClientProps) {
    const { cart, isLoading, refreshCart, updateQuantity, removeFromCart } = useCartStore();

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 pt-20 text-center">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-2">
                    <span className="text-4xl">🛒</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-primary">Your cart is empty</h1>
                <p className="text-text-secondary max-w-md">
                    Looks like you haven't added any plants to your jungle yet.
                    <br />Start exploring our lush collection!
                </p>
                <Link
                    href="/"
                    className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                    Browse Plants
                </Link>
            </div>
        );
    }

    const checkoutUrl = WhatsAppService.generateCheckoutLink(cart.items);

    return (
        <main className="min-h-screen max-w-7xl mx-auto p-4 pt-24 pb-12 md:pt-28 md:pb-20">
            {/* Checkout Progress Steps */}
            <CheckoutSteps currentStep="cart" />

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-8 ml-2">
                Your Cart ({cart.totalItems})
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => {
                        const price = item.plant.discountPrice || item.plant.price;
                        return (
                            <div key={item.plant.id} className="group flex gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-secondary/10 hover:border-primary/20">
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-surface rounded-2xl overflow-hidden shrink-0 relative">
                                    {item.plant.images[0] && (
                                        <img
                                            src={item.plant.images[0]}
                                            alt={item.plant.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-serif font-bold text-lg md:text-xl text-text-primary line-clamp-1 mb-1">{item.plant.name}</h3>
                                            <p className="text-sm text-text-muted font-medium">₹{price} each</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.plant.id)}
                                            className="text-text-muted hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                            title="Remove item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
                                        <div className="flex items-center gap-4 bg-surface rounded-full px-2 py-1.5 w-fit border border-secondary/10">
                                            <button
                                                onClick={() => updateQuantity(item.plant.id, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-inherit"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-bold w-6 text-center text-sm md:text-base">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.plant.id, Math.min(item.plant.stock, item.quantity + 1))}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-inherit"
                                                disabled={item.quantity >= item.plant.stock}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-text-muted mb-0.5">Total</p>
                                            <p className="font-serif font-bold text-xl md:text-2xl text-primary">
                                                ₹{price * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Card */}
                <div className="lg:col-span-1">
                    <CartSummary totalPrice={cart.totalPrice} checkoutUrl={checkoutUrl} />
                </div>
            </div>

            {/* Related Products / You Might Also Like */}
            {relatedPlants.length > 0 && (
                <div className="mt-20 border-t border-secondary/10 pt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">You Might Also Like</h2>
                        <Link href="/plants" className="text-primary font-bold hover:underline flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {relatedPlants.slice(0, 4).map(plant => (
                            <PlantCard key={plant.id} plant={plant} />
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}
