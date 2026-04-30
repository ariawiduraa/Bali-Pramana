import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
                playfair: ['DM Serif Display', 'Georgia', 'serif'],
                display: ['DM Serif Display', 'Georgia', 'serif'],
            },
            colors: {
                'pramana-primary': '#2d6a4f',
                'pramana-accent': '#e07a5f',
                'pramana-bg': '#f8f6f0',
                'pramana-dark': '#1a1a2e',
                'pramana-light': '#52b788',
                'pramana-cream': '#f0ebe3',
                'pramana-gold': '#e9c46a',
            },
            backgroundImage: {
                'gradient-hero': 'linear-gradient(135deg, #0a2416 0%, #1b4332 30%, #2d6a4f 60%, #40916c 100%)',
            },
            animation: {
                'float': 'float 3.5s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
                'fade-up': 'fadeUp 0.6s ease-out both',
                'scale-in': 'scaleIn 0.3s ease-out both',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.85', transform: 'scale(1.02)' },
                },
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'scale(0.95)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
            },
            boxShadow: {
                'pramana': '0 4px 24px rgba(45, 106, 79, 0.12)',
                'pramana-lg': '0 12px 48px rgba(45, 106, 79, 0.18)',
                'card': '0 2px 16px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02)',
                'card-hover': '0 20px 40px rgba(45, 106, 79, 0.12), 0 4px 12px rgba(0,0,0,0.06)',
                'glass': '0 8px 32px rgba(0,0,0,0.08)',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
        },
    },

    plugins: [forms],
};