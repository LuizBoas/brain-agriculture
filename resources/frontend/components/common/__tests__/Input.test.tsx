import { render, screen, fireEvent } from '@testing-library/react';
import { InputPopUpAdmin } from '../field';

describe('InputPopUpAdmin Component', () => {
    it('renders input with label', () => {
        render(<InputPopUpAdmin label="Nome" value="" onChange={() => {}} />);
        expect(screen.getByText('Nome')).toBeInTheDocument();
    });

    it('displays input value', () => {
        render(<InputPopUpAdmin label="Nome" value="João Silva" onChange={() => {}} />);
        const input = screen.getByDisplayValue('João Silva');
        expect(input).toBeInTheDocument();
    });

    it('calls onChange when value changes', () => {
        const handleChange = jest.fn();
        render(<InputPopUpAdmin label="Nome" value="" onChange={handleChange} />);
        
        const input = screen.getByDisplayValue('');
        fireEvent.change(input, { target: { value: 'Teste' } });
        
        expect(handleChange).toHaveBeenCalled();
    });

    it('displays error message', () => {
        render(
            <InputPopUpAdmin
                label="Nome"
                value=""
                onChange={() => {}}
                errorMessage="Este campo é obrigatório"
            />
        );
        expect(screen.getByText('Este campo é obrigatório')).toBeInTheDocument();
    });

    it('displays placeholder', () => {
        render(
            <InputPopUpAdmin
                label="Nome"
                value=""
                onChange={() => {}}
                placeholder="Digite seu nome"
            />
        );
        expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
    });

    it('renders as textarea when multiline is true', () => {
        render(<InputPopUpAdmin label="Descrição" value="" onChange={() => {}} multiline />);
        const textarea = screen.getByDisplayValue('').closest('textarea');
        expect(textarea).toBeInTheDocument();
    });
});

