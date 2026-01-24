import { ArrowRight } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Heading, Text } from '@/presentation/components/ui/typography';

interface CartSummaryProps {
    totalPrice: number;
    checkoutUrl: string;
}

export const CartSummary = ({ totalPrice, checkoutUrl }: CartSummaryProps) => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-soft sticky top-8 border border-secondary/10">
            <Heading level={2} className="text-2xl mb-6">Order Summary</Heading>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-text-secondary">
                    <Text>Subtotal</Text>
                    <Text>₹{totalPrice}</Text>
                </div>
                <div className="flex justify-between text-text-secondary">
                    <Text>Delivery</Text>
                    <Text className="text-green-600 font-medium">Free</Text>
                </div>
            </div>

            <div className="border-t border-dashed border-secondary/30 pt-4 mb-8">
                <div className="flex justify-between items-center text-xl font-bold text-text-primary">
                    <Text className="font-bold text-xl">Total</Text>
                    <Text className="font-bold text-xl">₹{totalPrice}</Text>
                </div>
            </div>

            <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
            >
                <Button size="lg" fullWidth className="gap-2">
                    Checkout via WhatsApp
                    <ArrowRight size={20} />
                </Button>
            </a>

            <Text variant="caption" className="text-center mt-4 block">
                You will be redirected to WhatsApp to confirm your order details.
            </Text>
        </div>
    );
};
