import { Button } from '@/components/common/button';
import { Container } from '@/components/common/container';
import { AdminLayout } from '@/layouts/admin-layout';
import { AuthData } from '@/types';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from '@inertiajs/react';
import { useMemo } from 'react';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { BrasilMap } from '@/components/common/BrasilMap';

interface DashboardProps {
    auth: AuthData;
    totalFarms: number;
    totalHectares: number;
    byState: Array<{ label: string; value: number }>;
    byCrop: Array<{ label: string; value: number }>;
    bySoilUse: Array<{ label: string; value: number }>;
}

export default function Dashboard({
    auth,
    totalFarms,
    totalHectares,
    byState,
    byCrop,
    bySoilUse
}: DashboardProps) {
    // Função para gerar cores diferentes para cada cultura
    const generateColors = (count: number): string[] => {
        const colors: string[] = [];
        const hueStep = 360 / count; // Divide o círculo de cores (HSL) em partes iguais
        
        for (let i = 0; i < count; i++) {
            const hue = (i * hueStep) % 360;
            // Usar saturação e luminosidade que geram cores bonitas
            const saturation = 60 + (i % 3) * 10; // Entre 60-80%
            const lightness = 50 + (i % 2) * 5; // Entre 50-55%
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        
        return colors;
    };

    // Configuração do gráfico por Cultura - mostra todas as culturas ordenadas por quantidade (maior para menor)
    const cropChartData = useMemo(() => {
        // Ordenar por quantidade (da maior para a menor)
        const sorted = [...byCrop].sort((a, b) => b.value - a.value);
        const colors = generateColors(sorted.length);
        
        return {
            labels: sorted.map((item: { label: string; value: number }) => item.label),
            datasets: [
                {
                    data: sorted.map((item: { label: string; value: number }) => item.value),
                    backgroundColor: colors,
                    borderWidth: 0,
                },
            ],
        };
    }, [byCrop]);

    // Configuração do gráfico por Uso do Solo
    const soilUseChartData = {
        labels: bySoilUse.map((item: { label: string; value: number }) => item.label),
        datasets: [
            {
                data: bySoilUse.map((item: { label: string; value: number }) => item.value),
                backgroundColor: ['#6366f1', '#10b981'], // Indigo e Emerald
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    color: '#6b7280',
                    font: {
                        size: 11,
                        family: 'Inter, system-ui, sans-serif',
                        weight: 'normal' as const
                    },
                    padding: 10,
                    boxWidth: 12,
                    boxHeight: 6,
                    borderRadius: 4,
                    usePointStyle: true,
                    maxWidth: 150
                },
                maxWidth: 400
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#d1d5db',
                cornerRadius: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold' as 'bold'
                },
                bodyFont: {
                    size: 13
                },
                padding: 16,
                displayColors: true,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        },
        cutout: '60%'
    };

    return (
        <AdminLayout>
            <Container noPadding className="min-h-screen bg-gradient-to-br flex flex-col gap-5 px-6 py-4 mt-5">
                {/* Header Section */}
                <div className="p-8 bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl">
                    <div className="flex items-center justify-between max-w-[2000px] mx-auto">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 group">
                                <Icon icon="svg-spinners:blocks-scale" className="text-primary" width="24" height="24" />
                                <h1 className="flex items-center gap-2 text-2xl font-bold text-secondary">
                                    Dashboard de Produtores Rurais
                                </h1>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-sm text-gray-500">Acompanhe as métricas em tempo real</p>
                            </div>
                        </div>
                        <Link href={route('admin.admin.dashboard.producer')}>
                            <Button className="flex items-center gap-2">
                                <Icon icon="mdi:account-plus" className="w-5 h-5" />
                                Gerenciar Produtores
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Cards de estatísticas */}
                <div className="p-8 bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Total de Fazendas */}
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50/50 to-purple-100/30 border border-purple-200/30 hover:shadow-md transition-all duration-200">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                                    <Icon icon="mdi:farm" className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                                Total de Fazendas
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{totalFarms.toLocaleString('pt-BR')}</p>
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto"></div>
                        </div>

                        {/* Total de Hectares */}
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-blue-100/30 border border-blue-200/30 hover:shadow-md transition-all duration-200">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                    <Icon icon="mdi:ruler" className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                                Total de Hectares
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                                {totalHectares.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Mapa do Brasil por Estado */}
                    <div className="p-8 bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Por Estado</h2>
                        <BrasilMap data={byState} />
                    </div>

                    {/* Gráfico por Cultura */}
                    <div className="p-8 bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Por Cultura</h2>
                        <div className="w-full h-[450px] flex items-center justify-center">
                            <Doughnut data={cropChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Gráfico por Uso do Solo */}
                    <div className="p-8 bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Por Uso do Solo</h2>
                        <div className="w-full h-[300px] flex items-center justify-center">
                            <Doughnut data={soilUseChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </Container>
        </AdminLayout>
    );
}
