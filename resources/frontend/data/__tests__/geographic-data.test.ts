import { brazilianStates, getStateCode, getStatesForSelect } from '../geographic-data';

describe('Geographic Data Utilities', () => {
    describe('brazilianStates', () => {
        it('contains all 27 Brazilian states', () => {
            expect(brazilianStates).toHaveLength(27);
        });

        it('contains common states', () => {
            const stateCodes = brazilianStates.map(s => s.code);
            expect(stateCodes).toContain('SP');
            expect(stateCodes).toContain('RJ');
            expect(stateCodes).toContain('MG');
            expect(stateCodes).toContain('RS');
        });

        it('each state has code and name', () => {
            brazilianStates.forEach(state => {
                expect(state).toHaveProperty('code');
                expect(state).toHaveProperty('name');
                expect(state.code).toBeTruthy();
                expect(state.name).toBeTruthy();
            });
        });
    });

    describe('getStateCode', () => {
        it('returns correct IBGE code for state code', () => {
            expect(getStateCode('SP')).toBe('35');
            expect(getStateCode('RJ')).toBe('33');
            expect(getStateCode('MG')).toBe('31');
        });

        it('returns null for invalid state code', () => {
            expect(getStateCode('XX')).toBeNull();
        });

        it('works with all state codes', () => {
            brazilianStates.forEach(state => {
                const code = getStateCode(state.code);
                expect(code).toBeTruthy();
                expect(typeof code).toBe('string');
            });
        });
    });

    describe('getStatesForSelect', () => {
        it('returns array of options with value and label', () => {
            const options = getStatesForSelect();
            expect(Array.isArray(options)).toBe(true);
            expect(options.length).toBeGreaterThan(0);
        });

        it('each option has value and label', () => {
            const options = getStatesForSelect();
            options.forEach(option => {
                expect(option).toHaveProperty('value');
                expect(option).toHaveProperty('label');
            });
        });

        it('values are state codes or empty', () => {
            const options = getStatesForSelect();
            const codes = brazilianStates.map(s => s.code);
            options.forEach(option => {
                if (option.value !== '') {
                    expect(codes).toContain(option.value);
                }
            });
        });
    });
});

