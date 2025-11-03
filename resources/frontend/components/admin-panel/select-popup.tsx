import { Icon } from '@iconify/react';
import React, { useState } from 'react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
}

const SelectPopUp: React.FC<CustomSelectProps> = ({
    selectedValue,
    setSelectedValue,
    options,
    placeholder = 'Selecione uma opção',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border-[1px] border-gray-300 rounded-lg px-3 p-2 flex-row gap-2 text-gray-700 shadow-sm focus:ring-[1px] focus:ring-primary flex justify-between items-center"
            >
                <p>{selectedValue ? options.find((option) => option.value === selectedValue)?.label : placeholder}</p>
                <Icon
                    icon="mdi:chevron-down"
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>

            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-90 overflow-y-auto">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`p-2 cursor-pointer hover:bg-primary/10 text-gray-600 ${
                                selectedValue === option.value ? 'bg-blue-50 font-semibold' : ''
                            }`}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectPopUp;
