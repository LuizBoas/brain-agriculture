// Adiciona tipagem para o Vimeo Player
export interface VimeoTimeUpdateData {
    percent: number;
    seconds: number;
    duration: number;
}

export interface VimeoPlayer {
    on: (event: string, callback: (data: VimeoTimeUpdateData) => void) => void;
    off: (event: string, callback?: (data: VimeoTimeUpdateData) => void) => void;
}

// Evitamos declarar o tipo Window global para evitar conflitos
// Usamos tipagem direta onde necessário

/**
 * Carrega a API do Vimeo Player dinamicamente
 * @returns Promise que resolve com o objeto Vimeo global
 */
export const loadVimeoApi = (): Promise<any> => {
    return new Promise((resolve) => {
        if ((window as any).Vimeo) {
            resolve((window as any).Vimeo);
        } else {
            const script = document.createElement('script');
            script.src = 'https://player.vimeo.com/api/player.js';
            script.onload = () => resolve((window as any).Vimeo);
            document.body.appendChild(script);
        }
    });
};

/**
 * Configura o monitoramento de progresso do vídeo Vimeo
 * @param videoUrl URL do vídeo
 * @param requiredPercentage Porcentagem necessária para considerar o vídeo assistido (0-1)
 * @param onProgressReached Callback executado quando o progresso atinge a porcentagem necessária
 * @param onError Callback executado em caso de erro
 * @returns Função para limpar os listeners
 */
export const setupVimeoProgressMonitor = (
    videoUrl: string,
    requiredPercentage: number = 0.8,
    onProgressReached: () => void,
    onError: () => void
): (() => void) => {
    // Verifica se é um vídeo Vimeo
    if (!isVimeoVideo(videoUrl)) {
        onError();
        return () => {}; // Função vazia para limpeza
    }

    // Obtém o iframe do vídeo (primeiro iframe na página)
    const iframe = document.querySelector('iframe');
    if (!iframe) {
        onError();
        return () => {}; // Função vazia para limpeza
    }

    let vimeoPlayer: any = null;
    let hasReachedTarget = false;

    // Função para processar o evento de atualização de tempo
    const handleTimeUpdate = (data: VimeoTimeUpdateData) => {
        if (data.percent >= requiredPercentage && !hasReachedTarget) {
            hasReachedTarget = true;
            onProgressReached();
        }
    };

    // Inicializa a API e configura os event listeners
    // Adiciona listener para garantir que o iframe foi carregado
    const setupPlayer = () => {
        loadVimeoApi()
            .then((Vimeo) => {
                if (!Vimeo) throw new Error('Vimeo API não disponível');

                vimeoPlayer = new Vimeo.Player(iframe);
                vimeoPlayer.on('timeupdate', handleTimeUpdate);
            })
            .catch((error) => {
                console.error('Erro ao carregar a API do Vimeo:', error);
                onError();
            });
    };

    const iframeAlreadyLoaded = isIframeDocumentLoaded(iframe);

    // Espera o iframe carregar
    if (iframeAlreadyLoaded) {
        setupPlayer();
    } else {
        iframe.addEventListener('load', setupPlayer, { once: true });
    }

    // Retorna função para limpar os listeners
    return () => {
        if (vimeoPlayer) {
            try {
                vimeoPlayer.off('timeupdate', handleTimeUpdate);
            } catch (error) {
                console.error('Erro ao remover listener do Vimeo player:', error);
            }
        }
    };
};

const isIframeDocumentLoaded = (iframe: HTMLIFrameElement): boolean => {
    try {
        return iframe.contentWindow?.document?.readyState === 'complete';
    } catch {
        return false; // segurança contra cross-origin iframe
    }
};

/**
 * Verifica se um URL é de um vídeo do Vimeo
 * @param videoUrl URL do vídeo
 * @returns true se for um vídeo do Vimeo
 */
export const isVimeoVideo = (videoUrl?: string): boolean => {
    return !!videoUrl && videoUrl.includes('vimeo.com');
};
