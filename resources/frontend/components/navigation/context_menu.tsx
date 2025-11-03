import { AuthData } from '@/types';
import { Icon } from '@iconify/react';
import { Link, usePage } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ShieldCheck, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserDropdownMenu({ user }: { user: { id: string; name: string; image: string } }) {
    const auth = usePage<{ auth: AuthData }>().props.auth;
    const [open, setOpen] = useState(false);

    // Função para formatar nome do usuário (apenas os dois primeiros nomes)
    const formatUserName = (fullName: string): string => {
        const names = fullName.trim().split(' ');
        return names.slice(0, 2).join(' ');
    };

    useEffect(() => {
        AOS.init({
            duration: 500,
            easing: 'ease-out-quart',
            once: false
        });
    }, []);

    const havePermission = auth.user.roles.some((role: any) => role.name === 'ADMIN');

    const menuOptions = [
        {
            href: route('student.profile', { id: user.id }),
            icon: <User size={16} />,
            label: 'Meu Perfil'
        },
        {
            href: route('student.points'),
            icon: <Icon icon="ph:lightning-fill" className="w-4 h-4" />,
            label: 'Sistema de Pontuação'
        },
        ...(havePermission
            ? [
                  {
                      href: route('admin.dashboard'),
                      icon: <ShieldCheck size={16} />,
                      label: 'Área do admin'
                  }
              ]
            : [])
    ];

    return (
        <div className="relative">
            {/* Desktop - Mantém o dropdown */}
            <div
                className="items-center hidden gap-4 cursor-pointer md:flex"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <p className="text-sm font-medium text-gray-300">{formatUserName(user?.name)}</p>
                <div className="w-10 h-10 overflow-hidden rounded-sm hoverhive">
                    <img
                        src={user.image}
                        width={42}
                        height={42}
                        alt={`Foto de perfil de ${user.name}`}
                        className="overflow-hidden"
                    />
                </div>
            </div>

            {/* Mobile - Ao clicar, redireciona para o perfil */}
            <div className="block overflow-hidden rounded-sm md:hidden">
                <Link href={route('student.profile', { id: user.id })}>
                    <img
                        src={user.image}
                        alt={`Foto de perfil de ${user.name}`}
                        className="overflow-hidden cursor-pointer w-11 h-11"
                    />
                </Link>
            </div>

            {open && (
                <div
                    className="absolute right-0 py-5 text-lg text-gray-300 border border-none rounded-lg shadow-lg w-80 bg-secondary70 backdrop-blur-sm"
                    data-aos="fade-down"
                    data-aos-duration="500"
                    data-aos-easing="ease-out-quart"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    {menuOptions.map((option, index) => (
                        <Link
                            key={index}
                            href={option.href}
                            className="flex items-center gap-2 px-8 py-2 transition-colors cursor-pointer hoverhive hover:bg-white/10"
                        >
                            {option.icon}
                            {option.label}
                        </Link>
                    ))}

                    {/* Linha horizontal */}
                    <hr className="my-2 border-t border-gray-700" />

                    <Link
                        href={route('logout')}
                        method="post"
                        className="flex items-center w-full px-8 py-2 transition-colors cursor-pointer hoverhive hover:bg-white/10 hover:text-red-400"
                    >
                        Sair
                    </Link>
                </div>
            )}
        </div>
    );
}
