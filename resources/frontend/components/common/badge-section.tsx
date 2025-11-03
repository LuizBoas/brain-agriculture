import { Icon } from '@iconify/react';

// CSS customizado para efeitos distópicos
const dystopianStyles = `
    @keyframes glitch {
        0% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        50% { transform: translateX(2px); }
        75% { transform: translateX(-1px); }
        100% { transform: translateX(0); }
    }
    
    @keyframes hologram {
        0% { opacity: 0.3; transform: translateY(0); }
        50% { opacity: 0.8; transform: translateY(-5px); }
        100% { opacity: 0.3; transform: translateY(0); }
    }
    
    @keyframes depth-pulse {
        0% { transform: translateZ(0) scale(1); }
        50% { transform: translateZ(10px) scale(1.05); }
        100% { transform: translateZ(0) scale(1); }
    }
    
    .dystopian-card {
        transform-style: preserve-3d;
        perspective: 1000px;
    }
    
    .dystopian-badge {
        transform-style: preserve-3d;
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform: rotate(-45deg);
    }
    
    .dystopian-badge:hover {
        transform: rotate(-45deg) translateZ(10px) scale(1.08);
    }
`;

interface Badge {
    id: string;
    title: string;
    description: string | null;
    image: string;
    active: boolean;
    reward_type: 'manual' | 'streak' | 'score';
    required_value: number | null;
    badge_points: number;
    shareable_image: string | null;
    order: number;
    created_at: string | null;
    updated_at: string | null;
}

interface BadgeSectionProps {
    title: string;
    icon: string;
    badges: Badge[];
    colors: {
        background: string;
        header: string;
        border: string;
        icon: string;
        card: string;
        cardBorder: string;
        hover: string;
        badge: string;
    };
    badgeIcon: string;
    badgeText: string;
    specialEffects?: 'green' | 'yellow' | 'blue' | 'red';
}

export const BadgeSection: React.FC<BadgeSectionProps> = ({
    title,
    icon,
    badges,
    colors,
    badgeIcon,
    badgeText,
    specialEffects
}) => {
    if (!badges || badges.length === 0) {
        return null;
    }

    return (
        <>
            <style>{dystopianStyles}</style>
            <div
                className={`bg-gradient-to-br ${colors.background} backdrop-blur-xl border ${colors.border} shadow-2xl rounded-2xl overflow-hidden`}
            >
                <div
                    className={`bg-gradient-to-r ${colors.header} backdrop-blur-sm border-b ${colors.border} px-6 md:py-4 py-2`}
                >
                    <div className="flex items-center gap-3">
                        <Icon icon={icon} className={`w-6 h-6 ${colors.icon}`} />
                        <h4 className="text-white font-bold text-base md:text-lg">{title}</h4>
                    </div>
                </div>
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {badges.map((badge) => (
                            <div
                                key={badge.id}
                                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-5 pt-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden dystopian-card"
                            >
                                {/* Efeito de borda gamer animada */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Efeito de canto gamer */}
                                <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-white/20 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-white/20 to-transparent rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Efeito de scan line gamer */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        animation: 'pulse 3s ease-in-out infinite'
                                    }}
                                ></div>

                                {/* Efeito de grid gamer */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        backgroundImage: `
                                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                                     `,
                                        backgroundSize: '20px 20px'
                                    }}
                                ></div>

                                {/* Efeito de distorção distópica */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `
                                         radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                         radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                         radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
                                     `,
                                        filter: 'blur(1px)'
                                    }}
                                ></div>

                                {/* Efeito de glitch */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background:
                                            'linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.1) 49%, rgba(255,255,255,0.1) 51%, transparent 52%)',
                                        backgroundSize: '10px 10px',
                                        animation: 'glitch 0.3s ease-in-out infinite alternate'
                                    }}
                                ></div>
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="relative">
                                        {/* Efeito de brilho animado baseado no tipo */}
                                        {specialEffects === 'green' && (
                                            <>
                                                <div
                                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 to-green-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                                                ></div>
                                                <div
                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.2s'
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.4s'
                                                    }}
                                                ></div>
                                            </>
                                        )}

                                        {specialEffects === 'yellow' && (
                                            <>
                                                <div
                                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 to-orange-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                                                ></div>
                                                <div
                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.2s'
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.4s'
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute top-1/2 -left-2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{ animationDelay: '0.6s' }}
                                                ></div>
                                            </>
                                        )}

                                        {specialEffects === 'blue' && (
                                            <>
                                                <div
                                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                                                ></div>
                                                <div
                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.2s'
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.4s'
                                                    }}
                                                ></div>
                                            </>
                                        )}

                                        {specialEffects === 'red' && (
                                            <>
                                                <div
                                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/30 to-red-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                                                ></div>
                                                <div
                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.2s'
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.4s'
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        animation: 'bounce 2s ease-in-out infinite',
                                                        animationDelay: '0.6s'
                                                    }}
                                                ></div>
                                            </>
                                        )}

                                        {/* Container do emblema com efeito distópico 3D */}
                                        <div
                                            className={`relative w-28 h-28 rotate-45 rounded-[18%] bg-gradient-to-br ${colors.card} flex items-center justify-center border-2 ${colors.cardBorder} group-hover:${colors.cardBorder.replace('/30', '/50')} group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500 transform-gpu ${
                                                specialEffects === 'green'
                                                    ? 'group-hover:shadow-green-500/25'
                                                    : specialEffects === 'yellow'
                                                      ? 'group-hover:shadow-yellow-500/25'
                                                      : specialEffects === 'blue'
                                                        ? 'group-hover:shadow-blue-500/25'
                                                        : specialEffects === 'red'
                                                          ? 'group-hover:shadow-red-500/25'
                                                          : 'group-hover:shadow-white/25'
                                            }`}
                                            style={{
                                                transformStyle: 'preserve-3d',
                                                perspective: '1000px'
                                            }}
                                        >
                                            {/* Efeito de anel gamer externo */}
                                            <div className="absolute inset-0 rounded-[18%] border-2 border-white/10 group-hover:border-white/30 transition-all duration-500 z-0"></div>

                                            {/* Efeito de anel gamer interno */}
                                            <div className="absolute inset-2 rounded-[18%] border border-white/5 group-hover:border-white/20 transition-all duration-500 z-0"></div>

                                            {/* Efeito de brilho radial gamer */}
                                            <div className="absolute inset-0 rounded-[18%] bg-gradient-radial from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                                            {/* Efeito de profundidade distópica */}
                                            <div
                                                className="relative w-32 h-32 z-10 transform-gpu transition-all duration-500 dystopian-badge"
                                                style={{
                                                    transformStyle: 'preserve-3d'
                                                }}
                                            >
                                                {/* Sombra de profundidade */}
                                                <div className="absolute inset-0 bg-black/20 rounded-[18%] blur-sm scale-110 group-hover:scale-125 transition-all duration-500 z-0"></div>

                                                {/* Efeito de distorção */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[18%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

                                                {/* Imagem com efeito 3D */}
                                                <img
                                                    src={badge.image}
                                                    alt={badge.title}
                                                    className="relative z-20 w-full h-full object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110"
                                                    style={{
                                                        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))',
                                                        transform: 'translateZ(0)'
                                                    }}
                                                />

                                                {/* Efeito de holograma */}
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[18%] z-0 pointer-events-none"
                                                    style={{
                                                        animation: 'hologram 2s ease-in-out infinite'
                                                    }}
                                                ></div>
                                            </div>

                                            {/* Efeito de brilho interno baseado no tipo */}
                                            <div
                                                className={`absolute inset-0 rounded-[18%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 ${
                                                    specialEffects === 'green'
                                                        ? 'bg-gradient-to-r from-green-400/20 to-green-500/20'
                                                        : specialEffects === 'yellow'
                                                          ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20'
                                                          : specialEffects === 'blue'
                                                            ? 'bg-gradient-to-r from-blue-400/20 to-purple-500/20'
                                                            : specialEffects === 'red'
                                                              ? 'bg-gradient-to-r from-red-400/20 to-red-500/20'
                                                              : 'bg-gradient-to-r from-white/10 to-white/20'
                                                }`}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        {/* Efeito de brilho no texto */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

                                        <h5
                                            className={`relative text-white font-bold text-sm group-hover:${colors.hover} transition-all duration-300 line-clamp-2 group-hover:drop-shadow-lg`}
                                            style={{
                                                textShadow: '0 0 10px rgba(255,255,255,0.3)',
                                                filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))'
                                            }}
                                        >
                                            {badge.title}
                                        </h5>
                                        {badge.description && (
                                            <p className="relative text-gray-300 text-xs mt-1 line-clamp-2 group-hover:text-white transition-colors duration-300">
                                                {badge.description}
                                            </p>
                                        )}
                                        {badge.badge_points > 0 && (
                                            <div
                                                className={`mt-2 inline-flex items-center gap-1 bg-gradient-to-r ${colors.badge} text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/20 group-hover:border-white/40 transition-all duration-300 group-hover:shadow-lg`}
                                                style={{
                                                    boxShadow: '0 0 15px rgba(255,255,255,0.1)',
                                                    textShadow: '0 0 5px rgba(0,0,0,0.5)'
                                                }}
                                            >
                                                {' '}
                                                <Icon
                                                    icon={'pixel:plus-solid'}
                                                    className="w-2 h-2 group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <span>{badge.badge_points} pontos</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
