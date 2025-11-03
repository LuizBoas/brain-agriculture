import { Button } from '../common/button';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id?: string) => void;
    message: string;
    objectId?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, message, objectId }) => {
    if (!isOpen) return null; // Não renderiza se o modal não estiver aberto

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose(); // Fecha o modal ao clicar fora
            }}
        >
            <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
                <h2 className="mb-6 text-xl text-center text-gray-800">{message}</h2>
                <div className="flex flex-row justify-center gap-3">
                    <Button variant="cancel" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={() => (objectId ? onConfirm(objectId) : onConfirm())}>Confirmar</Button>
                </div>
            </div>
        </div>
    );
};
