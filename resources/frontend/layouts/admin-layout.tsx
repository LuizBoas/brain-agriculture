import { ToastMessage } from '@/components/common/toasts';
import { ClasseFilterProvider } from '@/contexts/ClasseFilterContext';
import { Icon } from '@iconify/react';
import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

// Tipos para o menu
interface MenuItem {
    name: string;
    href: string;
    icon: string;
    description?: string; // Descrição opcional para cada item
}

interface MenuSection {
  
   
    items: MenuItem[];
}

/* ============================================
   CONFIGURAÇÃO DO MENU ADMINISTRATIVO
   ============================================ */
const fullMenuSections: MenuSection[] = [
    {

        items: [
            {
                name: 'Dashboard',
                href: 'admin.dashboard',
                icon: 'material-symbols:dashboard-outline',
            },
            {
                name: 'Produtores',
                href: 'admin.dashboard.producer',
                icon: 'game-icons:farmer',    
            },
            {
                name: 'Fazendas',
                href: 'admin.dashboard.farm',
                icon: 'lucide-lab:farm',
            },
            {
                name: 'Colheitas',
                href: 'admin.dashboard.harvest',
                icon: 'mdi:flower',
            },
            {
                name: 'Administradores',
                href: 'admin.dashboard.admin',
                icon: 'mdi:account-supervisor',
            }
        ]
    }
];

// Configuração do menu para coordenadores (mesma do admin por enquanto)
const coordinatorMenuSections: MenuSection[] = fullMenuSections;

export function AdminLayout({ children }: PropsWithChildren) {
    const currentRoute = route().current();
    const { auth } = usePage().props as any;

    // Por enquanto, usar sempre o menu completo
    const menuSections = fullMenuSections;

    return (
        <ClasseFilterProvider>
            <div className="flex min-h-screen bg-[#f1f3f5]">
                <ToastMessage />
                {/* Menu Lateral */}
                <aside className="fixed h-screen w-[260px] bg-secondary text-white flex flex-col justify-start py-6 px-4 overflow-y-auto menu-lateral-scroll">
                    {/* ============================================
                        SEÇÃO: LOGO DA EMPRESA
                    ============================================ */}
                    <Link href={'/'} className="flex flex-col items-center mb-7">
                        <div className="relative">
                            <img
                                src="/assets/logo-white.png"
                                alt="Brain Agriculture"
                                className="h-10 md:h-12 w-auto mt-3"
                            />
                            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-info/20 rounded-full blur-lg opacity-30" />
                        </div>
                    </Link>

                    {/* ============================================
                        SEÇÃO: MENU DE NAVEGAÇÃO
                    ============================================ */}
                    <nav className="flex flex-col gap-1 font-raleway">
                        {menuSections.map((section: MenuSection, sectionIndex: number) => (
                            <div key={sectionIndex} className="mb-6">
                                {/* Título e Descrição da Seção */}
                               

                                {/* Linha separadora */}
                                <div className="border-b-[1px] border-gray-600/50 mb-3"></div>

                                {/* Itens do Menu */}
                                <div className="flex flex-col gap-1">
                                    {section.items.map((item: MenuItem, index: number) => {
                                        const isActive = currentRoute === item.href;
                                        return (
                                            <div key={index} className="group">
                                                <Link
                                                    href={route(item.href)}
                                                    className={`flex items-start px-3 py-[10px] gap-3 font-sans transition rounded-md hover:bg-white/10 ${
                                                        isActive ? 'bg-primary/20 font-semibold text-primary border-l-2 border-primary' : 'text-white'
                                                    }`}
                                                    aria-label={item.name}
                                                    title={item.description || item.name}
                                                >
                                                    <Icon 
                                                        icon={item.icon} 
                                                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                                            isActive ? 'text-primary' : 'text-gray-300'
                                                        }`} 
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`${isActive ? 'text-primary' : 'text-white'}`}>
                                                            {item.name}
                                                        </div>
                                                        {item.description && (
                                                            <div className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2 group-hover:text-gray-300">
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Espaço Flexível */}
                    <div className="flex-1"></div>

                    {/* ============================================
                        SEÇÃO: AÇÕES INFERIORES (LOGOUT)
                    ============================================ */}
                    <div className="flex flex-col gap-4 border-t border-gray-600/50 pt-4 mt-4">
                        <button
                            onClick={() => {
                                router.post(route('logout'));
                            }}
                            className="flex items-center px-3 py-2 gap-2 transition rounded-md hover:bg-red-500/10 text-white group"
                            aria-label="Sair do sistema"
                            title="Encerrar sessão e sair da plataforma"
                        >
                            <Icon icon="material-symbols-light:logout" className="w-6 h-6 text-red-400 group-hover:text-red-300" />
                            <span className="text-sm">Sair da conta</span>
                        </button>
                    </div>
                </aside>

                {/* Conteúdo Principal com barra de rolagem personalizada */}
                <main className="flex-1 ml-[260px] p-6 overflow-y-auto scroll-admin">{children}</main>
            </div>
        </ClasseFilterProvider>
    );
}
