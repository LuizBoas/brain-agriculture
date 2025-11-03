import { Button } from '@/components/common/button';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';

interface BackButtonProps {
    /** URL ou rota para onde voltar */
    href?: string;
    /** Função customizada para executar ao clicar (sobrescreve href) */
    onClick?: () => void;
    /** Posição do botão (padrão: absolute left-12 top-4) */
    className?: string;
    /** Tamanho do ícone (padrão: w-6 h-6) */
    iconSize?: string;
    /** Título para acessibilidade */
    title?: string;
}

export function BackButton({
    href,
    onClick,
    className = 'absolute left-12 top-4',
    iconSize = 'w-6 h-6',
    title = 'Voltar'
}: BackButtonProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (href) {
            if (href.startsWith('http') || href.startsWith('/')) {
                router.visit(href);
            } else {
                // Assume que é uma rota nomeada
                router.visit(route(href));
            }
        } else {
            // Fallback: voltar na história do navegador
            window.history.back();
        }
    };

    return (
        <div className={className}>
            <Button variant="outline" size="icon" className="rounded-full border-2" onClick={handleClick} title={title}>
                <Icon icon="bitcoin-icons:arrow-left-outline" className={iconSize} />
            </Button>
        </div>
    );
}
