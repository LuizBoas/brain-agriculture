import { Icon } from '@iconify/react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useId, useRef, useState } from 'react';
import { NotificationTypes } from './config';
import Notification from './notification';

export type TimestampISO = string;

export interface NotificationBase<TData = unknown, TType extends string = string> {
    id: string;
    type: string;
    data: TData;
    read_at: TimestampISO | null;
    created_at: TimestampISO;
    updated_at: TimestampISO;
}

function classNames(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ');
}

export function ListNotification() {
    const { auth } = usePage().props as any;

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<NotificationBase[]>(auth.user.notifications ?? []);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const labelId = useId();

    // Função para buscar notificações usando Inertia (similar ao streak)
    const fetchNotifications = async () => {
        if (isLoading) return; // Evita múltiplas requisições simultâneas

        try {
            setIsLoading(true);

            // Usa Inertia para atualizar os dados do usuário (incluindo notificações)
            // Isso força o middleware HandleInertiaRequests a rodar e atualizar auth.user.notifications
            router.reload({
                only: ['auth']
            });
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Polling otimizado para buscar notificações a cada 10 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            // Só faz polling se a página estiver visível
            if (!document.hidden) {
                fetchNotifications();
            }
        }, 10000); // 10 segundos (menos frequente)

        // Listener para quando a página volta a ficar visível
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchNotifications();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (!open) return;
            const target = e.target as Node;
            if (
                panelRef.current &&
                !panelRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [open]);

    // Bloquear scroll da página quando notificação estiver aberta
    useEffect(() => {
        if (open) {
            // Salvar a posição atual do scroll
            const scrollY = window.scrollY;

            // Bloquear o scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                // Restaurar o scroll quando fechar
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [open]);

    // Sincroniza as notificações quando auth.user.notifications for atualizado
    useEffect(() => {
        if (auth.user.notifications) {
            console.log('🔄 Notificações sincronizadas via Inertia:', auth.user.notifications.length);
            setItems(auth.user.notifications);
        }
    }, [auth.user.notifications]);

    useEffect(() => {
        setUnreadCount(items.filter((item: NotificationBase) => item.read_at === null).length);
    });

    function markAllAsRead() {
        axios
            .post(route('notifications.mark_all_as_read'))
            .then((response) => {
                const now = new Date().toISOString();
                setItems((prev) => prev.map((item) => ({ ...item, read_at: now })));
            })
            .catch((error) => {
                console.error('Erro ao marcar notificação como concluida:', error);
            });
    }

    function markAsRead(id: string) {
        const now = new Date().toISOString();
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read_at: now } : item)));
    }

    function toTypeKey(t?: string): keyof typeof NotificationTypes {
        return t && t in NotificationTypes ? (t as keyof typeof NotificationTypes) : 'simple';
    }

    const firstInteractiveRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        if (open) {
            const t = setTimeout(() => firstInteractiveRef.current?.focus(), 0);
            return () => clearTimeout(t);
        }
    }, [open]);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={labelId}
                onClick={() => setOpen((o) => !o)}
                className={classNames(
                    'relative inline-flex items-center justify-center',
                    'h-10 w-10 rounded-lg',
                    'hover:bg-primary/10 dark:hover:bg-primary/20',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                    'transition-all duration-200 hover:scale-105'
                )}
            >
                <Icon
                    icon="mdi:bell-ring-outline"
                    className={`h-6 w-6 text-white hover:text-primary transition-colors duration-200 ${
                        isLoading ? 'animate-pulse' : ''
                    }`}
                />
                {unreadCount > 0 && (
                    <span
                        aria-label={`${unreadCount} notificações não lidas`}
                        className="absolute -top-1 -right-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-1.5 text-[13px] font-bold leading-5 text-white ring-2 ring-white dark:ring-gray-900 shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={labelId}
                    className={classNames(
                        'z-10',
                        'fixed inset-x-0 bottom-0 top-0 flex flex-col bg-primary/15 backdrop-blur-2xl md:absolute md:inset-auto',
                        'md:right-0 md:top-16 md:w-[520px] md:max-w-[calc(100vw-2rem)] md:rounded-2xl md:border md:border-primary/30 md:bg-secondary md:shadow-2xl md:backdrop-blur-2xl',
                        'md:max-h-96 transform transition-all duration-300 animate-in slide-in-from-top-2 fade-in-0 overflow-hidden'
                    )}
                >
                    <div className="border-b border-primary/20 p-6">
                        <div className="flex items-center justify-between ">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                                    <Icon icon="mdi:bell" className="h-4 w-4 text-white" />
                                </div>
                                <h2 id={labelId} className="text-lg font-bold text-white">
                                    Notificações
                                </h2>

                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-primary text-white px-2 py-0.5 text-xs font-medium">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    ref={firstInteractiveRef}
                                    onClick={markAllAsRead}
                                    className="hidden text-sm text-white/80 hover:text-white transition-colors md:flex items-center gap-1"
                                >
                                    <Icon icon="mdi:check-all" className="w-4 h-4" />
                                    Marcar todas como lidas
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                    aria-label="Fechar"
                                >
                                    <Icon icon="mdi:close" className="h-4 w-4 text-white/80" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-start">
                            <button
                                ref={firstInteractiveRef}
                                onClick={markAllAsRead}
                                className="mt-3 border-2 border-primary/20 p-2 rounded-lg md:hidden block text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <Icon icon="mdi:check-all" className="w-4 h-4" />
                                Marcar todas como lidas
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        {items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/70 p-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                                    <Icon icon="mdi:bell-off" className="h-8 w-8 text-white/60" />
                                </div>
                                <p className="text-sm font-medium text-white">Nenhuma notificação</p>
                                <p className="text-xs text-white/60">Você está em dia!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-primary/20">
                                {items.map((notification, index) => {
                                    return (
                                        <Notification
                                            key={index}
                                            data={notification}
                                            //@ts-ignore
                                            type={toTypeKey(notification.data.type as string)}
                                            onMarkAsRead={markAsRead}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-primary/20 p-4 text-center text-xs text-white/60">
                        <div className="flex items-center justify-center gap-2">
                            <Icon icon="mdi:clock-outline" className="w-3 h-3" />
                            Visualizando últimos 5 dias
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
