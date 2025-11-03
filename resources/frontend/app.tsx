import '../css/app.css';
import './bootstrap';

import { Providers } from '@/components/common/providers';
import { Ziggy } from '@/ziggy';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useRoute } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Brain Agriculture';

createInertiaApp({
    title: (title) => (title ? `${title} / ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        // @ts-expect-error
        window.route = useRoute(Ziggy as any);
        const appElement = (
            <Providers>
                <App {...props} />
            </Providers>
        );

        createRoot(el).render(appElement);
    },
    progress: false
});

