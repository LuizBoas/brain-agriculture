import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

import { TRichNotification, TSimpleNotification } from '@/types';
import getTimeDifference from '@/utils/get_time_difference';

export const SimpleNotification = (data: TSimpleNotification & { created_at?: string }) => {
    return (
        <div className="relative flex items-start space-x-3 w-full">
            {/* Timestamp fixo no canto superior direito */}
            <div className="absolute top-0 right-0 text-xs text-white/60 z-10 whitespace-nowrap">
                {data.created_at ? getTimeDifference(data.created_at) : 'agora'}
            </div>

            {/* Ícone em container moderno */}
            <div className="flex-shrink-0 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-info/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center hover:scale-105 transition-all duration-300">
                    {data.icon ? (
                        <Icon icon={data.icon} className="w-6 h-6 text-white" />
                    ) : (
                        <Icon icon="mdi:bell" className="w-6 h-6 text-white" />
                    )}
                </div>
            </div>

            <div className="flex-1 min-w-0 pr-16">
                <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{data.title}</h4>
                    <p className="text-sm text-white/80 mt-1 leading-relaxed">{data.description}</p>
                </div>
            </div>
        </div>
    );
};

export const RichNotification = (data: TRichNotification & { created_at?: string }) => {
    return (
        <div className="relative flex items-start space-x-3 w-full">
            {/* Timestamp fixo no canto superior direito */}
            <div className="absolute top-0 right-0 text-xs text-white/60 z-10 whitespace-nowrap">
                {data.created_at ? getTimeDifference(data.created_at) : 'agora'}
            </div>

            {/* Imagem sem borda */}
            <div className="flex-shrink-0 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-info/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                    src={data.image}
                    alt={data.image_alt}
                    className="relative w-12 h-12 rounded-xl object-cover shadow-lg hover:scale-105 transition-all duration-300"
                />
            </div>

            {/* Conteúdo da notificação */}
            <div className="flex-1 min-w-0 pr-16">
                <div className="flex-1">
                    <div className="font-bold text-white text-sm">{data.title}</div>
                    <div className="text-sm text-white/80 mt-1 leading-relaxed">{data.description}</div>
                </div>

                {/* Botão de ação moderno */}
                <div className="mt-3">
                    <Link
                        href={data.callback_url}
                        className="group relative inline-flex items-center gap-2 bg-primary/50 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-info/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Icon
                            icon="mdi:trophy"
                            className="relative w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="relative">{data.callback_text}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
