export const tokens = {
  colors: {
    // Nature-inspired Palette
    forestGreen: {
      50: '#f2fcf5',
      100: '#e1f8e8',
      200: '#c3efd2',
      300: '#95e1b3',
      400: '#5ecc8f',
      500: '#34b371',
      600: '#239158',
      700: '#1e7448', // Primary
      800: '#1b5c3b',
      900: '#174c32',
    },
    sage: {
      50: '#f4f7f4',
      100: '#e3ebe3',
      200: '#c5d6c5',
      300: '#9eb89e',
      400: '#799a79',
      500: '#5a7d5a', // Secondary
      600: '#466346',
      700: '#394f39',
      800: '#2f3f2f',
      900: '#273427',
    },
    sand: {
      50: '#fdfbf7', // Surface
      100: '#fbf7ef',
      200: '#f5ebd8',
      300: '#eddbb9',
      400: '#e3c693',
      500: '#dbad6e',
      600: '#cd9353',
      700: '#aa743f',
      800: '#8b5e38',
      900: '#714d31',
    },
    terra: {
      500: '#d97757', // Accent
    },
    cream: '#FAF9F6',
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
    // Standard scaling
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
    soft: '0 20px 40px -4px rgb(0 0 0 / 0.08)', // Premium soft shadow
  },
} as const;
