import { ICartRepository } from '../repositories/cart.repository';
import { CartItem } from '../entities/cart.entity';

export class AddToCartUseCase {
    constructor(private cartRepository: ICartRepository) { }

    async execute(item: CartItem): Promise<void> {
        // Validations can go here (e.g., check stock)
        if (item.quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        await this.cartRepository.addItem(item);
    }
}
