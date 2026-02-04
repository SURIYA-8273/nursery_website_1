import { supabase } from '@/data/datasources/supabase.client';
import { GoogleReview, GoogleReviewInput } from '@/domain/entities/google-review.entity';

export class SupabaseGoogleReviewsRepository {
    private readonly TABLE_NAME = 'google_reviews';

    async getReviews(): Promise<GoogleReview[]> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map(this.mapToEntity);
    }

    async getReview(id: string): Promise<GoogleReview | null> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return this.mapToEntity(data);
    }

    async createReview(review: GoogleReviewInput): Promise<GoogleReview> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .insert({
                name: review.name,
                timeline: review.timeline,
                rating: review.rating,
                review: review.review,
                is_active: review.isActive ?? true
            })
            .select()
            .single();

        if (error) throw error;

        return this.mapToEntity(data);
    }

    async updateReview(id: string, review: GoogleReviewInput): Promise<GoogleReview> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .update({
                name: review.name,
                timeline: review.timeline,
                rating: review.rating,
                review: review.review,
                is_active: review.isActive
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return this.mapToEntity(data);
    }

    async deleteReview(id: string): Promise<void> {
        const { error } = await supabase
            .from(this.TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }


    async countReviews(): Promise<number> {
        const { count, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count || 0;
    }

    private mapToEntity(data: any): GoogleReview {
        return {
            id: data.id,
            name: data.name,
            timeline: data.timeline,
            rating: Number(data.rating),
            review: data.review,
            isActive: data.is_active,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
        };
    }
}
