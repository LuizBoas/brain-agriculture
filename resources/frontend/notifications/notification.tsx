import { cn } from '@/components/common/utils';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { NotificationTypes } from './config';
import { NotificationResolver } from './resolver';

interface NotificationProps {
    type?: keyof typeof NotificationTypes;
    data: any;
    onMarkAsRead: (id: string) => void;
}

export default function Notification(props: NotificationProps) {
    const markAsRead = () => {
        axios
            .post(route('notifications.mark_as_read', { id: props.data.id }))
            .then((response) => {
                props.onMarkAsRead(props.data.id);
            })
            .catch((error) => {
                console.error('Erro ao marcar notificação como concluida:', error);
            });
    };

    return (
        <div
            onClick={markAsRead}
            className={cn(
                props.data.read_at == null ? 'bg-secondary/40 hover:bg-secondary/50' : 'bg-white/5 hover:bg-white/10',
                'cursor-pointer transition-all duration-200 ease-in-out p-4 hover:scale-[1.01] border-b border-primary/10 last:border-b-0 overflow-hidden relative'
            )}
        >
            <div className="relative">
                {/* Tag NEW para notificações não lidas */}
                {props.data.read_at == null && (
                    <div className="absolute bottom-2 right-2 z-20">
                        <div className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                            <Icon icon="charm:tick" className="w-3 h-3" />
                            <span>Novo!</span>
                        </div>
                    </div>
                )}

                {/* Conteúdo da notificação */}
                <div className="flex grow">
                    <NotificationResolver
                        type={props.type}
                        data={{
                            ...props.data.data,
                            created_at: props.data.created_at
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
