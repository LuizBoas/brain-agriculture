import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders button with different variants', () => {
        const { rerender } = render(<Button variant="default">Default</Button>);
        expect(screen.getByText('Default')).toBeInTheDocument();

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByText('Secondary')).toBeInTheDocument();

        rerender(<Button variant="cancel">Cancel</Button>);
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        
        screen.getByText('Click me').click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByText('Disabled')).toBeDisabled();
    });

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByText('Small')).toBeInTheDocument();

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByText('Large')).toBeInTheDocument();
    });
});

