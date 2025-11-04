declare module 'react-simple-maps' {
    import { ReactNode } from 'react';

    export interface Geography {
        rsmKey: string;
        properties: {
            [key: string]: any;
            sigla?: string;
            id?: string | number;
            name?: string;
        };
    }

    export interface GeographiesProps {
        geography: string | object;
        children: (props: { geographies: Geography[] }) => ReactNode;
    }

    export interface GeographyProps {
        geography: Geography;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        style?: {
            default?: React.CSSProperties;
            hover?: React.CSSProperties;
            pressed?: React.CSSProperties;
        };
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
    }

    export interface ComposableMapProps {
        projection?: string;
        projectionConfig?: {
            center?: [number, number];
            scale?: number;
        };
        style?: React.CSSProperties;
        children?: ReactNode;
    }

    export const ComposableMap: React.FC<ComposableMapProps>;
    export const Geographies: React.FC<GeographiesProps>;
    export const Geography: React.FC<GeographyProps>;
}

