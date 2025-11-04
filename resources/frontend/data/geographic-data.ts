// Estados brasileiros
export const brazilianStates: Array<{ name: string; code: string; coordinates: [number, number] }> = [
    { name: 'Acre', code: 'AC', coordinates: [-8.77, -70.55] as [number, number] },
    { name: 'Alagoas', code: 'AL', coordinates: [-9.71, -35.73] as [number, number] },
    { name: 'Amapá', code: 'AP', coordinates: [0.9, -52.0] },
    { name: 'Amazonas', code: 'AM', coordinates: [-3.12, -60.02] },
    { name: 'Bahia', code: 'BA', coordinates: [-12.97, -38.5] },
    { name: 'Ceará', code: 'CE', coordinates: [-3.73, -38.53] },
    { name: 'Distrito Federal', code: 'DF', coordinates: [-15.79, -47.88] },
    { name: 'Espírito Santo', code: 'ES', coordinates: [-20.3, -40.3] },
    { name: 'Goiás', code: 'GO', coordinates: [-16.69, -49.27] },
    { name: 'Maranhão', code: 'MA', coordinates: [-2.53, -44.3] },
    { name: 'Minas Gerais', code: 'MG', coordinates: [-19.92, -43.93] },
    { name: 'Mato Grosso do Sul', code: 'MS', coordinates: [-20.45, -54.63] },
    { name: 'Mato Grosso', code: 'MT', coordinates: [-15.6, -56.1] },
    { name: 'Pará', code: 'PA', coordinates: [-1.46, -48.49] },
    { name: 'Paraíba', code: 'PB', coordinates: [-7.12, -34.86] },
    { name: 'Pernambuco', code: 'PE', coordinates: [-8.05, -34.88] },
    { name: 'Piauí', code: 'PI', coordinates: [-5.09, -42.8] },
    { name: 'Paraná', code: 'PR', coordinates: [-25.43, -49.27] },
    { name: 'Rio de Janeiro', code: 'RJ', coordinates: [-22.91, -43.17] },
    { name: 'Rio Grande do Norte', code: 'RN', coordinates: [-5.79, -35.21] },
    { name: 'Rondônia', code: 'RO', coordinates: [-8.76, -63.9] },
    { name: 'Roraima', code: 'RR', coordinates: [2.82, -60.68] },
    { name: 'Rio Grande do Sul', code: 'RS', coordinates: [-30.03, -51.23] },
    { name: 'Santa Catarina', code: 'SC', coordinates: [-27.6, -48.55] },
    { name: 'Sergipe', code: 'SE', coordinates: [-10.91, -37.07] },
    { name: 'São Paulo', code: 'SP', coordinates: [-23.55, -46.63] },
    { name: 'Tocantins', code: 'TO', coordinates: [-10.17, -48.33] }
];

// Função para buscar dados de um estado
export function getStateByCode(code: string): { name: string; code: string; coordinates: [number, number] } | null {
    return brazilianStates.find((state) => state.code === code) || null;
}

// Mapeamento de códigos de estados brasileiros (códigos IBGE)
export const stateCodeMap: Record<string, string> = {
    AC: '12', // Acre
    AL: '27', // Alagoas
    AP: '16', // Amapá
    AM: '13', // Amazonas
    BA: '29', // Bahia
    CE: '23', // Ceará
    DF: '53', // Distrito Federal
    ES: '32', // Espírito Santo
    GO: '52', // Goiás
    MA: '21', // Maranhão
    MG: '31', // Minas Gerais
    MS: '50', // Mato Grosso do Sul
    MT: '51', // Mato Grosso
    PA: '15', // Pará
    PB: '25', // Paraíba
    PE: '26', // Pernambuco
    PI: '22', // Piauí
    PR: '41', // Paraná
    RJ: '33', // Rio de Janeiro
    RN: '24', // Rio Grande do Norte
    RO: '11', // Rondônia
    RR: '14', // Roraima
    RS: '43', // Rio Grande do Sul
    SC: '42', // Santa Catarina
    SE: '28', // Sergipe
    SP: '35', // São Paulo
    TO: '17' // Tocantins
};

// Função para obter código IBGE do estado
export function getStateCode(stateCode: string): string | null {
    return stateCodeMap[stateCode] || null;
}

// Função para obter lista de estados formatada para selects
export function getStatesForSelect(): Array<{ value: string; label: string }> {
    return [
        { value: '', label: 'Selecione um estado' },
        ...brazilianStates.map((state) => ({
            value: state.code,
            label: state.name
        }))
    ];
}

