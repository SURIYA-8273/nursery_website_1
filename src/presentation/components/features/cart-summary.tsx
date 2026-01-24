import { useState } from 'react';
import { ArrowRight, ShieldCheck, RefreshCw, Truck, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Heading, Text } from '@/presentation/components/ui/typography';

interface CartSummaryProps {
    totalPrice: number;
    checkoutUrl: string;
}

export const CartSummary = ({ totalPrice, checkoutUrl }: CartSummaryProps) => {
    const [isPromoOpen, setIsPromoOpen] = useState(false);

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-soft sticky top-32 border border-secondary/10">
            <Heading level={2} className="text-2xl md:text-3xl mb-6">Order Summary</Heading>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-secondary text-lg">
                    <Text>Subtotal</Text>
                    <Text className="font-medium text-text-primary">₹{totalPrice}</Text>
                </div>
                <div className="flex justify-between text-text-secondary text-lg">
                    <Text>Delivery</Text>
                    <Text className="text-green-600 font-bold">Free</Text>
                </div>

                {/* Promo Code Toggle */}
                <div className="pt-2">
                    <button
                        onClick={() => setIsPromoOpen(!isPromoOpen)}
                        className="flex items-center gap-2 text-primary text-sm font-bold hover:text-primary-hover transition-colors"
                    >
                        <Tag size={16} />
                        Have a promo code?
                        {isPromoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isPromoOpen && (
                        <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2">
                            <input
                                type="text"
                                placeholder="Enter code"
                                className="flex-1 px-4 py-2 border border-secondary/20 rounded-xl text-sm focus:outline-none focus:border-primary/50 bg-surface/30"
                            />
                            <Button variant="secondary" size="sm" className="px-4">Apply</Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-dashed border-secondary/20 pt-6 mb-8">
                <div className="flex justify-between items-center">
                    <Text className="font-serif font-bold text-xl md:text-2xl text-text-primary">Total</Text>
                    <Text className="font-serif font-bold text-2xl md:text-3xl text-primary">₹{totalPrice}</Text>
                </div>
                <Text variant="caption" className="text-text-muted mt-2">
                    Including all taxes
                </Text>
            </div>

            <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block mb-8"
            >
                <Button size="lg" fullWidth className="h-14 text-lg gap-3 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
                    Checkout via WhatsApp
                    <ArrowRight size={22} />
                </Button>
            </a>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-secondary/10">
                <div className="flex items-center gap-3 text-text-secondary">
                    <div className="p-2 bg-secondary/5 rounded-full text-primary">
                        <ShieldCheck size={18} />
                    </div>
                    <span className="text-xs font-medium">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                    <div className="p-2 bg-secondary/5 rounded-full text-primary">
                        <RefreshCw size={18} />
                    </div>
                    <span className="text-xs font-medium">Free Returns</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                    <div className="p-2 bg-secondary/5 rounded-full text-primary">
                        <Truck size={18} />
                    </div>
                    <span className="text-xs font-medium">Fast Delivery</span>
                </div>
            </div>

            <Text variant="caption" className="text-center mt-6 text-text-muted bg-surface/50 py-2 rounded-lg">
                You will be redirected to WhatsApp to confirm details.
            </Text>
        </div>
    );
};
