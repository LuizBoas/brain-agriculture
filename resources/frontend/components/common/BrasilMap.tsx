import React, { useState, useMemo } from 'react';
import { brazilianStates } from '@/data/geographic-data';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

interface StateData {
    label: string; // Código do estado (ex: 'SP', 'MG')
    value: number; // Quantidade de fazendas
}

interface BrasilMapProps {
    data: StateData[];
    title?: string;
}

// URL do GeoJSON dos estados brasileiros
const GEO_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson';

export const BrasilMap: React.FC<BrasilMapProps> = ({ data, title = '' }) => {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const mapContainerRef = React.useRef<HTMLDivElement>(null);

    // Criar mapa de dados por código de estado
    const stateDataMap = useMemo(() => {
        const map = new Map<string, number>();
        data.forEach(item => {
            map.set(item.label, item.value);
        });
        return map;
    }, [data]);

    // Calcular valores para escala de cores
    const maxValue = useMemo(() => {
        return Math.max(...data.map(item => item.value), 1);
    }, [data]);

    // Função para obter cor baseada no valor
    const getStateColor = (value: number): string => {
        if (value === 0) return '#e5e7eb'; // Cinza claro para estados sem dados
        
        const intensity = Math.min(value / maxValue, 1);
        
        // Gradiente de indigo (mais claro para menos fazendas, mais escuro para mais fazendas)
        const baseColor = [99, 102, 241]; // Indigo base
        const lightColor = [224, 231, 255]; // Indigo muito claro
        
        const r = Math.round(baseColor[0] + (lightColor[0] - baseColor[0]) * (1 - intensity));
        const g = Math.round(baseColor[1] + (lightColor[1] - baseColor[1]) * (1 - intensity));
        const b = Math.round(baseColor[2] + (lightColor[2] - baseColor[2]) * (1 - intensity));
        
        return `rgb(${r}, ${g}, ${b})`;
    };

    // Função para obter nome completo do estado
    const getStateName = (code: string): string => {
        const state = brazilianStates.find(s => s.code === code);
        return state ? state.name : code;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (mapContainerRef.current) {
            const rect = mapContainerRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center">
            {title && (
                <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
            )}
            <div 
                ref={mapContainerRef}
                className="relative w-full h-[450px] flex items-center justify-center"
                onMouseMove={handleMouseMove}
            >
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        center: [-54, -15],
                        scale: 800
                    }}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Geographies geography={GEO_URL}>
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo: any) => {
                                    // O código do estado pode estar em diferentes propriedades do GeoJSON
                                    // Tentar diferentes formatos comuns
                                    const props = geo.properties;
                                    let stateCode = '';
                                    
                                    // Tentar diferentes formatos
                                    if (props.sigla) {
                                        stateCode = props.sigla.toUpperCase();
                                    } else if (props.id) {
                                        stateCode = props.id.toString().toUpperCase();
                                    } else if (props.name) {
                                        // Tentar extrair código do nome
                                        const name = props.name.toString();
                                        // Se o nome contém o código (ex: "São Paulo - SP")
                                        const match = name.match(/\b([A-Z]{2})\b/);
                                        if (match) {
                                            stateCode = match[1];
                                        } else {
                                            // Tentar mapear pelo nome completo
                                            const state = brazilianStates.find(s => 
                                                s.name.toLowerCase() === name.toLowerCase()
                                            );
                                            stateCode = state?.code || '';
                                        }
                                    }
                                    
                                    const value = stateCode ? (stateDataMap.get(stateCode) || 0) : 0;
                                    const isHovered = hoveredState === stateCode;
                                    
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={getStateColor(value)}
                                            stroke={isHovered ? '#6366f1' : '#ffffff'}
                                            strokeWidth={isHovered ? 2.5 : 1.5}
                                            style={{
                                                default: {
                                                    outline: 'none',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'pointer'
                                                },
                                                hover: {
                                                    fill: getStateColor(value),
                                                    outline: 'none',
                                                    filter: 'brightness(1.15) drop-shadow(0 0 4px rgba(99, 102, 241, 0.5))',
                                                    transition: 'all 0.2s ease'
                                                },
                                                pressed: {
                                                    outline: 'none'
                                                }
                                            }}
                                            onMouseEnter={() => stateCode && setHoveredState(stateCode)}
                                            onMouseLeave={() => setHoveredState(null)}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                </ComposableMap>
                
                {/* Tooltip */}
                {hoveredState && tooltipPosition.x > 0 && tooltipPosition.y > 0 && (
                    <div
                        className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-50 pointer-events-none whitespace-nowrap"
                        style={{
                            left: `${tooltipPosition.x + 15}px`,
                            top: `${tooltipPosition.y - 10}px`,
                            transform: 'translateY(-100%)',
                            maxWidth: '200px'
                        }}
                    >
                        <div className="font-semibold">{getStateName(hoveredState)}</div>
                        <div className="text-gray-300">
                            {stateDataMap.get(hoveredState) || 0} fazenda{(stateDataMap.get(hoveredState) || 0) !== 1 ? 's' : ''}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Legenda de cores */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-600 flex-wrap justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getStateColor(0) }}></div>
                    <span>Sem dados</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getStateColor(maxValue * 0.25) }}></div>
                    <span>Poucas</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getStateColor(maxValue * 0.5) }}></div>
                    <span>Médias</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getStateColor(maxValue) }}></div>
                    <span>Muitas</span>
                </div>
            </div>
        </div>
    );
};
