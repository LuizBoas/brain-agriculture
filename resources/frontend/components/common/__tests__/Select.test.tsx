import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Select } from '../form-fields';

describe('Select Component', () => {
    const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
    ];

    it('renders select with label', () => {
        render(<Select label="Test Select" value="" onChange={() => {}} options={options} />);
        expect(screen.getByText('Test Select')).toBeInTheDocument();
    });

    it('displays selected value label', () => {
        render(<Select label="Test" value="2" onChange={() => {}} options={options} />);
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('opens dropdown when clicked', async () => {
        render(<Select label="Test" value="" onChange={() => {}} options={options} />);
        
        const selectButton = screen.getByText('Selecione').closest('div');
        if (selectButton) {
            fireEvent.click(selectButton);
            
            await waitFor(() => {
                expect(screen.getByText('Option 1')).toBeInTheDocument();
            });
        }
    });

    it('calls onChange when option is selected', async () => {
        const handleChange = jest.fn();
        render(<Select label="Test" value="" onChange={handleChange} options={options} />);
        
        const selectButton = screen.getByText('Selecione').closest('div');
        if (selectButton) {
            fireEvent.click(selectButton);
            
            await waitFor(() => {
                const option2 = screen.getByText('Option 2');
                fireEvent.click(option2);
                expect(handleChange).toHaveBeenCalledWith('2');
            });
        }
    });

    it('displays error message', () => {
        render(
            <Select
                label="Test"
                value=""
                onChange={() => {}}
                options={options}
                errorMessage="Este campo é obrigatório"
            />
        );
        expect(screen.getByText('Este campo é obrigatório')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<Select label="Test" value="" onChange={() => {}} options={options} disabled />);
        const selectButton = screen.getByText('Selecione').closest('div');
        expect(selectButton).toHaveClass('opacity-70');
        expect(selectButton).toHaveClass('cursor-not-allowed');
    });
});

