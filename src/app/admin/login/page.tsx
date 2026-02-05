'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/data/datasources/supabase.client';
import { APP_CONFIG } from '@/core/config/constants';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { Input } from '@/presentation/components/admin/form/input';
import { Button } from '@/presentation/components/admin/button';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                router.push(APP_CONFIG.routes.admin.dashboard);
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-md shadow-sm w-full max-w-md border border-black/30">
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 bg-black/10 rounded-full mb-4 text-black">
                        <Lock size={32} />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-black">Admin Access</h1>
                    <p className="text-black mt-2">Sign in to manage your plant inventory</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <Input
                        name="email"
                        label="Email Address"
                        type="email"
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                        
                    </div>

                    <div>
                        <Input
                        name="password"
                        label="Password"
                        type="password"
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                        
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}


                    <Button
                        type="submit"
                        disabled={loading}
                        className='w-full'
                        isLoading={loading}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </main>
    );
}
