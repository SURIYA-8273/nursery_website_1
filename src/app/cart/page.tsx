'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/presentation/store/cart.store';
import { WhatsAppService } from '@/data/services/whatsapp.service';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { CartSummary } from '@/presentation/components/features/cart-summary';

export default function CartPage() {
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
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-center">
                <h1 className="font-serif text-3xl font-bold text-primary">Your cart is empty</h1>
                <p className="text-text-secondary max-w-md">
                    Looks like you haven't added any plants to your jungle yet.
                </p>
                <Link
                    href="/"
                    className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-hover transition-colors shadow-lg"
                >
                    Browse Plants
                </Link>
            </div>
        );
    }

    const checkoutUrl = WhatsAppService.generateCheckoutLink(cart.items);

    return (
        <main className="min-h-screen max-w-6xl mx-auto p-4 py-8 md:py-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-8">
                Your Cart ({cart.totalItems})
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => {
                        const price = item.plant.discountPrice || item.plant.price;
                        return (
                            <div key={item.plant.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-secondary/10">
                                <div className="w-24 h-24 bg-surface rounded-xl overflow-hidden shrink-0">
                                    {item.plant.images[0] && (
                                        <img
                                            src={item.plant.images[0]}
                                            alt={item.plant.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-text-primary line-clamp-1">{item.plant.name}</h3>
                                            <p className="text-sm text-text-muted">₹{price} each</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.plant.id)}
                                            className="text-text-muted hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end mt-2">
                                        <div className="flex items-center gap-3 bg-surface rounded-lg px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.plant.id, Math.max(1, item.quantity - 1))}
                                                className="p-1 hover:text-primary disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.plant.id, Math.min(item.plant.stock, item.quantity + 1))}
                                                className="p-1 hover:text-primary disabled:opacity-50"
                                                disabled={item.quantity >= item.plant.stock}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <p className="font-bold text-lg text-primary">
                                            ₹{price * item.quantity}
                                        </p>
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
        </main>
    );
}
