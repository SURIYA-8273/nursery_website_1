import { Category } from '../entities/plant.entity';

export interface ICategoryRepository {
    getCategories(): Promise<Category[]>;
    getCategoryById(id: string): Promise<Category | null>;
    createCategory(category: Omit<Category, 'id'>): Promise<Category>;
    updateCategory(id: string, category: Partial<Category>): Promise<Category>;
    deleteCategory(id: string): Promise<void>;
}
