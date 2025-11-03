import React from 'react';

interface ToggleButtonProps {
    isEnabled: boolean;
    onToggle: (state: boolean) => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ isEnabled, onToggle }) => {
    const handleToggle = () => {
        onToggle(!isEnabled);
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            className={`relative w-14 h-8 flex items-center rounded-full focus:outline-none transition-colors ${
                isEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
        >
            <span
                className={`w-[26px] h-[26px] bg-white rounded-full shadow transform transition-transform ${
                    isEnabled ? 'translate-x-7' : 'translate-x-[3px]'
                }`}
            />
        </button>
    );
};
