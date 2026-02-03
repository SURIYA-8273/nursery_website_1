'use client';

import { useState, useEffect } from 'react';
import { Heading } from './heading';
import { Button } from '@/presentation/components/ui/button';
import { MapPin } from 'lucide-react';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';

export const MapSection = () => {
    const [mapUrl, setMapUrl] = useState<string | null>(null);
    const [mapEmbedUrl, setMapEmbedUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const repo = new SupabaseSettingsRepository();
            const settings = await repo.getSettings();
            if (settings) {
                setMapUrl(settings.mapUrl || null);
                setMapEmbedUrl(settings.mapEmbedUrl || null);
            }
        };
        fetchSettings();
    }, []);

    // Fallbacks
    const defaultEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15555.543594165565!2d79.1325!3d12.9165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b006f03f3e2df35%3A0x56be015a4ee2de72!2sPrasanth%20Nursery%20Garden%2C%20Melanilaivayal%2C%20Tamil%20Nadu%20622202!5e0!3m2!1sen!2sin!4v1700000000000";
    const defaultLink = "https://maps.app.goo.gl/YJNygrs16EQ2uaZM6";

    return (
        <section className="bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Heading title="Find Us" subtitle="Visit our nursery to see our collection in person." />

                <div className="mt-8 relative w-full h-[400px] rounded-[20px] overflow-hidden border border-primary/20 shadow-lg group">
                    <iframe
                        title="Location Map"
                        src={mapEmbedUrl || defaultEmbed}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="transition-all duration-700"
                    ></iframe>

                    <div className="absolute bottom-6 right-6">
                        <Button
                            onClick={() => window.open(mapUrl || defaultLink, "_blank")}
                            className="bg-white text-black hover:bg-gray-100 shadow-xl gap-2 rounded-full border border-black/5"
                        >
                            <MapPin size={18} className="text-[#D36E45]" />
                            Open in Google Maps
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
