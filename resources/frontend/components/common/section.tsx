import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    noBackground?: boolean;
    noPadding?: boolean;
    noBorder?: boolean;
    padding?: string;
    defaultBgColor?: boolean;
    isGradient?: boolean; // Nova propriedade para identificar telas de admin
}

export function Section({
    children,
    className,
    noPadding,
    padding = '',
    noBorder,
    noBackground,
    defaultBgColor,
    isGradient = false, // Por padrão, não é uma tela de admin
    ...props
}: SectionProps) {
    // Estilo de gradiente padrão
    const gradientStyle = {
        backgroundImage: 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        backgroundSize: '100% 100vh', // Limitando o gradiente aos primeiros 300px
        backgroundRepeat: 'no-repeat',
        '--tw-gradient-from': '#001224',
        '--tw-gradient-to': 'rgb(0 0 0)',
        '--tw-gradient-stops': 'var(--tw-gradient-from), rgb(2 6 23), var(--tw-gradient-to)'
    } as React.CSSProperties;

    return (
        <section
            {...props}
            className={`${!noBorder && 'border-b-[1px]'} ${!noBackground && `bg-background`}  
            min-h-[93vh] w-full ${!noPadding ? 'sm:py-18 py-5' : padding} ${className}`}
            style={isGradient ? { ...gradientStyle, ...props.style } : props.style}
        >
            {children}
        </section>
    );
}
