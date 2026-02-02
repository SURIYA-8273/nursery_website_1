import { CartItem } from '@/domain/entities/cart.entity';
import { Plant } from '@/domain/entities/plant.entity';

export class WhatsAppService {
    private static readonly PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

    static generateCheckoutLink(items: CartItem[]): string {
        if (items.length === 0) return '';

        let message = 'Hello, I would like to place an order: \n\n';
        let total = 0;

        items.forEach((item, index) => {
            const price = item.plant.discountPrice || item.plant.price || 0;
            const itemTotal = price * item.quantity;
            total += itemTotal;

            message += `${index + 1}. ${item.plant.name} (x${item.quantity}) - ₹${itemTotal}\n`;
        });

        message += `\nTotal Amount: ₹${total}`;
        message += '\n\nPlease confirm availability and payment details.';

        // Encode for URL
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${this.PHONE_NUMBER}?text=${encodedMessage}`;
    }

    static generateBuyNowLink(plant: Plant, quantity: number = 1): string {
        const price = plant.discountPrice || plant.price || 0;
        const total = price * quantity;

        const message = `Hello, I want to buy this plant 🌱\n\nName: ${plant.name}\nPrice: ₹${price}\nQuantity: ${quantity}\nTotal: ₹${total}`;

        return `https://wa.me/${this.PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    }

    static generateSupportLink(message: string = 'Hello, I need some help with...'): string {
        return `https://wa.me/${this.PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    }
}
