import { Button } from '@/components/common/button';
import { Form } from '@/components/common/form';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { GuestLayout } from 'layouts';
import React, { useState } from 'react';
import { Link } from 'react-aria-components';

interface LoginProps {
    status: string;
    canResetPassword: boolean;
}

interface LoginForm {
    email: string;
    password: string;
    remember: string;
    timestamp: string;
}

interface LoginErrors {
    email?: string;
    password?: string;
    error?: string;
}

const LoginCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
            duration: 0.6,
            ease: 'easeOut'
        }}
        className={`bg-gradient-to-br from-secondary/95 to-secondary70/10 backdrop-blur-md rounded-2xl border border-primary/30 shadow-2xl hover:shadow-primary/20 transition-all duration-500 ${className}`}
    >
        {children}
    </motion.div>
);

export default function Login(args: LoginProps) {
    const { status, canResetPassword } = args;
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: '',
        timestamp: Date.now().toString()
    });

    const submit = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        setData('timestamp', Date.now().toString());

        post('/login', {
            preserveScroll: true,
            forceFormData: true,
            onError: (errors) => {
                if (errors.error) {
                    setLoginError(errors.error as string);
                } else if (errors.email) {
                    setLoginError(errors.email as string);
                } else if (errors.password) {
                    setLoginError(errors.password as string);
                }
            }
        });
    };

    const [loginError, setLoginError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Login - Brain Agriculture" />

            {/* ============================================
                CONTAINER PRINCIPAL
            ============================================ */}
            <div className="relative w-full min-h-screen bg-background overflow-hidden">
                
                {/* ============================================
                    SEÇÃO: BACKGROUND E EFEITOS VISUAIS
                ============================================ */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background">
                    {/* Raios de fundo */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.08),transparent_50%)]" />

                    {/* Raios de luz diagonais */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-info/5 to-transparent" />
                </div>

                {/* Partículas de fundo */}
                <div className="absolute inset-0">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-primary/20 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                            animate={{
                                y: [0, -15, 0],
                                opacity: [0.2, 0.6, 0.2]
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                repeat: Infinity,
                                delay: Math.random() * 3
                            }}
                        />
                    ))}
                </div>

                {/* ============================================
                    SEÇÃO: CONTEÚDO PRINCIPAL
                ============================================ */}
                <div className="flex flex-col relative z-10 items-center justify-center min-h-screen p-4 gap-5">
                    <div className="w-full max-w-md">
                        
                        {/* Logo da empresa */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex justify-center mb-8"
                        >
                            <div className="relative">
                                <img
                                    src="/assets/logo-white.png"
                                    className="h-14 md:h-20 w-auto"
                                    alt="Brain Agriculture Logo"
                                />
                                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-info/20 rounded-full blur-xl opacity-50" />
                            </div>
                        </motion.div>

                        {/* ============================================
                            SEÇÃO: CARD DE LOGIN
                        ============================================ */}
                        <LoginCard className="p-8">
                            
                            {/* Título e descrição do card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-center mb-8"
                            >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <motion.div
                                        className="w-12 h-12 bg-gradient-to-br from-primary/20 to-info/20 rounded-xl flex items-center justify-center border border-primary/30"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.7, 1, 0.7]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                                delay: 0.5
                                            }}
                                        >
                                            <Icon
                                                icon="hugeicons:analytics-up"
                                                className="w-6 h-6 text-primary"
                                            />
                                        </motion.div>
                                    </motion.div>
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">Acesse a plataforma!</h1>
                                <p className="text-white/60 text-sm">Excelência e simplicidade em cada detalhe.</p>
                            </motion.div>

                            {/* ============================================
                                SEÇÃO: MENSAGENS (Status e Erros)
                            ============================================ */}
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center"
                                >
                                    {status}
                                </motion.div>
                            )}

                            {loginError && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start justify-center gap-2"
                                >
                                    <Icon icon="pajamas:error" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="text-center">{loginError}</span>
                                </motion.div>
                            )}

                            {/* ============================================
                                SEÇÃO: FORMULÁRIO DE LOGIN
                            ============================================ */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <Form validationErrors={errors} onSubmit={submit}>
                                    <div className="space-y-4">
                                        {/* Campo de Email */}
                                        <div className="relative group">
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    autoComplete="username"
                                                    autoFocus
                                                    onChange={(e) => {
                                                        setData('email', e.target.value);
                                                        setLoginError(null);
                                                    }}
                                                    placeholder="Digite seu email"
                                                    className="w-full h-12 bg-transparent border border-white/10 outline-none text-white placeholder:text-white/40 px-10 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 [&:-webkit-autofill]:!bg-transparent [&:-webkit-autofill]:!text-white [&:-webkit-autofill]:[box-shadow:none] [&:-webkit-autofill]:[text-fill-color:white]"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 group-focus-within:text-primary transition-colors duration-300">
                                                    <Icon icon="lucide:mail" className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Campo de Senha */}
                                        <div className="relative group">
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={data.password}
                                                    autoComplete="current-password"
                                                    onChange={(e) => {
                                                        setData('password', e.target.value);
                                                        setLoginError(null);
                                                    }}
                                                    placeholder="Digite sua senha"
                                                    className="w-full h-12 bg-transparent border border-white/10 outline-none text-white placeholder:text-white/40 px-10 pr-12 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 [&:-webkit-autofill]:!bg-transparent [&:-webkit-autofill]:!text-white [&:-webkit-autofill]:[box-shadow:none] [&:-webkit-autofill]:[text-fill-color:white]"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 group-focus-within:text-primary transition-colors duration-300">
                                                    <Icon icon="lucide:lock" className="w-4 h-4" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary transition-colors duration-300"
                                                >
                                                    <Icon
                                                        icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                                                        className="w-4 h-4"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Link "Esqueci minha senha" */}
                                    <div className="flex items-center justify-end mt-4">
                                        {canResetPassword && (
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm text-white/70 hover:text-primary transition-colors duration-200"
                                            >
                                                Esqueci minha senha
                                            </Link>
                                        )}
                                    </div>

                                    {/* Botão de Submit */}
                                    <div className="mt-6 relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-info/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <Button
                                            type="submit"
                                            className="relative w-full py-4 text-lg font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:via-primary hover:to-primary/90 border border-primary/40 shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] z-10"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <Icon
                                                        icon="line-md:loading-twotone-loop"
                                                        className="w-5 h-5 animate-spin"
                                                    />
                                                    <span>Acessando...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-3">
                                                    <Icon icon="lucide:log-in" className="w-5 h-5" />
                                                    <span>Acessar</span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </motion.div>
                        </LoginCard>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = (page: React.ReactNode) => {
    return <GuestLayout children={page} />;
};
