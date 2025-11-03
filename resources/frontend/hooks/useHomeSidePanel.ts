import { useEffect, useState } from 'react';

export function useHomeSidePanel() {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Carregar estado do localStorage
        const savedState = localStorage.getItem('homeSidePanelVisible');
        if (savedState !== null) {
            setIsVisible(JSON.parse(savedState));
        }
        setIsLoading(false);
    }, []);

    const toggle = () => {
        const newState = !isVisible;
        setIsVisible(newState);
        localStorage.setItem('homeSidePanelVisible', JSON.stringify(newState));
    };

    const show = () => {
        setIsVisible(true);
        localStorage.setItem('homeSidePanelVisible', JSON.stringify(true));
    };

    const hide = () => {
        setIsVisible(false);
        localStorage.setItem('homeSidePanelVisible', JSON.stringify(false));
    };

    return {
        isVisible,
        isLoading,
        toggle,
        show,
        hide
    };
}
