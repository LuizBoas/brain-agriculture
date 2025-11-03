import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from './button';

interface NewFeaturePopupProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    icon?: string;
    features?: Array<{
        icon: string;
        text: string;
    }>;
    primaryButtonText?: string;
    primaryButtonAction?: () => void;
    primaryButtonRoute?: string;
    primaryButtonUrl?: string;
}

export function NewFeaturePopup({
    isVisible,
    onClose,
    title,
    description,
    icon,
    features,
    primaryButtonText,
    primaryButtonAction,
    primaryButtonRoute,
    primaryButtonUrl
}: NewFeaturePopupProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
        }
    }, [isVisible]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handlePrimaryAction = () => {
        handleClose();
        if (primaryButtonAction) {
            primaryButtonAction();
        } else if (primaryButtonRoute) {
            router.visit(route(primaryButtonRoute));
        } else if (primaryButtonUrl) {
            window.open(primaryButtonUrl, '_blank');
        }
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Overlay escuro */}
            <div
                className={`
                    fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] 
                    transition-opacity duration-300
                    ${isAnimating ? 'opacity-100' : 'opacity-0'}
                `}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`
                    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-[95%] max-w-sm md:max-w-md bg-secondary/95 border border-primary/30 
                    rounded-2xl shadow-2xl z-[10000] p-4 md:p-8
                    transition-all duration-300
                    ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                `}
            >
                {/* Ícone de fechar */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 md:top-6 right-4 md:right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Fechar popup"
                >
                    <Icon icon="mdi:close" className="w-4 h-4 md:w-5 md:h-5 text-white/70 hover:text-white" />
                </button>

                {/* Conteúdo */}
                <div className="text-center">
                    {/* Ícone animado com efeito de brilho */}
                    <div className="flex justify-center mb-4 md:mb-6">
                        <div className="relative">
                            <Icon
                                icon={icon || 'mdi:star'}
                                className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse relative z-10"
                            />
                            {/* Efeito de brilho pulsante */}
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                            {/* Efeito de brilho adicional */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20 rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Título com efeito de destaque */}
                    <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text animate-fadeIn">
                        {title}
                    </h2>

                    {/* Descrição */}
                    <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 leading-relaxed animate-fadeIn">
                        {description}
                    </p>

                    {/* Características com animação sequencial */}
                    {features && features.length > 0 && (
                        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-300 animate-fadeIn"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    <Icon
                                        icon={feature.icon}
                                        className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0"
                                    />
                                    <span>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Botão principal com efeito de destaque */}
                    <div className="flex justify-center">
                        <Button
                            onClick={handlePrimaryAction}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-105 animate-fadeIn w-full md:w-auto"
                        >
                            {primaryButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
