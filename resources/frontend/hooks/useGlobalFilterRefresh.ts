import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export const useGlobalFilterRefresh = () => {
    const lastClasseId = useRef<string | null>(null);
    const isLocalChange = useRef<boolean>(false);

    useEffect(() => {
        // Inicializar com o valor atual da URL
        const urlParams = new URLSearchParams(window.location.search);
        const currentClasseId = urlParams.get('classe_id') || 'all';
        lastClasseId.current = currentClasseId;

        let broadcastChannel: BroadcastChannel | null = null;

        // Tentar usar BroadcastChannel API (funciona entre abas)
        try {
            broadcastChannel = new BroadcastChannel('classeFilter');
        } catch (error) {
            console.log('BroadcastChannel não suportado, usando localStorage');
        }

        const handleFilterChange = (newClasseId: string, source: 'local' | 'external') => {
            // Se a mudança veio da própria página, não recarregar
            if (source === 'local') {
                isLocalChange.current = true;
                lastClasseId.current = newClasseId;
                return;
            }

            // Se a mudança veio de outra página/aba
            if (source === 'external') {
                // Evitar recarregar se o valor não mudou
                if (lastClasseId.current === newClasseId) {
                    return;
                }

                lastClasseId.current = newClasseId;
                const currentPath = window.location.pathname;

                // Verificar se estamos em uma página que tem o filtro
                const pagesWithFilter = [
                    '/admin/dashboard',
                    '/admin/dashboard/user',
                    '/admin/dashboard/comment',
                    '/admin/dashboard/enrollment'
                ];

                if (pagesWithFilter.some((page) => currentPath.includes(page))) {
                    // Recarregar a página com o novo filtro
                    const url = new URL(window.location.href);
                    url.searchParams.set('classe_id', newClasseId);

                    // Usar router para navegação mais suave
                    router.visit(url.toString(), {
                        preserveState: false,
                        preserveScroll: false
                    });
                }
            }
        };

        // Escutar mudanças via BroadcastChannel
        if (broadcastChannel) {
            broadcastChannel.onmessage = (event) => {
                if (event.data.type === 'filterChanged') {
                    handleFilterChange(event.data.classeId, 'external');
                }
            };
        }

        // Escutar mudanças no localStorage (fallback)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'selectedClasseId' && event.newValue) {
                // Se não é uma mudança local, tratar como externa
                if (!isLocalChange.current) {
                    handleFilterChange(event.newValue, 'external');
                } else {
                    // Resetar flag de mudança local
                    isLocalChange.current = false;
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            if (broadcastChannel) {
                broadcastChannel.close();
            }
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Retornar função para marcar mudanças locais
    return {
        markLocalChange: () => {
            isLocalChange.current = true;
        }
    };
};
