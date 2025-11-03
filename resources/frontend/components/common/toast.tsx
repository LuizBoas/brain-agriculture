import { useTheme } from '@/components/common/theme-provider';
import { IconCheck } from 'justd-icons';
import { Info, AlertTriangle } from 'lucide-react';
import { Toaster as ToasterPrimitive, type ToasterProps } from 'sonner';
import { twJoin } from 'tailwind-merge';

// import { buttonStyles } from './button';
import { Loader } from './loader';

const Toast = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();
    return (
        <ToasterPrimitive
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            expand={true}
            visibleToasts={8}
            position="bottom-right"
            closeButton={true}
            richColors={true}
            duration={4000}
            icons={{
                info: <Info className="animate-pulse" />,
                success: <IconCheck className="animate-bounce-subtle" />,
                warning: <AlertTriangle className="animate-pulse" />,
                error: <AlertTriangle className="animate-pulse" />,
                loading: <Loader variant="spin" />
            }}
            toastOptions={{
                unstyled: true,
                closeButton: true,
                classNames: {
                    toast: twJoin(
                        'bg-bg/90 border-l-4 shadow-lg shadow-black/5 dark:shadow-white/5 ring-0 sm:min-w-[22rem] max-w-sm rounded-lg text-fg overflow-hidden text-[0.925rem] backdrop-blur-sm px-4 py-3 font-normal sm:px-5 sm:py-4',
                        'transform transition-all duration-300 hover:translate-x-1 hover:scale-[1.01]',
                        '[&:has([data-icon])_[data-content]]:ml-6',
                        '[&:has([data-button])_[data-close-button="true"]]:hidden',
                        '[&:not([data-description])_[data-title]]:font-medium',
                        '[&:has([data-description])_[data-title]]:!font-semibold [&:has([data-description])_[data-title]]:!text-lg',
                        '[&>[data-button]]:absolute [&>[data-button=true]]:bottom-4',
                        '[&>[data-action=true]]:right-4',
                        '[&>[data-cancel=true]]:left-4'
                    ),
                    icon: 'absolute top-[1rem] sm:top-[1.25rem] left-[0.75rem] text-lg',
                    content: '[&:not(:has(+button))]:pr-10 [&:has(+button)]:pb-10 md:[&:has(+button)]:pb-9',
                    error: 'bg-danger/5 dark:bg-danger/10 border-l-danger text-danger-fg dark:text-danger-50 [&>[data-close-button=true]>svg]:text-danger-fg dark:!text-danger-50 [&>[data-close-button=true]:hover]:bg-danger/10',
                    info: 'bg-info/5 dark:bg-info/10 border-l-info text-info-fg dark:text-info-50 [&>[data-close-button=true]>svg]:text-info-fg dark:!text-info-50 [&>[data-close-button=true]:hover]:bg-info/10',
                    warning:
                        'bg-warning/5 dark:bg-warning/10 border-l-warning text-warning-fg dark:text-warning-50 [&>[data-close-button=true]>svg]:text-warning-fg dark:!text-warning-50 [&>[data-close-button=true]:hover]:bg-warning/10',
                    success:
                        'bg-primary ring-primary/50 text-primary-fg ring-inset shadow-lg shadow-primary/20 [&>[data-close-button=true]>svg]:text-primary-fg [&>[data-close-button=true]:hover]:bg-primary-fg/20',
                    closeButton:
                        'p-1 size-7 absolute top-4 -right-1 left-auto flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors border-0 [&_svg]:size-4 [&_svg]:text-fg/80 hover:[&_svg]:text-fg'
                }
            }}
            {...props}
        />
    );
};

export { Toast };
