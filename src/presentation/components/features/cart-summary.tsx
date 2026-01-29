import { ArrowRight, ShieldCheck, Truck, ShoppingBag, Shield } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

interface CartSummaryProps {
    totalPrice: number;
    checkoutUrl: string;
}

export const CartSummary = ({ totalPrice, checkoutUrl }: CartSummaryProps) => {
    return (
        <div className="bg-[#FAF9F6] p-6 md:p-8 rounded-[32px] border border-secondary/5 h-fit shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A2E26] mb-6">Order Summary</h2>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[#4A5D54]">
                    <span className="text-lg">Subtotal</span>
                    <span className="font-medium text-[#1A2E26]">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[#4A5D54]">
                    <span className="text-lg">Shipping</span>
                    <span className="font-medium">Free</span>
                </div>
            </div>

            <div className="border-t border-secondary/10 pt-6 mb-8">
                <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-xl md:text-2xl text-[#1A2E26]">Total</span>
                    <span className="font-serif font-bold text-2xl md:text-3xl text-[#1A2E26]">₹{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-4">
                <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                >
                    <button className="w-full bg-[#2D5A42] hover:bg-[#234734] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98]">
                        Proceed to Checkout
                    </button>
                </a>

                <a href="/plants" className="block w-full text-center py-3 text-[#2D5A42] font-bold hover:underline">
                    Continue Shopping
                </a>
            </div>

            <div className="mt-10 pt-8 border-t border-secondary/10 grid grid-cols-2 gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#1A2E26] font-bold text-sm">
                        <Truck size={18} className="text-[#2D5A42]" />
                        <span>Free Shipping</span>
                    </div>
                    <p className="text-[10px] text-[#4A5D54]">On orders $50+</p>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#1A2E26] font-bold text-sm">
                        <Shield size={18} className="text-[#2D5A42]" />
                        <span>30-Day Guarantee</span>
                    </div>
                    <p className="text-[10px] text-[#4A5D54]">Healthy plant promise</p>
                </div>
            </div>
        </div>
    );
};
