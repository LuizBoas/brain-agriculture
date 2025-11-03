import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    itemsPerPage: number;
    handlePageChange: (page: number) => void;
    handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Pagination({
    currentPage,
    lastPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange
}: PaginationProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const perPageOptions = [10, 25, 50, 100];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center justify-between w-full gap-4 mt-4 text-gray-500 mb-3">
            {/* Dropdown de Itens por Página */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="flex items-center justify-between w-full gap-2 px-4 py-2 bg-white border border-gray-300 cursor-pointer rounded-xl hover:bg-gray-100"
                >
                    {itemsPerPage} por página
                    <Icon
                        icon="material-symbols:arrow-drop-down"
                        className={`w-5 h-5 transform transition-transform duration-300 ${
                            isDropdownOpen ? 'rotate-180' : 'rotate-270'
                        }`}
                    />
                </button>

                {isDropdownOpen && (
                    <div className="absolute left-0 z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md bottom-12">
                        {perPageOptions.map((option) => (
                            <div
                                key={option}
                                onClick={(e) => {
                                    handleItemsPerPageChange({
                                        target: { value: option.toString() }
                                    } as React.ChangeEvent<HTMLSelectElement>);
                                    closeDropdown();
                                }}
                                className={`flex items-center gap-4 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                    option === itemsPerPage ? 'bg-primary/20' : ''
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {/* Ícone do Iconify para o estado selecionado */}
                                    {option === itemsPerPage ? (
                                        <div className={`bg-primary rounded-md`}>
                                            <Icon icon="ri:check-fill" className="w-4 h-4 text-white" />
                                        </div>
                                    ) : (
                                        <span className="border-[2px] rounded-md border-gray-400 w-[15px] h-[15px]" />
                                    )}
                                    <span>{option} por página</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Controles de Página */}
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-xl">
                <div className="px-5 py-2">
                    <span className="text-gray-500 whitespace-nowrap ">
                        {currentPage} - {lastPage}
                    </span>
                </div>

                {/* Divisor */}
                <div className="self-stretch w-px h-11 bg-gray-300"></div>

                {/* Botão para página anterior */}
                <div className={`flex flex-row px-3 py-2 gap-2`}>
                    <div
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={`rounded-md cursor-pointer ${
                            currentPage === 1
                                ? 'cursor-not-allowed text-gray-300'
                                : 'bg-white hover:bg-primary/20 text-gray-500'
                        }`}
                    >
                        <Icon icon="lucide:chevron-left" width="23" height="23" />
                    </div>

                    {/* Botão para próxima página */}
                    <div
                        onClick={() => currentPage < lastPage && handlePageChange(currentPage + 1)}
                        className={` rounded-md cursor-pointer ${
                            currentPage === lastPage
                                ? 'cursor-not-allowed text-gray-300'
                                : 'bg-white hover:bg-primary/20 text-gray-500'
                        }`}
                    >
                        <Icon icon="lucide:chevron-right" width="23" height="23" />
                    </div>
                </div>
            </div>
        </div>
    );
}

Pagination.displayName = 'Pagination';

export { Pagination };
