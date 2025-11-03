import { ToastMessage } from '@/components/common/toasts';
import { PropsWithChildren, ReactNode } from 'react';

interface GuestLayoutProps {
    header?: string | null;
    description?: string | ReactNode | null;
}

export function GuestLayout({ description = null, header = null, children }: PropsWithChildren<GuestLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col items-center sm:justify-center sm:pt-0 text-white">
            <ToastMessage />
            <div className="w-full min-h-screen">{children}</div>
        </div>
    );
}
