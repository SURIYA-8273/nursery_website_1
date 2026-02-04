'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleReview, GoogleReviewInput } from '@/domain/entities/google-review.entity';
import { SupabaseGoogleReviewsRepository } from '@/data/repositories/supabase-google-reviews.repository';
import { Button } from '@/presentation/components/admin/button';
import { Input } from '@/presentation/components/admin/form/input';
import { TextArea } from '@/presentation/components/admin/form/text_area';
import { Checkbox } from '@/presentation/components/admin/form/checkbox';
import { Loader2, Save } from 'lucide-react';

interface ReviewFormProps {
    initialData?: GoogleReview;
    isEditing?: boolean;
}

export function ReviewForm({ initialData, isEditing = false }: ReviewFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<GoogleReviewInput>({
        name: initialData?.name || '',
        timeline: initialData?.timeline || '',
        rating: initialData?.rating || 5,
        review: initialData?.review || '',
        isActive: initialData?.isActive ?? true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setFormData(prev => ({ ...prev, rating: isNaN(value) ? 0 : value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isActive: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const repo = new SupabaseGoogleReviewsRepository();
            if (isEditing && initialData) {
                await repo.updateReview(initialData.id, formData);
            } else {
                await repo.createReview(formData);
            }
            router.push('/admin/reviews');
            router.refresh();
        } catch (error) {
            console.error('Error saving review:', error);
            alert('Failed to save review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <Input
                    label="Reviewer Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Doe"
                />

                {/* Rating */}
                <Input
                    label="Rating (0-5)"
                    name="rating"
                    type="number"
                    value={formData.rating.toString()}
                    onChange={handleRatingChange}
                    required
                />

                {/* Timeline */}
                <Input
                    label="Timeline"
                    name="timeline"
                    type="date"
                    value={formData.timeline || ''}
                    onChange={handleChange}
                />

                {/* Review Content */}
                <TextArea
                    label="Review Content"
                    name="review"
                    value={formData.review || ''}
                    onChange={handleChange}
                    placeholder="Paste the review content here..."
                    rows={4}
                />

                {/* Active Status */}
                <div className="pt-2">
                    <Checkbox
                        label="Active Status (Enable to display publicly)"
                        name="isActive"
                        checked={!!formData.isActive}
                        onChange={handleCheckboxChange}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {isEditing ? 'Update Review' : 'Create Review'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
