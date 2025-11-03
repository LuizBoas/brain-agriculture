import { ToastData } from '@/types/index';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Toast } from './toast';

export function ToastMessage() {
    const { toasts } = usePage<{ toasts: ToastData[] }>().props;
    useEffect(() => {
        for (const t of toasts) {
            if (t && t.message) {
                (toast as any)[t.type](t.message);
            }
        }
    }, [toasts]);
    return <Toast />;
}
