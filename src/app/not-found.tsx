import Link from 'next/link';
import { ArrowLeft, Home, Leaf } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">

                {/* Animated Icon */}
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-secondary/10 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-white w-32 h-32 rounded-full flex items-center justify-center shadow-soft border border-secondary/20">
                        <Leaf size={48} className="text-primary transform -rotate-[15deg] animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="font-serif text-6xl md:text-8xl font-bold text-primary">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                        Oops! This plant hasn't grown yet.
                    </h2>
                    <p className="text-text-secondary text-lg max-w-md mx-auto">
                        It looks like you've wandered off the garden path. The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-soft active:scale-95 transition-all text-sm md:text-base w-full sm:w-auto justify-center"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                    <Link
                        href="/plants"
                        className="flex items-center gap-2 bg-white text-text-primary border border-secondary/20 font-bold px-8 py-3 rounded-xl hover:border-primary hover:text-primary active:scale-95 transition-all text-sm md:text-base w-full sm:w-auto justify-center"
                    >
                        <Leaf size={18} />
                        Browse Plants
                    </Link>
                </div>

            </div>
        </div>
    );
}
