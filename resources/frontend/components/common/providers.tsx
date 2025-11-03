import { ThemeProvider } from '@/components/common/theme-provider';
import { router } from '@inertiajs/react';
import React from 'react';
import { RouterProvider } from 'react-aria-components';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <RouterProvider navigate={(to, options) => router.visit(to, options as any)}>
            <ThemeProvider>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff'
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#00C77B',
                                secondary: '#fff'
                            }
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ff4b4b',
                                secondary: '#fff'
                            }
                        }
                    }}
                />
            </ThemeProvider>
        </RouterProvider>
    );
}
