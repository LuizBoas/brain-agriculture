import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ClasseFilterContextType {
    selectedClasseId: string;
    setSelectedClasseId: (classeId: string) => void;
    refreshData: () => void;
}

const ClasseFilterContext = createContext<ClasseFilterContextType | undefined>(undefined);

interface ClasseFilterProviderProps {
    children: ReactNode;
}

export const ClasseFilterProvider: React.FC<ClasseFilterProviderProps> = ({ children }) => {
    const [selectedClasseId, setSelectedClasseIdState] = useState<string>('all');

    // Carregar do localStorage na inicialização
    useEffect(() => {
        const savedClasseId = localStorage.getItem('selectedClasseId');
        if (savedClasseId && savedClasseId !== selectedClasseId) {
            setSelectedClasseIdState(savedClasseId);
        }
    }, []);

    // Salvar no localStorage quando mudar
    const setSelectedClasseId = (classeId: string) => {
        // Evitar atualizar se o valor não mudou
        if (selectedClasseId === classeId) {
            return;
        }

        setSelectedClasseIdState(classeId);
        localStorage.setItem('selectedClasseId', classeId);
    };

    // Função para forçar refresh dos dados
    const refreshData = () => {
        // Disparar um evento customizado que as páginas podem escutar
        window.dispatchEvent(
            new CustomEvent('classeFilterChanged', {
                detail: { selectedClasseId }
            })
        );
    };

    return (
        <ClasseFilterContext.Provider value={{ selectedClasseId, setSelectedClasseId, refreshData }}>
            {children}
        </ClasseFilterContext.Provider>
    );
};

export const useClasseFilter = () => {
    const context = useContext(ClasseFilterContext);
    if (context === undefined) {
        throw new Error('useClasseFilter must be used within a ClasseFilterProvider');
    }
    return context;
};
