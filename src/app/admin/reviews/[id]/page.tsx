'use client';

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Button } from '@/presentation/components/admin/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ReviewForm } from '../form';
import { SupabaseGoogleReviewsRepository } from '@/data/repositories/supabase-google-reviews.repository';
import { GoogleReview } from '@/domain/entities/google-review.entity';

interface EditReviewPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditReviewPage({ params }: EditReviewPageProps) {
    const { id } = use(params);
    const [review, setReview] = useState<GoogleReview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const repo = new SupabaseGoogleReviewsRepository();
                const data = await repo.getReview(id);
                if (!data) {
                    notFound();
                }
                setReview(data);
            } catch (error) {
                console.error('Error fetching review:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!review) return null;

    return (
        <div className="max-w-2xl mx-auto md:p-6 lg:p-8">
            <div className="mb-6">
                <Button href="/admin/reviews" className="mb-4 bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Reviews
                </Button>
                <Heading1 title="Edit Review" description={`Editing review by ${review.name}`} />
            </div>

            <ReviewForm initialData={review} isEditing />
        </div>
    );
}
