import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { getStateCode } from '../../data/geographic-data';
import { InputPopUp } from './field';
import { cn } from './primitive';

interface BaseFieldProps {
    label: string;
    children: React.ReactNode;
}

export const FormField: React.FC<BaseFieldProps> = ({ label, children }) => {
    return (
        <div className="col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-300">{label}</label>
            {children}
        </div>
    );
};

interface TextInputProps {
    label: string;
    value: string;
    onChange: (e: any) => void;
    placeholder?: string;
    errorMessage?: string;
    multiline?: boolean;
    className?: string;
    rows?: number;
    required?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    errorMessage,
    multiline = false,
    className = '',
    rows = 5,
    required = false
}) => {
    return (
        <InputPopUp
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            errorMessage={errorMessage}
            multiline={multiline}
            className={cn(multiline && `min-h-[140px] resize-none`, className)}
            rows={multiline ? rows : undefined}
            required={required}
        />
    );
};

interface DateInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, errorMessage, className = '' }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleIconClick = () => {
        if (inputRef.current) {
            inputRef.current.showPicker();
        }
    };

    return (
        <div className="relative w-full">
            {label && (
                <label
                    className={cn(
                        'absolute left-3 z-10 text-sm transition-all pointer-events-none',
                        'px-1 text-xs top-[-8px] text-primary bg-slate-900',
                        'peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-primary'
                    )}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="date"
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={cn(
                        'peer w-full px-3 h-11 border rounded-md text-base text-white bg-slate-900 focus:outline-none',
                        'appearance-none',
                        errorMessage ? 'border-red-500' : 'border-primary/30',
                        'focus:border-primary focus:ring-2 focus:ring-primary/30',
                        'transition-all duration-200 ease-in-out',
                        '[&::-webkit-calendar-picker-indicator]{display:none !important; -webkit-appearance: none !important; appearance: none !important; opacity:0 !important; width:0 !important; height:0 !important; position:absolute !important; z-index:-1 !important;}',
                        '[&::-webkit-datetime-edit]{z-index:1;}',
                        '[&::-webkit-inner-spin-button]{-webkit-appearance: none !important; appearance: none !important; display:none !important;}',
                        '[&::-webkit-clear-button]{-webkit-appearance: none !important; appearance: none !important; display:none !important;}',

                        'pointer-events-[inherit]',
                        className
                    )}
                    style={{
                        colorScheme: 'dark',
                        background: '#0f172a',
                        color: '#ffffff',
                        caretColor: 'transparent',
                        backgroundImage: 'none !important',
                        position: 'relative',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none'
                    }}
                />
                {/* Ícone de calendário clicável */}
            </div>
            {errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};

interface SelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    errorMessage?: string;
    className?: string;
    hideDefaultWhenOpen?: boolean;
    disabled?: boolean;
    placeholder?: string;
    searchable?: boolean;
    variant?: 'dark' | 'light';
}

export const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    errorMessage,
    className = '',
    hideDefaultWhenOpen = false,
    disabled = false,
    placeholder = 'Selecione',
    searchable = true,
    variant = 'dark'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const selectedOption = options.find((option) => option.value === value);
        setSelectedLabel(selectedOption ? selectedOption.label : '');
    }, [value, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(
        (option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!hideDefaultWhenOpen || option.value !== '')
    );

    const hasEmptyOption = options.some((option) => option.value === '');
    const finalOptions = hasEmptyOption ? filteredOptions : [{ value: '', label: placeholder }, ...filteredOptions];

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleInputClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setTimeout(() => inputRef.current?.focus(), 100);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setSearchTerm(e.target.value);
        if (!isOpen) {
            setIsOpen(true);
        }
    };

    const handleOptionClick = (e: React.MouseEvent, optionValue: string) => {
        e.preventDefault();
        e.stopPropagation();
        handleSelect(optionValue);
    };

    return (
        <div className="relative w-full">
            {label && (
                <label
                    className={cn(
                        'absolute left-3 z-10 text-sm transition-all pointer-events-none',
                        'px-1 text-xs top-[-8px] text-primary',
                        variant === 'light' ? 'bg-white' : 'bg-slate-900',
                        'peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-primary'
                    )}
                >
                    {label}
                </label>
            )}
            <div className="relative" ref={dropdownRef}>
                {/* Campo de entrada */}
                <div
                    onClick={handleInputClick}
                    className={cn(
                        'peer w-full px-3 h-11 border rounded-md text-base focus:outline-none',
                        'cursor-pointer flex items-center justify-between',
                        variant === 'light' 
                            ? 'bg-white text-gray-700 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary' 
                            : 'text-white bg-slate-900 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/30',
                        errorMessage ? 'border-red-500' : '',
                        'transition-all duration-200 ease-in-out',
                        disabled && 'opacity-70 cursor-not-allowed',
                        className
                    )}
                >
                    {searchable && isOpen ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder="Digite para pesquisar..."
                            className={cn(
                                'flex-1 bg-transparent outline-none',
                                variant === 'light' ? 'text-gray-700 placeholder-gray-400' : 'text-white placeholder-gray-400'
                            )}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className={cn(
                            variant === 'light' 
                                ? selectedLabel ? 'text-gray-700' : 'text-gray-400'
                                : selectedLabel ? 'text-white' : 'text-gray-400'
                        )}>
                            {selectedLabel || placeholder}
                        </span>
                    )}

                    {/* Setinha */}
                    <svg
                        className={cn(
                            'w-5 h-5 transition-all duration-200 flex-shrink-0',
                            isOpen ? 'rotate-180 text-primary' : 'rotate-0 text-primary/70'
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div className={cn(
                        'absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto',
                        variant === 'light' 
                            ? 'bg-white border-gray-300' 
                            : 'bg-slate-900 border-primary/30'
                    )}>
                        {finalOptions.length > 0 ? (
                            finalOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={(e) => handleOptionClick(e, option.value)}
                                    className={cn(
                                        'px-3 py-2 cursor-pointer transition-colors',
                                        variant === 'light'
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-white hover:bg-primary/20',
                                        option.value === value && (variant === 'light' ? 'bg-gray-100' : 'bg-primary/30'),
                                        option.value === '' && 'text-gray-400'
                                    )}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-400 text-center">Nenhuma opção encontrada</div>
                        )}
                    </div>
                )}
            </div>
            {errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};

interface CitySelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    state: string;
    errorMessage?: string;
    className?: string;
    validateWithState?: boolean;
}

export const CitySelect: React.FC<CitySelectProps> = ({
    label,
    value,
    onChange,
    state,
    errorMessage,
    className = '',
    validateWithState = false
}) => {
    const [cities, setCities] = useState<{ id: string; nome: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [previousState, setPreviousState] = useState<string>(state);

    useEffect(() => {
        if (previousState !== state) {
            onChange('');
            setPreviousState(state);
        }
    }, [state, onChange, previousState]);

    useEffect(() => {
        if (!state) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            setLoading(true);
            try {
                const ibgeCode = getStateCode(state);

                if (!ibgeCode) {
                    setCities([]);
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ibgeCode}/municipios`
                );
                setCities(response.data);
            } catch (error) {
                setCities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, [state]);

    const validationError =
        validateWithState && state && !value ? 'Selecione uma cidade para o estado escolhido' : errorMessage;

    const cityOptions = loading
        ? [{ value: '', label: 'Carregando cidades...' }]
        : cities.map((city) => ({ value: city.nome, label: city.nome }));

    const finalOptions = [
        { value: '', label: state ? 'Selecione uma cidade' : 'Selecione um estado primeiro' },
        ...(loading ? [] : cityOptions)
    ];

    const displayValue = state ? value : '';

    return (
        <div className="relative">
            <Select
                label={label}
                value={displayValue}
                onChange={(newValue) => {
                    onChange(newValue);
                }}
                options={finalOptions}
                errorMessage={validationError}
                className={cn(validationError ? 'border-red-500' : '', className)}
                disabled={loading || !state}
                hideDefaultWhenOpen={true}
                placeholder={loading ? 'Carregando...' : 'Selecione uma cidade'}
                variant="light"
            />
            {loading && (
                <div className="flex absolute right-10 top-1/2 items-center transform -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full border-t-2 border-b-2 animate-spin border-primary"></div>
                </div>
            )}
        </div>
    );
};

export const Field = FormField;
export const Input = TextInput;
export const DtInput = DateInput;
export const Sel = Select;
export const CtSelect = CitySelect;
export const ProfileField = FormField;
export const ProfileInput = TextInput;
export const ProfileDateInput = DateInput;
export const ProfileSelect = Select;
export const ProfileCitySelect = CitySelect;
export const ProfileTextArea = (props: any) => <TextInput multiline rows={5} {...props} />;
