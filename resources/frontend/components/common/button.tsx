import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/components/common/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-normal ring-offset-background transition-all duration-700 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:border-none hoverhive  rounded-xl transition-all duration-300 transform hover:scale-105',
    {
        variants: {
            variant: {
                default: 'bg-primary text-white hover:bg-primarydark ',
                outline: 'border border-primary/50 bg-transparent hover:bg-gray-100 text-black',
                gray: 'text-gray-500 bg-gray-200  hover:bg-gray-300 hover:text-gray-600',
                secondary: 'bg-secondary text-white hover:bg-secondary/80 border-[1px] border-primary/30',
                cancel: 'text-gray-500 bg-gray-200 hover:bg-gray-300 hover:text-red-500 border-[1px] border-gray-300',
                none: ''
            },
            size: {
                default: 'h-11 px-4 py-2',
                sm: 'h-10  px-3',
                lg: 'h-11  px-8',
                icon: 'h-10 w-10 ',
                none: ''
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    formAction?: any;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
