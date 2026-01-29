export interface BusinessSettings {
    id: string; // usually '1' or singleton
    businessName: string;
    logoUrl?: string;
    instagramUrl?: string;
    mobileNumber?: string;
    address?: string;
    updatedAt: Date;
}
