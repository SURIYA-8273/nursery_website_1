'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/data/datasources/supabase.client';
import { APP_CONFIG } from '@/core/config/constants';
import { Lock, Mail, Loader2 } from 'lucide-react';

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
        <main className="min-h-screen flex items-center justify-center bg-surface p-4">
            <div className="bg-white p-8 rounded-3xl shadow-soft w-full max-w-md border border-secondary/10">
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 text-primary">
                        <Lock size={32} />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-primary">Admin Access</h1>
                    <p className="text-text-muted mt-2">Sign in to manage your plant inventory</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Enter Dashboard'}
                    </button>
                </form>
            </div>
        </main>
    );
}
