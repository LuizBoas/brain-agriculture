'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/components/common/utils';

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
        max?: number;
        showPercentage?: boolean;
        variant?: 'default' | 'gradient';
        size?: 'xs' | 'sm' | 'md' | 'lg';
        percentagePosition?: 'inside' | 'right';
        showSegments?: boolean;
    }
>(
    (
        {
            className,
            value = 0,
            max = 100,
            showPercentage = true,
            variant = 'gradient',
            size = 'sm',
            percentagePosition = 'inside',
            showSegments = true,
            ...props
        },
        ref
    ) => {
        // Calcula a porcentagem baseada no máximo
        const percentage = Math.min(Math.round(((value ?? 0) / max) * 100), 100);

        // Determina o estilo do indicador com base na variante
        const getIndicatorClass = () => {
            if (variant === 'gradient') {
                return 'h-full transition-all duration-500 ease-in-out bg-gradient-to-r from-primary/80 via-primary to-primary/90 progress-pulse';
            }
            return 'h-full transition-all duration-500 ease-in-out bg-primary';
        };

        // Determina a partir de qual percentual exibir o texto
        const minPercentageForText = size === 'xs' ? 30 : size === 'sm' ? 20 : 15;

        return (
            <div className="relative flex items-center w-full">
                <div className={`relative w-full ${percentagePosition === 'inside' ? 'overflow-visible' : ''}`}>
                    <ProgressPrimitive.Root
                        ref={ref}
                        className={cn(
                            `relative h-[7px] w-full overflow-hidden rounded-full bg-gray-200/10`,
                            'border border-gray-200/5 shadow-inner',
                            className
                        )}
                        {...props}
                    >
                        <ProgressPrimitive.Indicator
                            className={cn(getIndicatorClass())}
                            style={{
                                width: `${percentage}%`
                            }}
                        />

                        {/* Efeito de brilho animado - apenas para a variante gradient */}
                        {variant === 'gradient' && (
                            <div
                                className="absolute inset-0 w-full h-full pointer-events-none opacity-80 shimmer-effect"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgb(0, 13, 25), transparent)'
                                }}
                            />
                        )}
                    </ProgressPrimitive.Root>

                    {/* Porcentagem dentro da barra */}
                    {/* {showPercentage && percentagePosition === 'inside' && (
                        <div
                            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                            ${size === 'xs' ? 'text-[8px]' : size === 'sm' ? 'text-[10px]' : 'text-xs'}
                            font-medium text-white tracking-wider z-10 flex items-center gap-0.5 text-shadow
                            ${percentage < minPercentageForText ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300
                            whitespace-nowrap`}
                        >
                            {percentage}
                            <span className="text-[80%]">%</span>
                        </div>
                    )} */}
                </div>
            </div>
        );
    }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
