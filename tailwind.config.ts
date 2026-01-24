import type { Config } from "tailwindcss";

// Inlining tokens to avoid build-time resolution issues
const tokens = {
    colors: {
        // Fresh Green Theme
        emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981', // Vibrant Primary
            600: '#059669', // Primary Hover / Darker
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
        },
        leaf: {
            50: '#f7fee7',
            100: '#ecfccb',
            200: '#d9f99d',
            300: '#bef264',
            400: '#a3e635',
            500: '#84cc16', // Lighter / Accent Green
            600: '#65a30d',
            700: '#4d7c0f',
            800: '#3f6212',
            900: '#365314',
        },
        natural: {
            50: '#f8fafc', // Very clean surface
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
        },
        cream: '#F9FAFB', // Cool white instead of warm sand
        white: '#FFFFFF',
        black: '#1A1A1A',
    },
    typography: {
        fontFamily: {
            serif: ['var(--font-playfair)', 'serif'],
            sans: ['var(--font-inter)', 'sans-serif'],
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeight: {
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
    },
    spacing: {
        0: '0px',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
        16: '4rem',
        24: '6rem',
        32: '8rem',
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        soft: '0 20px 40px -4px rgb(16 185 129 / 0.15)', // Green tinted shadow
    },
} as const;

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: tokens.colors.emerald[600], // Rich Emerald
                    light: tokens.colors.emerald[100],
                    hover: tokens.colors.emerald[700],
                    ...tokens.colors.emerald,
                },
                secondary: {
                    DEFAULT: tokens.colors.leaf[500], // Fresh Leaf green
                    ...tokens.colors.leaf,
                },
                surface: {
                    DEFAULT: tokens.colors.natural[50],
                    ...tokens.colors.natural,
                },
                accent: {
                    DEFAULT: tokens.colors.emerald[500],
                    ...tokens.colors.emerald,
                },
                cream: tokens.colors.cream,
            },
            fontFamily: tokens.typography.fontFamily,
            fontSize: tokens.typography.fontSize,
            fontWeight: tokens.typography.fontWeight,
            spacing: tokens.spacing,
            borderRadius: tokens.borderRadius,
            boxShadow: tokens.shadows,
        },
    },
    plugins: [],
};
export default config;
