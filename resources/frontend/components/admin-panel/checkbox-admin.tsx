import { Icon } from '@iconify/react';

type CheckboxProps = {
    label?: string; // Label única (comportamento legado)
    checkedLabel?: string; // Label quando checkbox está marcado
    uncheckedLabel?: string; // Label quando checkbox está desmarcado
    checked: boolean;
    onChange: () => void;
    value?: string | number;
    noBackground?: boolean;
};

export const CheckboxAdmin = ({
    noBackground,
    label,
    checkedLabel,
    uncheckedLabel,
    checked,
    onChange,
    value
}: CheckboxProps) => {
    // Determina qual label mostrar
    const displayLabel = label || (checked ? checkedLabel : uncheckedLabel);

    return (
        <label
            className={`flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md ${
                noBackground ? null : checked ? 'bg-blue-100' : 'bg-white'
            } ${noBackground ? null : 'hover:bg-blue-50'} transition duration-200`}
        >
            <div
                className={`w-5 h-5 flex items-center justify-center border rounded ${
                    checked ? 'border-primary bg-primary' : 'border-gray-400'
                }`}
            >
                {checked && <Icon icon="mdi:check" className="w-4 h-4 text-white" />}
            </div>
            {displayLabel && (
                <span className={`text-sm font-medium ${checked ? 'text-primary' : 'text-grayinput'}`}>
                    {displayLabel}
                </span>
            )}
            <input type="checkbox" checked={checked} onChange={onChange} value={value} className="hidden" />
        </label>
    );
};
