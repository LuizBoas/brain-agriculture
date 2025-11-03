import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react';

interface DynamicSelectionProps<T> {
    searchValue: string; // Valor do campo de pesquisa
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Callback para atualizar a pesquisa
    placeholder: string; // Placeholder do campo de pesquisa
    items: T[]; // Lista de itens disponíveis
    selectedItems: T[]; // Lista de itens já selecionados
    onItemSelect: (item: T) => void; // Callback ao selecionar um item
    onItemRemove: (item: T) => void; // Callback ao remover um item
    displayProperty: keyof T; // Propriedade do item usada para exibir o texto
    emptyMessage: string; // Mensagem quando não há itens
    addMessage: string; // Mensagem para o plano de fundo
    errors?: string; // Erros relacionados à seleção
}

export default function DynamicSelection<T>({
    searchValue,
    onSearchChange,
    placeholder,
    items,
    selectedItems,
    onItemSelect,
    onItemRemove,
    displayProperty,
    emptyMessage,
    addMessage,
    errors
}: DynamicSelectionProps<T>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controle de visibilidade do popup
    const dropdownRef = useRef<HTMLDivElement>(null); // Referência para o componente

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false); // Fecha o dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filtra os itens com base no valor do campo de busca
    const filteredItems = items.filter((item) =>
        String(item[displayProperty]).toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <section className="flex flex-col gap-2">
            <div className="relative" ref={dropdownRef}>
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => {
                            onSearchChange(e);
                            setIsDropdownOpen(true); // Abre o popup ao digitar
                        }}
                        onFocus={() => setIsDropdownOpen(true)} // Abre o popup ao focar
                        placeholder={placeholder}
                        className={`w-full p-2 border-[1px] ${
                            isDropdownOpen ? 'border-primary' : 'border-gray-300'
                        } focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-md text-black`}
                    />
                    {isDropdownOpen && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsDropdownOpen(false);
                            }}
                            className="absolute right-2 flex items-center justify-center text-gray-400 hover:text-gray-800"
                        >
                            <Icon icon="mdi:close" className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {isDropdownOpen && (
                    <div className="absolute left-0 z-10 w-full overflow-auto overflow-x-hidden bg-white border border-gray-300 rounded-md shadow-lg top-full max-h-[200px]">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => {
                                const isSelected = selectedItems.some(
                                    (selectedItem) => selectedItem[displayProperty] === item[displayProperty]
                                );
                                return (
                                    <div
                                        key={index}
                                        className={`py-2 px-3  hoverhive ${
                                            isSelected
                                                ? 'text-gray-400 bg-primary/10'
                                                : 'text-gray-500 hover:bg-primary/20 cursor-pointer select-none'
                                        }`}
                                        onClick={() => {
                                            if (!isSelected) {
                                                onItemSelect(item);
                                            }
                                            setIsDropdownOpen(false); // Fecha o popup após selecionar
                                        }}
                                    >
                                        {String(item[displayProperty])}{' '}
                                        {isSelected && <span className="text-sm text-gray-400">(já selecionado)</span>}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-2 text-gray-500">{emptyMessage}</div>
                        )}
                    </div>
                )}
            </div>
            <div className="relative p-3 border-2 border-primary/30 border-dashed rounded-lg min-h-48">
                <p className="absolute inset-0 flex items-center justify-center text-lg text-primary/80 opacity-50 pointer-events-none select-none">
                    {addMessage}
                </p>
                <ul className="flex flex-row flex-wrap gap-2">
                    {selectedItems.map((item, index) => (
                        <li
                            key={index}
                            className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-gray-800 border-2 rounded-full bg-primary/40 b border-primary backdrop-blur-md"
                        >
                            {String(item[displayProperty])}
                            <button
                                type="button"
                                onClick={() => onItemRemove(item)} // Não fecha o popup ao remover
                                className="flex items-center justify-center rounded-full"
                            >
                                <Icon icon="mdi:close" className="w-4 h-4 text-gray-800" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {errors && <p className="px-2 text-xs text-red-500">{errors}</p>}
        </section>
    );
}
