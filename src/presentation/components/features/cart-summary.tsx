import { ArrowRight, ShieldCheck, Truck, ShoppingBag, Shield } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

interface CartSummaryProps {
    totalPrice: number;
    checkoutUrl: string;
}

export const CartSummary = ({ totalPrice, checkoutUrl }: CartSummaryProps) => {
    return (
        <div className="bg-[var(--color-surface-hover)] p-4 md:p-6 rounded-[10px] border border-primary/50 h-fit shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
                    <span className="text-lg">Subtotal</span>
                    <span className="font-medium text-[var(--color-text-primary)]">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
                    <span className="text-lg">Shipping</span>
                    <span className="font-medium">Free</span>
                </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-4">
                <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-xl md:text-2xl text-[var(--color-text-primary)]">Total</span>
                    <span className="font-serif font-bold text-2xl md:text-3xl text-[var(--color-text-primary)]">₹{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button className='w-full'>
                        Proceed to Checkout
                    </Button>
                </a>
                <a href="/plants">
                    <Button variant="outline" className='w-full'>
                        Continue Shopping
                    </Button>
                </a>
            </div>

           
        </div>
    );
};
