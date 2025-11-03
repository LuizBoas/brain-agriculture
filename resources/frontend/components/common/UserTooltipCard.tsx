import { User } from '@/types';
import { getOffensiveIconProperties } from '@/utils/offensive-icons';

interface UserTooltipCardProps {
    user: User;
    position?: number;
    className?: string;
    onClick?: () => void;
}

function renderOffensiveIcon(streak: number) {
    const { color, icon } = getOffensiveIconProperties(streak);

    return (
        <div className="flex items-center gap-1 animate-pulse" title="Ofensivas">
            <img src={icon} className="w-6 h-6" />
            <p className={`text-2xl font-semibold ${color}`}>{streak}</p>
        </div>
    );
}

export default function UserTooltipCard({ user, position, className = '', onClick }: UserTooltipCardProps) {
    const frameImageUrl = user.profile?.activeFrame?.image || user.frames?.[0]?.image || (user as any).frame?.image;
    const currentFrameImage = (user as any).currentFrame?.image;
    const finalImageUrl = frameImageUrl || currentFrameImage;

    const redirectToUserProfile = (userId: string) => {
        if (onClick) {
            onClick();
        } else {
            window.location.href = `/profile/${userId}`;
        }
    };

    return (
        <div className={`relative flex flex-col items-center ${className}`}>
            <div
                className="relative flex justify-center items-center w-full rounded-lg border-2 shadow-2xl overflow-hidden h-96 cursor-pointer"
                style={{
                    borderColor: `${(user as any).currentFrame?.primary_color || '#3b82f6'}80`,
                    boxShadow: `0 0 20px ${(user as any).currentFrame?.primary_color || '#3b82f6'}30`
                }}
                onClick={() => redirectToUserProfile(user.id)}
            >
                {finalImageUrl && (
                    <img
                        src={finalImageUrl}
                        alt={user.profile?.activeFrame?.title || user.frames?.[0]?.title || 'Frame'}
                        className="absolute inset-0 object-cover w-full h-full"
                        style={{ zIndex: 1 }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                )}
                <div
                    className="absolute flex items-start justify-between px-3 py-2 text-2xl text-white rounded-lg shadow-md top-2 left-2 right-2"
                    style={{ zIndex: 10 }}
                >
                    <div className="flex flex-col gap-1">
                        {renderOffensiveIcon(
                            Number((user as any).streak_max_streak_number) ||
                                (user.streak && user.streak.length > 0
                                    ? Math.max(...user.streak.map((s) => Number(s.streak_number) || 0))
                                    : 0)
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <div
                            className="flex items-center self-end justify-end gap-1 mt-auto text-yellow-300 animate-pulse"
                            title="Sparks"
                        >
                            <img src="/assets/icons/bolt.svg" alt="Pontuação" className="w-6 h-6" />
                            <p className="font-semibold">{user.points?.length || 0}</p>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute flex flex-col items-center justify-center px-3 py-2 text-xl text-white rounded-lg shadow-md bottom-4 left-2 right-2"
                    style={{ zIndex: 10 }}
                >
                    <div className="flex flex-col justify-center mb-3 text-center select-none">
                        <span
                            className="font-bold tracking-tighter text-white transform scale-y-110 font-oswald"
                            style={{ textShadow: `0 0 4px #fff, 1px 1px 8px #000, 0 2px 16px #000` }}
                        >
                            {user.profile?.activeFrame?.title || user.frames?.[0]?.title || 'NÍVEL 1'}
                        </span>
                        <span
                            className="text-2xl font-bold tracking-tighter scale-y-110 text-white transform font-oswald"
                            style={{
                                textShadow: `0 2px 10px #000, 0 0 20px #000`,
                                color: (user as any).currentFrame?.primary_color || '#00ffff'
                            }}
                        >
                            {user.profile?.activeFrame?.description || user.frames?.[0]?.description || 'LÍDER'}
                        </span>
                    </div>

                    <span
                        className="text-2xl font-bold tracking-tighter text-white transform scale-y-110 font-oswald"
                        style={{ textShadow: `0 2px 10px #000, 0 0 20px #000` }}
                    >
                        {user.name?.trim().split(' ').slice(0, 2).join(' ').slice(0, 20)}
                    </span>
                </div>

                <div
                    className="relative w-40 h-40 -mt-20 border-2 rounded-full shadow cursor-pointer"
                    onClick={() => redirectToUserProfile(user.id)}
                    style={{
                        borderColor: `${(user as any).currentFrame?.primary_color || '#00ffff'}80`,
                        zIndex: 20,
                        boxShadow: `0 0 15px ${(user as any).currentFrame?.primary_color || '#00ffff'}40`
                    }}
                >
                    <img
                        src={user.image || '/assets/images/avatar-image-default.jpg'}
                        alt={user.name}
                        className="object-cover w-full h-full rounded-full"
                    />

                    <div className="absolute z-20 -bottom-2 -right-2" title="Emblemas">
                        <div className="relative flex flex-col items-center w-16 select-none">
                            <div className="absolute z-0 flex gap-0 -translate-x-1/2 -bottom-2 left-1/2">
                                <div className="origin-top rotate-[24deg]">
                                    <div className="flex w-4 h-4">
                                        <div className="w-1/3 h-full bg-red-600 [clip-path:polygon(0%_0%,100%_0%,100%_80%,0%_100%,0%_100%)]" />
                                        <div className="w-1/3 bg-white h-4/5" />
                                        <div className="w-1/3 h-full bg-blue-600 [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_80%,0%_100%)]" />
                                    </div>
                                </div>
                                <div className="origin-top -rotate-[24deg]">
                                    <div className="flex w-4 h-4">
                                        <div className="w-1/3 h-full bg-red-600 [clip-path:polygon(0%_0%,100%_0%,100%_80%,0%_100%,0%_100%)]" />
                                        <div className="w-1/3 bg-white h-4/5" />
                                        <div className="w-1/3 h-full bg-blue-600 [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_80%,0%_100%)]" />
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                                <div className="absolute inset-0 rounded-full shadow-lg bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700" />
                                <div className="absolute flex items-center justify-center border-2 border-yellow-300 rounded-full shadow-inner bg-yellow-50 inset-0.5 shadow-yellow-600/40">
                                    <span className="text-lg font-extrabold text-yellow-700 sm:text-xl drop-shadow-md">
                                        {(user as any).badges_count || user.badges?.length || 0}
                                    </span>
                                </div>
                                <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-0.5 left-0.5 opacity-40 blur-xs" />
                                <div className="absolute w-1 h-1 bg-white rounded-full bottom-0.5 right-0.5 opacity-30 blur-xs" />
                                <div className="absolute w-2 h-0.5 transform -translate-x-1/2 rounded-full bg-white/70 left-1/2 top-1 blur-sm opacity-30" />
                                <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_1px_rgba(234,179,8,0.8)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
