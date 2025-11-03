// import { MobileNav } from './mobile';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';
import { Container } from '../common/container';

export default function Footer() {
    // Constantes para redes sociais
    const socialLinks = [
        {
            name: 'Website',
            icon: 'mdi:web',
            url: 'https://dynamiseducacao.com.br/',
            ariaLabel: 'Website'
        },
        {
            name: 'YouTube',
            icon: 'mdi:youtube',
            url: 'https://www.youtube.com/@dynamiseducacao',
            ariaLabel: 'YouTube'
        },
        {
            name: 'Instagram',
            icon: 'mdi:instagram',
            url: 'https://www.instagram.com/dynamiseducacao',
            ariaLabel: 'Instagram'
        },
        {
            name: 'WhatsApp',
            icon: 'mdi:whatsapp',
            url: 'https://wa.me/5562994165898?text=Olá%2C%20sou%20aluno%28a%29%20Dynamis%20e%20estou%20na%20plataforma.%20Gostaria%20de%20tirar%20algumas%20dúvidas.%20Pode%20me%20ajudar%3F',
            ariaLabel: 'WhatsApp'
        }
        // {
        //     name: 'TikTok',
        //     icon: 'ic:baseline-tiktok',
        //     url: 'https://www.tiktok.com/@dynamiseducacao.oficial',
        //     ariaLabel: 'TikTok'
        // }
    ];

    // Constantes para os links de navegação
    const navLinks = [
        {
            name: 'Termos de uso',
            route: 'terms.show',
            params: { viewOnly: true },
            isRoute: true,
            isExternal: false
        },
        {
            name: 'Termos de garantia',
            route: 'warranty.show',
            params: { viewOnly: true },
            isRoute: true,
            isExternal: false
        },
        {
            name: 'Ajuda',
            route: 'https://wa.me/5562994165898?text=Olá%2C%20sou%20aluno%28a%29%20Dynamis%20e%20estou%20na%20plataforma.%20Gostaria%20de%20tirar%20algumas%20dúvidas.%20Pode%20me%20ajudar%3F',
            isRoute: false,
            isExternal: true
        }
    ];

    return (
        <footer className="relative py-4 mt-5 bg-transparent md:mt-10 ">
            <Container className="relative px-5 md:px-20">
                <div className="mx-auto">
                    <div className="flex flex-col items-center justify-between py-2 md:flex-row">
                        {/* Links de redes sociais - Esquerda */}
                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-colors text-white/80 hover:text-primary"
                                    aria-label={social.ariaLabel}
                                >
                                    <Icon icon={social.icon} className="w-5 h-5 md:w-6 md:h-6" />
                                </a>
                            ))}
                        </div>

                        {/* Links de navegação - Direita */}
                        <div className="flex flex-wrap justify-center gap-5 md:justify-end">
                            {navLinks.map((link, index) =>
                                link.isExternal ? (
                                    <a
                                        key={index}
                                        href={link.route}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm transition-colors text-white/90 hover:text-primary"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={index}
                                        href={link.isRoute ? route(link.route, link.params || {}) : link.route}
                                        className="text-sm transition-colors text-white/90 hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between mt-2 border-t md:flex-row border-gray-800/50">
                        {/* Direitos autorais - Nova linha */}
                        <div className="items-center w-full py-2 text-xs text-center text-gray-400 md:text-left">
                            © {new Date().getFullYear()} Dynamis Educação. Todos os direitos reservados.
                        </div>
                        {/* <div
                            className={`flex flex-row items-center md:justify-end justify-center gap-2 w-full cursor-pointer py-2 opacity-60`}
                        >
                            <p className={`font-bold text-xs`}>developed by</p>
                            <img src="assets/logo/hiivee-white.svg" className={`w-full h-full z-10 max-w-[130px]`} />
                        </div> */}
                    </div>
                </div>
            </Container>
        </footer>
    );
}

Footer.displayName = 'Footer';

export { Footer };
