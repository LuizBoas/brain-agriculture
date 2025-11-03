import { Frame } from '@/types';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import UserTooltipCard from './UserTooltipCard';

export interface StudentListUser {
    id: string;
    name: string;
    image: string;
    points: number;
    streaks: number;
    active_frame_id?: string | null;
    frame: Frame | null;
    badgesCount: number;
    activeOffensives: {
        id: string;
        name: string;
        days: number;
        icon: string;
    }[];
}

interface StudentListProps {
    users: StudentListUser[];
    locationName: string;
    locationType: 'country' | 'state' | 'city';
    onClose: () => void;
}

// Função para formatar o nome exibindo apenas os dois primeiros nomes
const formatDisplayName = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length <= 2) return fullName;
    return `${names[0]} ${names[1]}`;
};

// Row wrapper component that triggers the frame popup
const UserRowWithFramePopup: React.FC<{
    user: StudentListUser;
}> = ({ user }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [framePopupCoords, setFramePopupCoords] = useState<{ top: number; left: number; transform: string } | null>(
        null
    );
    const rowRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const portalRef = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // If tooltipImageUrl is undefined or null, don't show the popup
    const hasFrame = !!user?.frame;

    useEffect(() => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        portalRef.current = div;

        return () => {
            if (portalRef.current) {
                document.body.removeChild(portalRef.current);
            }
        };
    }, []);

    const calculateTooltipPosition = () => {
        if (!rowRef.current || !hasFrame) return;
        const rect = rowRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const estimatedTooltipHeight = 400;

        const position = spaceAbove < estimatedTooltipHeight ? 'bottom' : 'top';

        const coords =
            position === 'top'
                ? {
                      top: rect.top - 10,
                      left: rect.left + rect.width / 2,
                      transform: 'translate(-50%, -100%)'
                  }
                : {
                      top: rect.bottom + 10,
                      left: rect.left + rect.width / 2,
                      transform: 'translateX(-50%)'
                  };

        setFramePopupCoords(coords);
    };

    const handleMouseEnter = () => {
        if (!hasFrame) return;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        calculateTooltipPosition();
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        if (!hasFrame) return;

        timeoutRef.current = setTimeout(() => {
            setShowTooltip(false);
        }, 200);
    };

    const cancelHide = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const redirectToUserProfile = (userId: string) => {
        window.location.href = `/profile/${userId}`;
    };

    return (
        <>
            <div
                ref={rowRef}
                className="flex items-center justify-between px-5 py-3 transition-all duration-300 border shadow-xl hoverhive bg-gradient-to-br from-secondary/95 to-secondary70/10 backdrop-blur-md rounded-xl border-primary/30 hover:shadow-primary/20 cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => redirectToUserProfile(user.id)}
            >
                <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        {user.frame && (
                            <div
                                className="absolute inset-0 z-0"
                                style={{
                                    backgroundImage: `url(${user.frame.image})`,
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    width: '60px',
                                    height: '60px'
                                }}
                            />
                        )}
                        <img
                            src={user.image || '/assets/images/avatar-image-default.jpg'}
                            alt={formatDisplayName(user.name)}
                            className="relative z-10 object-cover rounded-md"
                            style={{
                                width: '45px',
                                height: '45px',
                                margin: '7.5px'
                            }}
                        />
                    </div>
                    <span className="text-sm font-medium text-white md:text-base">{formatDisplayName(user.name)}</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Ofensivas ativas */}
                    <div className="flex items-center gap-2">
                        {user.activeOffensives.map((offensive) => (
                            <div
                                key={offensive.id}
                                className="flex items-center gap-1 px-2 py-1 text-sm font-semibold bg-orange-500/20 text-orange-400 rounded-md"
                                title={`${offensive.name} - ${offensive.days} dias`}
                            >
                                <Icon icon="mdi:fire" className="w-4 h-4 text-orange-500" />
                                <span>{offensive.days}</span>
                            </div>
                        ))}
                    </div>
                    {/* Pontos */}
                    <span className="flex items-center font-bold text-yellow-300">
                        <Icon icon="ph:lightning-fill" className="mr-1" /> {user.points}
                    </span>
                </div>
            </div>

            {portalRef.current &&
                hasFrame &&
                showTooltip &&
                framePopupCoords &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        onMouseEnter={cancelHide}
                        onMouseLeave={handleMouseLeave}
                        className="fixed rounded-lg border shadow-xl backdrop-blur-md z-[9999] w-64 bg-secondary/95 border-primary/20"
                        style={{
                            top: framePopupCoords.top,
                            left: framePopupCoords.left,
                            transform: framePopupCoords.transform
                        }}
                    >
                        <UserTooltipCard
                            user={
                                {
                                    id: user.id,
                                    name: user.name,
                                    image: user.image || '/assets/images/avatar-image-default.jpg',
                                    points: Array(user.points || 0).fill({ points: 1 }),
                                    streak: Array(user.streaks || 0).fill({ streak_number: 1 }),
                                    badges: Array(user.badgesCount || 0).fill({}),
                                    currentFrame: user.frame
                                        ? {
                                              image: user.frame.image,
                                              title: user.frame.title,
                                              description: user.frame.description,
                                              primary_color: user.frame.primary_color
                                          }
                                        : undefined
                                } as any
                            }
                            position={1}
                        />
                    </div>,
                    portalRef.current
                )}
        </>
    );
};

export const StudentList: React.FC<StudentListProps> = ({ users, locationName, locationType, onClose }) => {
    // Ordenar usuários por pontos (maior para menor)
    const sortedUsers = [...users].sort((a, b) => b.points - a.points);

    if (users.length === 0) {
        return (
            <div className="text-center py-10 bg-gradient-to-br from-secondary/95 to-secondary70/10 backdrop-blur-md rounded-xl shadow-xl hover:shadow-primary/20 transition-all duration-300 max-w-2xl mx-auto">
                <div className="relative inline-block mb-6">
                    <Icon icon="mdi:map-marker-off-outline" className="w-20 h-20 mx-auto text-gray-400" />
                    <div className="absolute p-2 rounded-full -right-3 -bottom-3 bg-primary/20">
                        <Icon icon="mdi:information-outline" className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h3 className="mb-3 text-2xl font-medium text-white">Nenhum aluno encontrado</h3>
                <p className="mb-2 text-base text-gray-300">
                    Não encontramos alunos{' '}
                    {locationType === 'country'
                        ? 'neste país'
                        : locationType === 'state'
                          ? 'neste estado'
                          : 'nesta cidade'}
                    .
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-5 mb-5 relative">
            <div className="flex items-center gap-3 mb-6">
                <Icon
                    icon={
                        locationType === 'country'
                            ? 'mdi:earth'
                            : locationType === 'state'
                              ? 'mdi:map-legend'
                              : 'mdi:city'
                    }
                    className="w-8 h-8 text-primary"
                />
                <h2 className="text-2xl font-bold text-white">{locationName}</h2>
            </div>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 z-[10000] p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
                <Icon icon="mdi:close" className="w-4 h-4 text-white/70 hover:text-white" />
            </button>
            <div className="space-y-4">
                {sortedUsers.map((user) => (
                    <UserRowWithFramePopup key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
};
