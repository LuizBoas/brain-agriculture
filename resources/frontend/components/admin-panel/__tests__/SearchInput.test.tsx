import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '../search-input';

describe('SearchInput Component', () => {
    it('renders search input', () => {
        render(<SearchInput value="" onChange={() => {}} placeholder="Buscar..." />);
        expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
    });

    it('displays value', () => {
        render(<SearchInput value="test search" onChange={() => {}} />);
        expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
        const handleChange = jest.fn();
        render(<SearchInput value="" onChange={handleChange} />);
        
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'search term' } });
        
        expect(handleChange).toHaveBeenCalled();
    });

    it('has correct input type', () => {
        render(<SearchInput value="" onChange={() => {}} placeholder="Buscar..." />);
        const input = screen.getByPlaceholderText('Buscar...');
        expect(input).toHaveAttribute('type', 'text');
    });
});

