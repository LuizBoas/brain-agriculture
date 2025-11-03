'use client';

import { Eye, EyeOff } from 'lucide-react'; // Ícones para o "olhinho"
import * as React from 'react';
import { cn } from './utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & { togglePassword?: boolean }>(
    ({ className, type, togglePassword = false, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className="relative">
                <input
                    type={togglePassword && showPassword ? 'text' : type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-secondary placeholder:text-muted-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        className,
                        togglePassword ? 'pr-10' : '' // Adiciona padding para o ícone
                    )}
                    ref={ref}
                    {...props}
                />
                {togglePassword && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 flex items-center text-gray-400 right-3 hover:text-white"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
