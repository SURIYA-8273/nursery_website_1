export interface GoogleReview {
    id: string;
    name: string;
    timeline: string | null;
    rating: number;
    review: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface GoogleReviewInput {
    name: string;
    timeline?: string;
    rating: number;
    review?: string;
    isActive?: boolean;
}
