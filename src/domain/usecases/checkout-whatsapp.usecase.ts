import { Cart } from '../entities/cart.entity';
import { Plant } from '../entities/plant.entity';

export class CheckoutViaWhatsAppUseCase {
    // Pure domain logic to format message, avoiding direct external service dependencies if possible,
    // or injecting a service interface if needed. For now, strictly formatting.

    execute(cart: Cart): string {
        const phoneNumber = '919876543210'; // Configurable
        if (cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        let message = "Hello! I would like to order the following plants:\n\n";

        cart.items.forEach((item) => {
            message += `- ${item.plant.name} (x${item.quantity}): ₹${item.plant.discountPrice || item.plant.price || 0}\n`;
        });

        message += `\nTotal: ₹${cart.totalPrice}`;

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    }
}
