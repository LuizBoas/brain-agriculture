import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/frontend/app.tsx',
            refresh: true
        }),
        react(),
        AutoImport({
            include: [/\.[tj]sx?$/],
            imports: [
                'react',
                {
                    '@iconify/react': ['Icon']
                }
            ],
            dts: true
        })
    ],
    resolve: {
        alias: {
            '@': resolve('resources/frontend'),
            ui: resolve('resources/frontend/components/ui/index.ts'),
            layouts: resolve('resources/frontend/layouts/index.ts'),
            components: resolve('resources/frontend/components'),
            'ziggy-js': resolve('vendor/tightenco/ziggy')
        }
    }
});
