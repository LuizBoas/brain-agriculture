import { Icon } from '@iconify/react';

interface SearchInputProps {
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, placeholder, onChange }: SearchInputProps) {
    return (
        <div className="relative w-full ">
            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-full min-h-12 p-2 pr-10 text-black rounded-2xl px-4 border border-gray-300 focus:border-primary focus:ring-primary focus:outline-none focus:ring-1"
            />
            {/* Ícone */}
            <Icon
                icon="lets-icons:search-alt-light"
                className="absolute w-6 h-6 text-gray-500 right-3 top-6 -translate-y-1/2 pointer-events-none"
            />
        </div>
    );
}

SearchInput.displayName = 'SearchInput';

export { SearchInput };
