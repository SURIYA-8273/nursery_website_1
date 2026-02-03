export interface GalleryImage {
    src: string;
    alt: string;
    // tag removed
    className?: string; // Optional, might be fixed by slot index
}

export interface BusinessSettings {
    id: string; // usually '1' or singleton
    businessName: string;
    logoUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    youtubeUrl?: string;

    mobileNumber?: string;
    secondaryNumber?: string;
    whatsappNumber?: string;
    email?: string;
    address?: string;
    mapUrl?: string; // Short link e.g. maps.app.goo.gl...
    mapEmbedUrl?: string; // Embed iframe src

    galleryImages?: GalleryImage[]; // Array of 6 images

    updatedAt: Date;
}
