import { CartItem } from '@/domain/entities/cart.entity';
import { Plant, PlantVariant } from '@/domain/entities/plant.entity';
import { STRINGS } from '@/core/config/strings';

export class WhatsAppService {
    static generateCheckoutLink(phoneNumber: string, items: CartItem[]): string {
        if (items.length === 0 || !phoneNumber) return '';

        let message = STRINGS.WHATSAPP.ORDER_GREETING;
        let total = 0;

        items.forEach((item, index) => {
            let price = 0;
            let sizeLabel = '';

            if (item.selectedVariant) {
                // Cart snapshot has the final price stored in 'price'
                price = item.selectedVariant.price;
                sizeLabel = `(${item.selectedVariant.size})`;
            } else if (item.plant.variants && item.plant.variants.length > 0) {
                // Fallback to first variant
                const variant = item.plant.variants[0];
                price = variant.discountPrice || variant.price;
                sizeLabel = `(${variant.size})`;
            }

            const itemTotal = price * item.quantity;
            total += itemTotal;

            message += `${index + 1}. ${item.plant.name} ${sizeLabel} (x${item.quantity}) - ₹${itemTotal}\n`;
        });

        message += `${STRINGS.WHATSAPP.TOTAL_AMOUNT_PREFIX}${total}`;
        message += STRINGS.WHATSAPP.CONFIRM_ORDER;

        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }

    static generateBuyNowLink(phoneNumber: string, plant: Plant, variantId?: string, quantity: number = 1): string {
        if (!phoneNumber) return '';

        let price = 0;
        let sizeLabel = '';

        let variant: PlantVariant | undefined;

        if (variantId && plant.variants) {
            variant = plant.variants.find(v => v.id === variantId);
        }

        if (!variant && plant.variants && plant.variants.length > 0) {
            variant = plant.variants[0]; // Guaranteed
        }

        if (variant) {
            price = variant.discountPrice || variant.price;
            sizeLabel = `(${variant.size})`;
        } else {
            if (plant.variants && plant.variants.length > 0) {
                const v = plant.variants[0];
                price = v.discountPrice || v.price;
                sizeLabel = `(${v.size})`;
            }
        }

        const total = price * quantity;
        const message = `${STRINGS.WHATSAPP.BUY_NOW_GREETING}${STRINGS.WHATSAPP.NAME_LABEL}${plant.name} ${sizeLabel}\n${STRINGS.WHATSAPP.PRICE_LABEL}${price}\n${STRINGS.WHATSAPP.QUANTITY_LABEL}${quantity}\n${STRINGS.WHATSAPP.TOTAL_LABEL}${total}${STRINGS.WHATSAPP.CONFIRM_AVAILABILITY}`;

        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }

    static generateSupportLink(phoneNumber: string, message: string = STRINGS.WHATSAPP.SUPPORT_DEFAULT_MSG): string {
        if (!phoneNumber) return '';
        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }
}
