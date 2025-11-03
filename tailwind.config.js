/** @type {import('tailwindcss').Config} */
import { withTV } from 'tailwind-variants/transformer';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = withTV({
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/frontend/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...fontFamily.sans],
                poppins: ['Poppins', ...fontFamily.sans],
                raleway: ['Raleway', ...fontFamily.sans],
                oswald: ['Oswald', ...fontFamily.sans]
            },
            colors: {
                foreground: '#001224',
                background: '#000000',

                primary: '#31c0fc',
                primarydark: '#2490C5',
                primarysuperdark: '#1E78A3',
                secondary: '#001224',
                secondary70: '#000d19',
                terciary: '#191919',
                terciary60: '#101219',
                terciary70: '#121212',

                grayinput: '#6b7280',

                light: 'hsl(var(--light))',
                dark: 'hsl(var(--dark))',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                toggle: 'hsl(var(--toggle))',
                bg: 'hsl(var(--bg))',
                fg: 'hsl(var(--fg))',
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    fg: 'hsl(var(--success-fg))'
                },
                info: {
                    DEFAULT: 'hsl(var(--info))',
                    fg: 'hsl(var(--info-fg))'
                },
                danger: {
                    DEFAULT: 'hsl(var(--danger))',
                    fg: 'hsl(var(--danger-fg))'
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    fg: 'hsl(var(--warning-fg))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    fg: 'hsl(var(--muted-fg))'
                },
                overlay: {
                    DEFAULT: 'hsl(var(--overlay))',
                    fg: 'hsl(var(--overlay-fg))'
                }
            },
            keyframes: {
                'bounce-subtle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-2px)' }
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                }
            },
            animation: {
                'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
                fadeIn: 'fadeIn 0.5s ease-in-out forwards',
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            backgroundSize: {
                'size-200': '200% 200%'
            },
            backgroundPosition: {
                'pos-0': '0% 0%',
                'pos-100': '100% 100%'
            },
            plugins: [
                function ({ addVariant }) {
                    addVariant('placeholder-visible', '&[data-placeholder]::before');
                }
            ],
            borderRadius: {
                '3xl': 'calc(var(--radius) + 7.5px)',
                '2xl': 'calc(var(--radius) + 5px)',
                xl: 'calc(var(--radius) + 2.5px)',
                lg: 'calc(var(--radius))',
                md: 'calc(var(--radius) - 2.5px)',
                sm: 'calc(var(--radius) - 5px)'
            }
        }
    },
    plugins: [require('tailwindcss-animate'), require('tailwindcss-react-aria-components')]
});

export default config;


