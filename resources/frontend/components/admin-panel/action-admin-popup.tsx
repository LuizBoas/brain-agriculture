import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ActionAdminPopupProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    closeMenu: () => void;
    extraActions?: React.ReactNode; // Para ações adicionais personalizadas
    triggerRef?: React.RefObject<HTMLElement>; // Referência ao elemento que acionou o popup
}

export const ActionAdminPopup: React.FC<ActionAdminPopupProps> = ({
    onView,
    onEdit,
    onDelete,
    closeMenu,
    extraActions,
    triggerRef
}) => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Manipuladores de eventos para fechar o menu
    useEffect(() => {
        // Fecha ao clicar fora do menu
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        // Fecha ao fazer scroll
        const handleScroll = () => {
            closeMenu();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll, true); // true para capturar eventos em fase de captura

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [closeMenu]);

    // Efeito para calcular a posição do menu
    useEffect(() => {
        if (!mounted) return;

        // Determina qual elemento usar para posicionamento
        const referenceElement = triggerRef?.current || containerRef.current;

        if (referenceElement) {
            const rect = referenceElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Determina se o menu deve aparecer acima ou abaixo
            const shouldShowAbove = rect.bottom + 240 > viewportHeight;
            setPosition(shouldShowAbove ? 'top' : 'bottom');

            // Calcula a posição exata do menu
            setMenuPosition({
                top: shouldShowAbove ? rect.top - 30 : rect.bottom,
                left: rect.right - 120
            });
        }
    }, [mounted, triggerRef]);

    // Efeito para ajustar a posição se o menu sair da tela
    useEffect(() => {
        if (menuRef.current && mounted) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            // Ajusta se estiver saindo pela direita
            if (menuRect.right > viewportWidth) {
                setMenuPosition((prev) => ({
                    ...prev,
                    left: viewportWidth - menuRect.width - 10
                }));
            }
        }
    }, [menuPosition, mounted]);

    // Manipuladores para os botões com fechamento automático
    const handleView = () => {
        if (onView) {
            onView();
        }
        closeMenu();
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit();
        }
        closeMenu();
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }
        closeMenu();
    };

    // Função para envolver os extraActions com evento de fechamento
    const handleExtraActionClick = () => {
        closeMenu();
    };

    // Componente do menu que será renderizado no portal
    const menuContent = (
        <div
            ref={menuRef}
            className={`fixed z-[9000] ${position === 'top' ? 'translate-y-[-100%]' : 'translate-y-[0]'} 
            bg-white text-gray-600 rounded shadow-lg transition-transform duration-300 scale-100`}
            style={{
                top: menuPosition.top,
                left: menuPosition.left
            }}
        >
            {/* Extra Actions com wrapper para fechar menu ao clicar */}
            {extraActions && <div onClick={handleExtraActionClick}>{extraActions}</div>}

            {onView && (
                <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={handleView}>
                    <Icon icon="material-symbols:visibility-outline" className="w-5 h-5 mr-2" />
                    Ver Detalhes
                </div>
            )}
            {onEdit && (
                <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={handleEdit}>
                    <Icon icon="material-symbols:edit-outline" className="w-5 h-5 mr-2" />
                    Editar
                </div>
            )}
            {onDelete && (
                <div
                    className="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-100 hover:text-red-500"
                    onClick={handleDelete}
                >
                    <Icon icon="material-symbols:delete-outline" className="w-5 h-5 mr-2" />
                    Excluir
                </div>
            )}
        </div>
    );

    // Componente de referência para posicionar o menu
    return (
        <div className="relative" ref={containerRef}>
            {mounted && createPortal(menuContent, document.body)}
        </div>
    );
};
