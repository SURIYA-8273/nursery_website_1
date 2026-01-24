import { tokens } from './tokens';

export const semantic = {
    colors: {
        primary: {
            DEFAULT: tokens.colors.forestGreen[700],
            hover: tokens.colors.forestGreen[800],
            light: tokens.colors.forestGreen[100],
            foreground: tokens.colors.white,
        },
        secondary: {
            DEFAULT: tokens.colors.sage[500],
            hover: tokens.colors.sage[600],
            light: tokens.colors.sage[100],
            foreground: tokens.colors.white,
        },
        accent: {
            DEFAULT: tokens.colors.terra[500],
            foreground: tokens.colors.white,
        },
        background: {
            DEFAULT: tokens.colors.cream,
            paper: tokens.colors.white,
            subtle: tokens.colors.sand[50],
        },
        text: {
            primary: tokens.colors.forestGreen[900],
            secondary: tokens.colors.sage[800],
            muted: tokens.colors.sage[400],
            inverse: tokens.colors.white,
        },
        status: {
            error: '#EF4444',
            success: tokens.colors.forestGreen[500],
            warning: '#F59E0B',
            info: tokens.colors.sage[500],
        },
        border: {
            DEFAULT: tokens.colors.sage[200],
            light: tokens.colors.sage[100],
        },
    },
} as const;
