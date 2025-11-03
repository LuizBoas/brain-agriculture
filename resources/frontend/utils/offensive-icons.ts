// Definição das propriedades de ícones de ofensiva
// Este arquivo centraliza toda a lógica de ícones e cores com base no nível de ofensiva (streak)

interface IconProperties {
    color: string;
    icon: string;
}

/**
 * Retorna as propriedades de ícone (cor e imagem) com base no nível de ofensiva
 *
 * @param streak - O número da ofensiva (streak) do usuário
 * @returns Objeto contendo a cor CSS e o caminho para o ícone
 */
export const getOffensiveIconProperties = (streak: number): IconProperties => {
    if (streak <= 2) {
        return {
            color: 'text-orange-100',
            icon: '/assets/icons/icons-ofensiva/fogo.svg'
        };
    }
    if (streak <= 5) {
        return {
            color: 'text-orange-400',
            icon: '/assets/icons/icons-ofensiva/fogo-2.svg'
        };
    }
    if (streak <= 15) {
        return {
            color: 'text-blue-500',
            icon: '/assets/icons/icons-ofensiva/fogo-3.svg'
        };
    }
    if (streak <= 30) {
        return {
            color: 'text-purple-500',
            icon: '/assets/icons/icons-ofensiva/fogo-4.svg'
        };
    }
    return {
        color: 'text-orange-500',
        icon: '/assets/icons/icons-ofensiva/fogo-5.svg'
    };
};

/**
 * Retorna classes CSS completas para o componente de ícone de ofensiva
 * Útil quando precisamos de configurações de estilo adicionais além da cor base
 *
 * @param streak - O número da ofensiva (streak) do usuário
 * @returns String com todas as classes CSS necessárias
 */
export const getOffensiveIconClasses = (streak: number): string => {
    const { color } = getOffensiveIconProperties(streak);
    return `flex items-center gap-[6px] ${color} font-bold`;
};
