import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react';

export interface ActionMenuItem {
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export interface ActionMenuProps {
    trigger: React.ReactNode;
    items: ActionMenuItem[];
    width?: string;
    className?: string;
    popupClassName?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
    trigger,
    items,
    width = 'w-56',
    className = '',
    popupClassName = 'right-0'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fechar menu quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = (item: ActionMenuItem) => {
        if (!item.disabled) {
            item.onClick();
            setIsOpen(false);
        }
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

            {isOpen && (
                <div
                    className={`absolute top-full mt-2 ${width} bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${popupClassName}`}
                >
                    <div className="py-2">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                disabled={item.disabled}
                                className={`
                                    flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 gap-3
                                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    ${item.className || ''}
                                `}
                            >
                                <Icon icon={item.icon} className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionMenu;
