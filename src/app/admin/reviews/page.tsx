'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseGoogleReviewsRepository } from '@/data/repositories/supabase-google-reviews.repository';
import { GoogleReview } from '@/domain/entities/google-review.entity';
import { Plus, Edit3, Trash2, Search, Star } from 'lucide-react';
import { DataTable, TableHeader } from '@/presentation/components/admin/data-table';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Button } from '@/presentation/components/admin/button';
import { Input } from '@/presentation/components/admin/form/input';
import { ConfirmationDialog } from '@/presentation/components/admin/confirmation-dialog';

export default function AdminReviewsPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        const repo = new SupabaseGoogleReviewsRepository();
        const allReviews = await repo.getReviews();

        // Apply search filter
        let filtered = allReviews;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                r => r.name.toLowerCase().includes(query) ||
                    (r.review && r.review.toLowerCase().includes(query))
            );
        }

        setTotalItems(filtered.length);

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);

        setReviews(paginated);
        setLoading(false);
    }, [searchQuery, currentPage, pageSize]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const repo = new SupabaseGoogleReviewsRepository();
            await repo.deleteReview(deleteId);
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review');
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const headers: TableHeader[] = [
        { label: 'Name' },
        { label: 'Rating' },
        { label: 'Timeline' },
        { label: 'Content' },
        { label: 'Status' },
        { label: 'Actions' }
    ];

    const renderRow = (review: GoogleReview) => [
        { content: <span className="font-medium">{review.name}</span> },
        {
            content: (
                <div className="flex items-center gap-1">
                    <span>{review.rating}</span>
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                </div>
            )
        },
        { content: review.timeline || '-' },
        { content: <div className="max-w-xs truncate" title={review.review || ''}>{review.review || '-'}</div> },
        {
            content: (
                <span className={`px-2 py-1 rounded-full text-xs ${review.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {review.isActive ? 'Active' : 'Hidden'}
                </span>
            )
        },
        {
            actions: [
                {
                    label: 'Edit',
                    icon: <Edit3 size={18} />,
                    onClick: () => router.push(`/admin/reviews/${review.id}`)
                },
                {
                    label: 'Delete',
                    icon: <Trash2 size={18} />,
                    onClick: () => setDeleteId(review.id),
                    variant: 'danger' as const
                }
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto md:p-6 lg:p-8">
            <Heading1 title="Google Reviews" description="Manage customer reviews and ratings" />

            <Button href="/admin/reviews/new" className='w-full'>
                <Plus size={20} />
                Add Review
            </Button>

            <Input
                value={searchQuery}
                className='mt-4 mb-4'
                name="search"
                type='search'
                onChange={(e) => setSearchQuery(e.target.value)}
                leadingIcon={<Search size={20} />}
                placeholder="Search by name or content..."
            />

            <DataTable<GoogleReview>
                data={reviews}
                headers={headers}
                renderRow={renderRow}
                loading={loading}
                emptyMessage={searchQuery ? 'No reviews found matching your search.' : 'No reviews found.'}
                rowKey={(r) => r.id}
                minWidth="800px"
                pagination={{
                    currentPage,
                    totalPages: Math.ceil(totalItems / pageSize),
                    totalItems,
                    pageSize,
                    onPageChange: setCurrentPage,
                    onPageSizeChange: (size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                    }
                }}
            />

            <ConfirmationDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                isLoading={isDeleting}
            />
        </div>
    );
}
