'use client';

import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Button } from '@/presentation/components/admin/button';
import { ArrowLeft } from 'lucide-react';
import { ReviewForm } from '../form';

export default function NewReviewPage() {
    return (
        <div className="max-w-2xl mx-auto md:p-6 lg:p-8">
            <div className="mb-6">
                <Button href="/admin/reviews" className="mb-4 bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Reviews
                </Button>
                <Heading1 title="Add New Review" description="Create a new Google review manually" />
            </div>

            <ReviewForm />
        </div>
    );
}
