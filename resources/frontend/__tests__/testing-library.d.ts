declare module '@testing-library/react' {
    export function render(ui: any, options?: any): any;
    export const screen: any;
    export const fireEvent: any;
    export const waitFor: any;
    export const within: any;
    export const queries: any;
    export * from '@testing-library/dom';
}

