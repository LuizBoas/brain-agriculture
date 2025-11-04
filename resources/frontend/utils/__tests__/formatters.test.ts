describe('Formatters Utilities', () => {
    describe('formatDocument', () => {
        const formatDocument = (document: string, type: string): string => {
            const cleaned = document.replace(/\D/g, '');
            if (type === 'CPF') {
                return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else {
                return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            }
        };

        it('formats CPF correctly', () => {
            expect(formatDocument('12345678909', 'CPF')).toBe('123.456.789-09');
            expect(formatDocument('12345678909', 'CPF')).not.toBe('12345678909');
        });

        it('formats CNPJ correctly', () => {
            expect(formatDocument('11222333000181', 'CNPJ')).toBe('11.222.333/0001-81');
        });

        it('removes non-numeric characters before formatting', () => {
            expect(formatDocument('123.456.789-09', 'CPF')).toBe('123.456.789-09');
            expect(formatDocument('11.222.333/0001-81', 'CNPJ')).toBe('11.222.333/0001-81');
        });
    });

    describe('formatArea', () => {
        const formatArea = (area: number): string => {
            return area.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        it('formats area with 2 decimal places', () => {
            expect(formatArea(1234.56)).toBe('1.234,56');
            expect(formatArea(100)).toBe('100,00');
        });

        it('handles zero correctly', () => {
            expect(formatArea(0)).toBe('0,00');
        });
    });
});

