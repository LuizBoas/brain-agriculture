import { Button } from '@/components/common/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/common/sheet';
import { AuthData } from '@/types';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

// Interfaces para tipagem da estrutura de navegação mobile
interface BaseMobileItem {
    type: string;
}

interface MobileLinkItem extends BaseMobileItem {
    type: 'link';
    href: string;
    label: string;
    external?: boolean;
    mobileHref?: string;
}

interface MobileSectionItem extends BaseMobileItem {
    type: 'section';
    id: string;
    label: string;
    items: MobileSubItem[];
}

interface MobileSubItem {
    href: string;
    label: string;
    icon: string;
    iconType: string;
    comingSoon?: boolean;
    external?: boolean;
}

type MobileMenuItem = MobileLinkItem | MobileSectionItem;

export function MobileNav() {
    const { props } = usePage<{ auth?: AuthData }>();
    const auth = props.auth;

    // Estado para controlar o drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // Estado para controlar seções expandidas
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    // Estado para o modal "Em breve"
    const [showComingSoon, setShowComingSoon] = useState(false);

    const havePermission = auth?.user?.roles?.some((role: any) => role.name === 'ADMIN') || false;

    // Estrutura de navegação organizada por categorias
    const menuStructure: MobileMenuItem[] = [
        {
            type: 'link',
            href: route('home'),
            label: 'Página inicial'
        },
        ...(auth?.user
            ? [
                  {
                      type: 'link' as const,
                      href: route('student.profile', { id: auth.user.id }),
                      label: 'Meu Perfil'
                  }
              ]
            : []),

        {
            type: 'link',
            label: 'Comentários',
            href: route('comments')
        },
        {
            type: 'link',
            href: route('student.points'),
            label: 'Sistema de Pontuação'
        },
        {
            type: 'section',
            id: 'rankings',
            label: 'Hall da Fama',
            items: [
                {
                    href: route('student.frame.gallery'),
                    label: 'Hall da Fama',
                    icon: 'streamline:city-hall',
                    iconType: 'iconify'
                },
                {
                    href: route('student.ranking.points'),
                    label: 'Ranking de Pontos',
                    icon: '/assets/icons/bolt.svg',
                    iconType: 'img'
                },
                {
                    href: route('student.ranking.offensive'),
                    label: 'Ranking de Ofensivas',
                    icon: '/assets/icons/icons-ofensiva/fogo.svg',
                    iconType: 'img'
                }
            ]
        },
        // {
        //     type: 'section',
        //     id: 'comunidade',
        //     label: 'Comunidade',
        //     items: [
        //         {
        //             href: '#',
        //             label: 'Hall da Fama',
        //             icon: 'heroicons:trophy',
        //             iconType: 'iconify',
        //             comingSoon: true
        //         },
        //         {
        //             href: route('comments'),
        //             label: 'Comentários',
        //             icon: 'heroicons:chat-bubble-left-right',
        //             iconType: 'iconify'
        //         },
        //         {
        //             href: 'https://wa.me/5562994165898?text=Olá%2C%20sou%20aluno%28a%29%20Dynamis%20e%20estou%20na%20plataforma.%20Gostaria%20de%20agendar%20uma%20mentoria.%20Pode%20me%20ajudar%3F',
        //             label: 'Agendar Mentoria',
        //             icon: 'heroicons:calendar',
        //             iconType: 'iconify',
        //             external: true
        //         }
        //     ]
        // },
        // {
        //     type: 'link',
        //     href: 'https://dynamiseducacao.com.br/LOJA/',
        //     label: 'Loja',
        //     external: true
        // },
        ...(havePermission
            ? [
                  {
                      type: 'link' as const,
                      href: route('admin.dashboard'),
                      mobileHref: route('admin.dashboard.alert'),
                      label: 'Área do admin'
                  }
              ]
            : [])
    ];

    const handleCloseDrawer = () => setIsDrawerOpen(false);

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleComingSoon = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowComingSoon(true);
        handleCloseDrawer();
    };

    // Renderizar ícone baseado no tipo
    const renderIcon = (icon: string, type: string) => {
        if (type === 'img') {
            return <img src={icon} className="w-5 h-5" alt="" />;
        }
        return <Icon icon={icon} className="w-5 h-5" />;
    };

    // Funções para verificação de tipos
    const isMobileLinkItem = (item: MobileMenuItem): item is MobileLinkItem => {
        return item.type === 'link';
    };

    const isMobileSectionItem = (item: MobileMenuItem): item is MobileSectionItem => {
        return item.type === 'section';
    };

    const hasComingSoon = (item: MobileSubItem): boolean => {
        return !!item.comingSoon;
    };

    const isExternalItem = (item: MobileSubItem | MobileLinkItem): boolean => {
        return !!item.external;
    };

    return (
        <>
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetTrigger asChild>
                    <Button size="none" variant="none" className="bg-transparent lg:hidden">
                        <Icon icon="material-symbols-light:menu" className={`w-9 h-full`} />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="left"
                    className="flex flex-col px-5 border-0 sm:max-w-xs bg-secondary border-r border-primary/20"
                >
                    {/* Navegação principal */}
                    <nav className="grid gap-2 font-medium text-white text-base">
                        {/* Logo */}
                        <div className="flex items-center px-4 py-4 mb-3">
                            <img src={'/assets/logo/dynamis.webp'} alt="Logo" className="h-9" />
                        </div>

                        {/* Itens de menu */}
                        {menuStructure.map((item, index) => {
                            if (isMobileLinkItem(item)) {
                                const isActive = !isExternalItem(item) && route().current(item.href);

                                if (isExternalItem(item)) {
                                    return (
                                        <a
                                            key={index}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex text-left transition-colors px-4 py-3 cursor-pointer hoverhive hover:bg-primary/5 hover:rounded-md"
                                            onClick={handleCloseDrawer}
                                        >
                                            <span>{item.label}</span>
                                        </a>
                                    );
                                }

                                return (
                                    <Link
                                        key={index}
                                        href={item.mobileHref || item.href}
                                        className={`flex text-left transition-colors px-4 py-3 cursor-pointer hoverhive hover:bg-primary/5 hover:rounded-md ${
                                            isActive ? 'text-primary font-bold border-l-4 border-primary pl-3' : ''
                                        }`}
                                        onClick={handleCloseDrawer}
                                    >
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            } else if (isMobileSectionItem(item)) {
                                const isExpanded = expandedSections[item.id] || false;
                                const hasActiveItem = item.items.some(
                                    (subItem) =>
                                        !subItem.external && !subItem.comingSoon && route().current(subItem.href)
                                );

                                return (
                                    <div key={index} className="mb-1">
                                        <button
                                            className={`flex items-center justify-between w-full px-4 py-3 text-left transition-colors hover:bg-primary/5 hover:rounded-md ${
                                                hasActiveItem
                                                    ? 'text-primary font-bold border-l-4 border-primary pl-3'
                                                    : ''
                                            }`}
                                            onClick={() => toggleSection(item.id)}
                                        >
                                            <span>{item.label}</span>
                                            <Icon
                                                icon={isExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'}
                                                className="w-5 h-5"
                                            />
                                        </button>

                                        {isExpanded && (
                                            <div className="ml-4 pl-2 border-l border-primary/20">
                                                {item.items.map((subItem, subIndex) => {
                                                    if (hasComingSoon(subItem)) {
                                                        return (
                                                            <button
                                                                key={subIndex}
                                                                className="flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-primary/5 hover:rounded-md w-full"
                                                                onClick={handleComingSoon}
                                                            >
                                                                <span>{subItem.label}</span>
                                                                <span className="text-xs bg-primary/20 px-2 py-1 rounded-md text-primary">
                                                                    Em breve
                                                                </span>
                                                            </button>
                                                        );
                                                    }

                                                    if (isExternalItem(subItem)) {
                                                        return (
                                                            <a
                                                                key={subIndex}
                                                                href={subItem.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-primary/5 hover:rounded-md"
                                                                onClick={handleCloseDrawer}
                                                            >
                                                                <span>{subItem.label}</span>
                                                            </a>
                                                        );
                                                    }

                                                    return (
                                                        <Link
                                                            key={subIndex}
                                                            href={subItem.href}
                                                            className={`flex items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-primary/5 hover:rounded-md ${
                                                                route().current(subItem.href)
                                                                    ? 'bg-primary/10 text-primary font-bold'
                                                                    : ''
                                                            }`}
                                                            onClick={handleCloseDrawer}
                                                        >
                                                            <span>{subItem.label}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </nav>

                    {/* Espaço flexível para empurrar o botão "Sair" */}
                    <div className="flex-1"></div>

                    {/* Botão "Sair" */}
                    <Link
                        href={route('logout')}
                        method="post"
                        className="flex items-center gap-2 px-4 py-3 ml-1 text-base font-medium text-red-400 transition-colors cursor-pointer hoverhive hover:bg-primary/5 hover:rounded-md"
                        onClick={handleCloseDrawer}
                    >
                        <LogOut size={20} />
                        <span>Sair da conta</span>
                    </Link>
                </SheetContent>
            </Sheet>

            {/* Modal "Em breve" */}
            {showComingSoon && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                    onClick={() => setShowComingSoon(false)}
                >
                    <div
                        className="bg-secondary border border-primary/20 rounded-xl p-6 max-w-md mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <Icon icon="heroicons:rocket-launch" className="text-primary w-16 h-16 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-2">Em breve!</h3>
                        <p className="text-center text-gray-300 mb-6">
                            Este recurso está em desenvolvimento e será disponibilizado em breve. Continue acompanhando
                            as atualizações da plataforma!
                        </p>
                        <div className="flex justify-center">
                            <button
                                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors"
                                onClick={() => setShowComingSoon(false)}
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
