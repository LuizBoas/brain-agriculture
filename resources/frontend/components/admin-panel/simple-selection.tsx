interface SelectInputProps<T, K extends keyof T, L extends keyof T> {
    items: T[];
    valueKey: K;
    labelKey: L;
    selectedValue?: T[K];
    placeholder?: string;
    onChange: (item: T) => void;
}

export function SelectInput<T extends Record<string, any>, K extends keyof T, L extends keyof T>({
    items,
    valueKey,
    labelKey,
    selectedValue,
    placeholder,
    onChange
}: SelectInputProps<T, K, L>) {
    return (
        <div className="relative">
            <select
                className="bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg w-full min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 appearance-none cursor-pointer pr-10"
                value={(selectedValue as any) ?? ''}
                onChange={(e) => {
                    const raw = e.target.value;
                    const selected = items.find((item) => String(item[valueKey]) === raw);
                    if (selected) {
                        onChange(selected);
                    }
                }}
            >
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}
                {items.map((item) => {
                    const val = item[valueKey];
                    const lbl = item[labelKey];
                    return (
                        <option key={String(val)} value={String(val)}>
                            {String(lbl)}
                        </option>
                    );
                })}
            </select>
            {/* Ícone de seta customizada */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
