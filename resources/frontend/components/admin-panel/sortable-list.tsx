import { Icon } from '@iconify/react';
import React from 'react';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import { Button } from '../common/button';

interface SortableListProps<T extends ItemInterface> {
    list: T[];
    setList: (newList: T[]) => void;
    displayProperty: keyof T;
    className?: string;
    handleClassName?: string;
    renderExtraContent?: (item: T) => React.ReactNode;
}

export default function SortableList<T extends ItemInterface>({
    list,
    setList,
    displayProperty,
    className = 'flex flex-col gap-2 py-4',
    handleClassName = 'drag-handle',
    renderExtraContent
}: SortableListProps<T>) {
    // Log para depuração

    // Certificar que todos os itens possuem ID para o Sortable funcionar
    const itemsWithId = list.map((item, index) => {
        if (!item.id) {
            console.warn('Item sem ID encontrado no SortableList, criando ID temporário');
            return {
                ...item,
                id: `temp-id-${index}`
            };
        }
        // Garantir que o ID seja mantido e seja string para evitar problemas
        return {
            ...item,
            id: String(item.id)
        };
    });

    return (
        <ReactSortable list={itemsWithId} setList={setList} handle={`.${handleClassName}`} className={className}>
            {itemsWithId.map((item, index) => (
                <div
                    key={item.id || index}
                    className="flex items-center justify-between p-2 px-4 transition-opacity duration-200 ease-in-out bg-gray-100 border border-gray-300 select-none rounded-2xl"
                >
                    <div className="flex items-center gap-3">
                        <Button
                            size="icon"
                            variant="outline"
                            className={`drag-handle ${handleClassName} cursor-grab border-gray-300 hover:bg-transparent rounded-xl`}
                        >
                            <Icon icon="si:drag-indicator-fill" className="w-7 h-7 text-gray-400" />
                        </Button>
                        <span>{String(item[displayProperty] || `Item ${index + 1}`)}</span>
                    </div>
                    {renderExtraContent && <div className="flex items-center gap-2">{renderExtraContent(item)}</div>}
                </div>
            ))}
        </ReactSortable>
    );
}
