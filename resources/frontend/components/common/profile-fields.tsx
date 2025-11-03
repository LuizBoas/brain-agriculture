import React, { useEffect, useState } from 'react';

import { getStatesForSelect } from '../../data/geographic-data';
import { InputPopUp } from './field';

// Componente de campo base
interface BaseFieldProps {
    label: string;
    children: React.ReactNode;
}

export const FormField: React.FC<BaseFieldProps> = ({ label, children }) => {
    return (
        <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            {children}
        </div>
    );
};

// Componente de campo de texto
interface TextInputProps {
    label: string;
    value: string;
    onChange: (e: any) => void;
    placeholder?: string;
    errorMessage?: string;
    multiline?: boolean;
    className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    errorMessage,
    multiline = false,
    className = ''
}) => {
    return (
        <FormField label={label}>
            <InputPopUp
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                errorMessage={errorMessage}
                multiline={multiline}
                className={`bg-slate-900 border-primary/30 text-white ${className}`}
            />
        </FormField>
    );
};

// Componente de campo de data
interface DateInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
}

export const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, errorMessage }) => {
    return (
        <FormField label={label}>
            <input
                type="date"
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 text-white bg-slate-900 border border-primary/30 rounded-md focus:outline-none focus:border-primary"
            />
            {errorMessage && <div className="text-xs text-red-500 mt-1">{errorMessage}</div>}
        </FormField>
    );
};

// Componente de campo de seleção
interface SelectInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    errorMessage?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, options, errorMessage }) => {
    return (
        <FormField label={label}>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 text-white bg-slate-900 border border-primary/30 rounded-md focus:outline-none focus:border-primary"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errorMessage && <div className="text-xs text-red-500 mt-1">{errorMessage}</div>}
        </FormField>
    );
};

// Componente para seleção de estado
interface StateSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    errorMessage?: string;
}

export const StateSelect: React.FC<StateSelectProps> = ({ label, value, onChange, errorMessage }) => {
    const estados = getStatesForSelect();

    return (
        <FormField label={label}>
            <select
                className="w-full px-4 py-3 text-white bg-slate-900 border border-primary/30 rounded-md focus:outline-none focus:border-primary"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {estados.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                        {estado.label}
                    </option>
                ))}
            </select>
            {errorMessage && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
        </FormField>
    );
};

// Componente para seleção de cidade usando constantes
interface CitySelectProps {
    label: string;
    state: string;
    value: string;
    onChange: (value: string) => void;
    errorMessage?: string;
}

export const CitySelect: React.FC<CitySelectProps> = ({ label, state, value, onChange, errorMessage }) => {
    const [cities, setCities] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (state) {
            // Como brazilianCities foi removido, vamos usar uma abordagem mais simples
            // O usuário pode digitar a cidade livremente
            setCities([]);
        } else {
            setCities([]);
        }
    }, [state]);

    const filteredCities = cities.filter((city) => city.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <FormField label={label}>
            <div className="relative">
                <input
                    type="text"
                    className="w-full px-4 py-3 text-white bg-slate-900 border border-primary/30 rounded-md focus:outline-none focus:border-primary"
                    placeholder={state ? 'Digite sua cidade' : 'Selecione um estado primeiro'}
                    value={value || searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    disabled={!state}
                />

                {showDropdown && filteredCities.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-primary/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredCities.slice(0, 10).map((city, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-primary/20 cursor-pointer text-white"
                                onClick={() => {
                                    onChange(city);
                                    setSearchTerm(city);
                                    setShowDropdown(false);
                                }}
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {errorMessage && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
        </FormField>
    );
};

// Componente para seleção de sexo
interface GenderSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    errorMessage?: string;
}

export const GenderSelect: React.FC<GenderSelectProps> = ({ label, value, onChange, errorMessage }) => {
    const genderOptions = [
        { value: '', label: 'Selecione' },
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Feminino' },
        { value: 'O', label: 'Outro' },
        { value: 'N', label: 'Prefiro não informar' }
    ];

    return (
        <FormField label={label}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 text-white bg-slate-900 border border-primary/30 rounded-md focus:outline-none focus:border-primary"
            >
                {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errorMessage && <div className="text-xs text-red-500 mt-1">{errorMessage}</div>}
        </FormField>
    );
};

// Componente para área de texto (biografia/hobbies)
interface TextAreaProps {
    label: string;
    value: string;
    onChange: (e: any) => void;
    placeholder?: string;
    errorMessage?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange, placeholder, errorMessage }) => {
    return (
        <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <InputPopUp
                placeholder={placeholder}
                multiline
                value={value}
                onChange={onChange}
                errorMessage={errorMessage}
                className="min-h-[120px] bg-slate-900 border-primary/30 text-white"
            />
        </div>
    );
};

// Aliases para compatibilidade com componentes anteriores
export const ProfileField = FormField;
export const ProfileInput = TextInput;
export const ProfileDateInput = DateInput;
export const ProfileSelect = SelectInput;
export const ProfileStateSelect = StateSelect;
export const ProfileCitySelect = CitySelect;
export const ProfileGenderSelect = GenderSelect;
export const ProfileTextArea = TextArea;
