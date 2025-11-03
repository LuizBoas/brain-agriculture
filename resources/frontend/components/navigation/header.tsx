import { AuthData } from '@/types';
import { useEffect, useState } from 'react';
// import { MobileNav } from './mobile';
import { ListNotification } from '@/notifications/ListNotification';
import { getOffensiveIconProperties } from '@/utils/offensive-icons';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, usePage } from '@inertiajs/react';
import UserDropdownMenu from './context_menu';
import { MobileNav } from './mobile';

// Interfaces para tipagem da estrutura de navegação
interface BaseNavigationItem {
    id: string;
    label: string;
    type: string;
}

interface LinkItem extends BaseNavigationItem {
    type: 'link';
    href: string;
    isActive: boolean;
}

interface ExternalLinkItem extends BaseNavigationItem {
    type: 'externalLink';
    href: string;
}

interface DropdownItem extends BaseNavigationItem {
    type: 'dropdown';
    isActive: boolean;
    items: (DropdownSubItem | DropdownComingSoonItem | DropdownExternalItem)[];
}

interface DropdownSubItem {
    id: string;
    label: string;
    href: string;
    icon: string;
    iconType: string;
}

interface DropdownComingSoonItem {
    id: string;
    label: string;
    comingSoon: boolean;
    icon: string;
    iconType: string;
}

interface DropdownExternalItem {
    id: string;
    label: string;
    external: boolean;
    href: string;
    icon: string;
    iconType: string;
}

type NavigationItem = LinkItem | ExternalLinkItem | DropdownItem;

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const { props } = usePage<{ auth?: AuthData }>();
    const auth = props.auth;

    // Estrutura de menu e navegação
    const navigationStructure: NavigationItem[] = [
        {
            type: 'link',
            id: 'home',
            label: 'Página inicial',
            href: route('home'),
            isActive: route().current('home')
        },
        {
            type: 'link',
            label: 'Comentários',
            href: route('comments'),
            id: 'comentarios',
            isActive: route().current('comments')
        },
        // {
        //     type: 'dropdown',
        //     id: 'comunidade',
        //     label: 'Comunidade',
        //     isActive: route().current('comments'),
        //     items: [
        //         {
        //             id: 'hall-da-fama',
        //             label: 'Hall da Fama',
        //             comingSoon: true,
        //             icon: 'heroicons:trophy',
        //             iconType: 'iconify'
        //         },
        //         {
        //             id: 'comentarios',
        //             label: 'Comentários',
        //             href: route('comments'),
        //             icon: 'heroicons:chat-bubble-left-right',
        //             iconType: 'iconify'
        //         }
        //         {
        //             id: 'mentoria',
        //             label: 'Agendar Mentoria',
        //             external: true,
        //             href: 'https://wa.me/5562994165898?text=Olá%2C%20sou%20aluno%28a%29%20Dynamis%20e%20estou%20na%20plataforma.%20Gostaria%20de%20agendar%20uma%20mentoria.%20Pode%20me%20ajudar%3F',
        //             icon: 'heroicons:calendar',
        //             iconType: 'iconify'
        //         }
        //     ]
        // },
        {
            type: 'dropdown',
            id: 'rankings',
            label: 'Hall da Fama',
            isActive:
                route().current('student.ranking.points') ||
                route().current('student.ranking.offensive') ||
                route().current('student.frame.gallery'),
            items: [
                {
                    id: 'frame-gallery',
                    label: 'Sala de Honra',
                    href: route('student.frame.gallery'),
                    icon: 'streamline:city-hall',
                    iconType: 'iconify'
                },
                {
                    id: 'ranking-points',
                    label: 'Ranking de Pontos',
                    href: route('student.ranking.points'),
                    icon: '/assets/icons/bolt.svg',
                    iconType: 'img'
                },
                {
                    id: 'ranking-offensive',
                    label: 'Ranking de Ofensivas',
                    href: route('student.ranking.offensive'),
                    icon: '/assets/icons/icons-ofensiva/fogo.svg',
                    iconType: 'img'
                }
            ]
        }
        // {
        //     type: 'externalLink',
        //     id: 'feedback',
        //     label: 'Loja',
        //     href: 'https://dynamiseducacao.com.br/LOJA/'
        // }
        // ...(auth.user.roles.includes('ADMIN')
        //     ? [
        //           {
        //               type: 'link',
        //               id: 'admin',
        //               label: 'Área do Admin',
        //               href: route('admin.dashboard'),
        //               isActive: route().current('admin.dashboard') || route().current('admin.dashboard.*')
        //           } as LinkItem
        //       ]
        //     : [])
    ];

    // Gerenciamento de tooltip - simplificado
    const handleTooltip = (type: string | null, event?: React.MouseEvent) => {
        setActiveTooltip(type);

        if (type && event) {
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            setPosition(rect.bottom + 110 > window.innerHeight ? 'top' : 'bottom');
        }
    };

    // Detecção de scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Gerenciamento de cliques fora dos dropdowns
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdown(null);
            setShowComingSoon(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Função para selecionar o ícone com base na ofensiva
    const renderOffensiveIcon = (streak: number) => {
        // Seleção do ícone e cor baseada no nível da ofensiva
        const { color, icon } = getOffensiveIconProperties(streak);

        return (
            <div className={`flex items-center gap-[6px] ${color}`}>
                <img src={icon} className="w-5 h-5 md:w-6 md:h-6" />
                <p className="text-lg">{streak}</p>
            </div>
        );
    };

    // Componente de Tooltip reutilizável
    const Tooltip = ({ message }: { message: string }) => (
        <div
            className={`absolute ${
                position === 'top' ? 'bottom-full' : 'top-full'
            } left-1/2 transform -translate-x-1/2 mt-3 p-2 w-[12rem] text-sm text-center bg-gray-800/90 text-white rounded-2xl z-50`}
        >
            <div
                className={`absolute ${
                    position === 'top' ? '-bottom-2' : '-top-2'
                } left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800/80 rotate-45`}
            ></div>
            <p className="p-1 font-normal">{message}</p>
        </div>
    );

    // Handler para alternar dropdowns
    const handleDropdownToggle = (e: React.MouseEvent, dropdown: string) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    // Handler para mostrar mensagem "Em breve"
    const handleComingSoon = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowComingSoon(true);
    };

    // Renderizar ícone baseado no tipo
    const renderIcon = (icon: string, type: string) => {
        if (type === 'img') {
            return <img src={icon} className="w-5 h-5" alt="" />;
        }
        return <Icon icon={icon} className="w-5 h-5" />;
    };

    // Função para verificar o tipo do item de submenu
    const isComingSoonItem = (item: any): item is DropdownComingSoonItem => {
        return 'comingSoon' in item;
    };

    const isExternalItem = (item: any): item is DropdownExternalItem => {
        return 'external' in item;
    };

    return (
        <header
            className={`fixed top-0 z-50 flex items-center h-[65px] lg:h-20 px-5 lg:px-10 w-full transition-colors duration-300 font-raleway ${
                isScrolled ? 'bg-secondary/70 backdrop-blur-md' : 'bg-secondary/80 backdrop-blur-sm'
            }`}
        >
            {/* Div alinhada à esquerda */}
            <div className="flex items-center gap-8 ">
                {auth?.user && <MobileNav />}
                <Link href={'/'} className="hidden lg:block">
                    <img src="/assets/logo/dynamis.webp" alt="Logo" className="h-8 px-5" />
                </Link>

                {/* Menu navegação principal - Desktop */}
                <nav className="items-center hidden gap-8 text-sm lg:flex lg:text-base">
                    {navigationStructure.map((item) => {
                        if (item.type === 'link') {
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`text-normal hoverhive relative ${
                                        item.isActive
                                            ? 'font-semibold after:absolute after:bottom-[-24px] after:left-0 after:w-full after:h-[1px] after:bg-primary'
                                            : 'font-normal'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        }

                        if (item.type === 'externalLink') {
                            return (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-normal text-normal hoverhive"
                                >
                                    {item.label}
                                </a>
                            );
                        }

                        if (item.type === 'dropdown') {
                            return (
                                <div key={item.id} className="relative">
                                    <button
                                        onClick={(e) => handleDropdownToggle(e, item.id)}
                                        className={`flex items-center gap-1 text-normal hoverhive relative ${
                                            item.isActive
                                                ? 'font-semibold after:absolute after:bottom-[-24px] after:left-0 after:w-full after:h-[1px] after:bg-primary'
                                                : 'font-normal'
                                        }`}
                                    >
                                        {item.label}
                                        <Icon
                                            icon={
                                                activeDropdown === item.id
                                                    ? 'heroicons:chevron-up'
                                                    : 'heroicons:chevron-down'
                                            }
                                            className="w-4 h-4 ml-1 transition-transform"
                                        />
                                    </button>

                                    {activeDropdown === item.id && (
                                        <div className="absolute left-0 z-50 w-64 p-3 mt-2 border rounded-md shadow-xl top-full bg-secondary/95 backdrop-blur-md border-primary/20">
                                            <div className="grid gap-2">
                                                {item.items.map((subItem) => {
                                                    if (isComingSoonItem(subItem)) {
                                                        return (
                                                            <button
                                                                key={subItem.id}
                                                                className="flex items-center w-full gap-2 px-3 py-2 text-left transition-colors rounded-md hover:bg-primary/10"
                                                                onClick={handleComingSoon}
                                                            >
                                                                {renderIcon(subItem.icon, subItem.iconType)}
                                                                <span>{subItem.label}</span>
                                                                <span className="px-2 py-1 ml-auto text-xs rounded-md bg-primary/20 text-primary">
                                                                    Em breve
                                                                </span>
                                                            </button>
                                                        );
                                                    }

                                                    if (isExternalItem(subItem)) {
                                                        return (
                                                            <a
                                                                key={subItem.id}
                                                                href={subItem.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 px-3 py-2 transition-colors rounded-md hover:bg-primary/10"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                {renderIcon(subItem.icon, subItem.iconType)}
                                                                <span>{subItem.label}</span>
                                                            </a>
                                                        );
                                                    }

                                                    return (
                                                        <Link
                                                            key={subItem.id}
                                                            href={subItem.href}
                                                            className="flex items-center gap-2 px-3 py-2 transition-colors rounded-md hover:bg-primary/10"
                                                            onClick={() => setActiveDropdown(null)}
                                                        >
                                                            {renderIcon(subItem.icon, subItem.iconType)}
                                                            <span>{subItem.label}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return null;
                    })}
                </nav>
            </div>

            {/* Modal "Em breve" */}
            {showComingSoon && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowComingSoon(false)}
                >
                    <div
                        className="max-w-md p-6 mx-auto border bg-secondary border-primary/20 rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <Icon icon="heroicons:rocket-launch" className="w-16 h-16 text-primary animate-pulse" />
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-center">Em breve!</h3>
                        <p className="mb-6 text-center text-gray-300">
                            Este recurso está em desenvolvimento e será disponibilizado em breve. Continue acompanhando
                            as atualizações da plataforma!
                        </p>
                        <div className="flex justify-center">
                            <button
                                className="px-4 py-2 transition-colors rounded-md bg-primary/20 hover:bg-primary/30 text-primary"
                                onClick={() => setShowComingSoon(false)}
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Espaçamento flexível */}
            <div className="flex-1"></div>

            {/* Div alinhada à direita */}
            <div className="flex items-center gap-2 lg:gap-4">
                {auth?.user && (
                    <div className="flex gap-4 text-xl font-semibold lg:gap-6 font-poppins">
                        <div
                            className="relative flex items-center gap-1 text-orange-100 cursor-pointer animate-pulse"
                            onMouseEnter={(event) => handleTooltip('freeze', event)}
                            onMouseLeave={() => handleTooltip(null)}
                        >
                            <Icon icon="noto:snowflake" className="w-6 h-6 md:w-7 md:h-7 text-blue-300" />
                            <p className="text-lg text-blue-300">{auth.user.freeze_count || 0}</p>
                            {activeTooltip === 'freeze' && (
                                <Tooltip message="A cada 5 dias consecutivos você ganha 2 congelamentos! Eles protegem sua ofensiva automaticamente." />
                            )}
                        </div>

                        <Link
                            href={route('student.ranking.offensive')}
                            className="relative flex items-center gap-1 text-lg text-orange-100 cursor-pointer animate-pulse"
                            onMouseEnter={(event) => handleTooltip('streak', event)}
                            onMouseLeave={() => handleTooltip(null)}
                        >
                            {renderOffensiveIcon(auth.user.streak)}
                            {activeTooltip === 'streak' && (
                                <Tooltip message="Nível de ofensiva. Finalize pelo menos uma aula todo dia para manter o ritmo!" />
                                // <Tooltip message="Nível de ofensiva. Aula diária é a chave pra conquistar mais!" />
                            )}
                        </Link>

                        <Link
                            href={route('student.ranking.points')}
                            className="relative flex items-center gap-1 text-orange-100 cursor-pointer animate-pulse -ml-2"
                            onMouseEnter={(event) => handleTooltip('points', event)}
                            onMouseLeave={() => handleTooltip(null)}
                        >
                            <img src="/assets/icons/bolt.svg" alt="Pontuação" className="w-6 h-6 md:w-7 md:h-7" />
                            <p className="text-lg text-yellow-300">{auth.user.points}</p>
                            {activeTooltip === 'points' && (
                                <Tooltip message="Total de pontos acumulados. Mantenha o ritmo!" />
                            )}
                        </Link>
                    </div>
                )}

                {auth?.user && <ListNotification />}
                <div className="hidden md:block">
                    {auth?.user && (
                        <UserDropdownMenu
                            user={{
                                id: auth.user.id,
                                name: auth.user.name || 'user',
                                image: auth.user.image || '/assets/images/avatar-image-default.jpg'
                            }}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}

Header.displayName = 'Header';

export { Header };
