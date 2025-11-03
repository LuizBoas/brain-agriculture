import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Frame } from '@/types';
import UserTooltipCard from './UserTooltipCard';

interface FramePopupProps {
    name: string;
    frame: Frame | null;
    userId: string;
    imageUrl: string;
    tooltipImageUrl?: string;
    alt: string;
    className?: string;
    imageClassName?: string;
    tooltipWidth?: string;
    tooltipPosition?: 'top' | 'bottom';
    tooltipTitle?: string;
    showOriginalInTooltip?: boolean;
    originalImageSize?: string;
    imageAsOverlay?: boolean;
    tooltipHeight?: string;
    streaks?: number;
    points?: number;
    badgesCount: number;
}

interface FramePopupCoords {
    top: number;
    left: number;
    transform: string;
}

export default function FramePopup({
    name,
    userId,
    imageUrl,
    tooltipImageUrl,
    alt,
    className = '',
    imageClassName = 'w-28 h-28 md:w-32 md:h-32',
    tooltipWidth = 'w-64',
    tooltipPosition: initialPosition = 'top',
    showOriginalInTooltip = false,
    originalImageSize = 'w-16 h-16',
    imageAsOverlay = false,
    tooltipHeight = 'h-96',
    streaks = 0,
    points = 0,
    frame,
    badgesCount
}: FramePopupProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [framePopupCoords, setFramePopupCoords] = useState<FramePopupCoords | null>(null);

    const imageRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const portalRef = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Se tooltipImageUrl for undefined ou null, não exibimos o popup
    const hasFrame = !!tooltipImageUrl;

    useEffect(() => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        portalRef.current = div;

        return () => {
            document.body.removeChild(div);
        };
    }, []);

    const calculateTooltipPosition = () => {
        if (!imageRef.current || !hasFrame) return;
        const rect = imageRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const estimatedTooltipHeight = 400;

        const position = spaceAbove < estimatedTooltipHeight ? 'bottom' : 'top';

        const coords: FramePopupCoords =
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

    return (
        <>
            <div
                ref={imageRef}
                className={`overflow-hidden rounded-lg transition-transform cursor-pointer ${className}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img src={imageUrl} className={imageClassName} alt={alt} title={alt} />
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
                        className={`fixed rounded-lg border shadow-xl backdrop-blur-md z-[9999] ${tooltipWidth} bg-secondary/95 border-primary/20`}
                        style={{
                            top: framePopupCoords.top,
                            left: framePopupCoords.left,
                            transform: framePopupCoords.transform
                        }}
                    >
                        <UserTooltipCard
                            user={
                                {
                                    id: userId,
                                    name: name,
                                    image: imageUrl,
                                    points: Array(points).fill({ points: 1 }),
                                    streak: Array(streaks).fill({ streak_number: 1 }),
                                    badges: Array(badgesCount).fill({}),
                                    currentFrame: frame
                                        ? {
                                              image: tooltipImageUrl,
                                              title: frame.title,
                                              description: frame.description,
                                              primary_color: frame.primary_color
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
}
