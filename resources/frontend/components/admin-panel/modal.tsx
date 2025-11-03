import { Icon } from '@iconify/react';
import { Button } from '../common/button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    onConfirm
}) => {
    if (!isOpen) return null; // Não renderiza se o modal não estiver aberto

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose(); // Fecha o modal ao clicar fora
            }}
        >
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative">
                {/* Ícone de Fechar (X) */}
                <button onClick={onClose} className="absolute top-3 right-3 text-lg text-gray-500 hover:text-gray-800">
                    <Icon icon="mdi:close" className="w-6 h-6" />
                </button>

                {/* Título do Modal */}
                <h2 className="mb-4 text-xl text-center text-gray-800">{title}</h2>

                {/* Mensagem do Modal */}
                <p className="mb-6 text-center text-gray-600">{message}</p>

                {/* Botões Dinâmicos */}
                <div className="flex flex-row justify-center gap-3">
                    <Button onClick={onClose}>{cancelLabel}</Button>
                    {onConfirm && <Button onClick={onConfirm}>{confirmLabel}</Button>}
                </div>
            </div>
        </div>
    );
};
