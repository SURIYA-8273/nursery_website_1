import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { LocalCartRepository } from '@/data/repositories/local-cart.repository';
import { GetPlantsUseCase } from '@/domain/usecases/get-plants.usecase';
import { AddToCartUseCase } from '@/domain/usecases/add-to-cart.usecase';
import { CheckoutViaWhatsAppUseCase } from '@/domain/usecases/checkout-whatsapp.usecase';

// Singleton instances (lazy initialization could be better but this is fine for now)
const plantRepository = new SupabasePlantRepository();
const categoryRepository = new SupabaseCategoryRepository();
const cartRepository = new LocalCartRepository();

export const useServiceLocator = () => {
    return {
        getPlantsUseCase: new GetPlantsUseCase(plantRepository),
        addToCartUseCase: new AddToCartUseCase(cartRepository),
        checkoutViaWhatsAppUseCase: new CheckoutViaWhatsAppUseCase(),
        // Expose repositories directly if needed for simple reads, or wrap in use cases
        plantRepository,
        categoryRepository,
        cartRepository
    };
};
