import { Icon } from '@iconify/react';
import React from 'react';
import { Button } from '../common/button';

interface DynamicModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footerButtons?: React.ReactNode; // Botões no rodapé
    className?: string; // Classe CSS adicional para o modal
}

export const DynamicModal: React.FC<DynamicModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footerButtons,
    className
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className={`relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg ${className || ''}`}>
                {/* Título centralizado e botão de fechar */}
                <div className="relative flex justify-center items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <Button
                        variant="none"
                        size="icon"
                        className="absolute right-0 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <Icon icon="material-symbols:close" className="w-6 h-6" />
                    </Button>
                </div>

                {/* Conteúdo do modal com rolagem */}
                <div className="mb-6 max-h-[70vh]  overflow-y-auto overflow-x-hidden px-2 py-2">{children}</div>

                {/* Botões no rodapé */}
                <div className="flex justify-end gap-2">{footerButtons}</div>
            </div>
        </div>
    );
};
