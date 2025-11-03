import { AdminLayout } from '@/layouts/admin-layout';
import { PagePropsData } from '@/types';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import CompleteTable from '@/components/admin-panel/complete-table';
import SearchInput from '@/components/admin-panel/search-input';
import { Container } from '@/components/common/container';
import { router } from '@inertiajs/react';

interface Farm {
    id: string;
    name: string;
    city: string;
    state: string;
    total_area: number;
    arable_area: number;
    vegetation_area: number;
    producer: {
        id: string;
        name: string;
        document: string;
        document_type: string;
    };
    harvests_count?: number;
}

interface FarmPagination {
    farms: {
        data: Farm[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function DashboardFarm({
    auth,
    farms
}: PagePropsData & FarmPagination) {
    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(farms.per_page);

    const handlePageChange = (page: number) => {
        router.get(route('admin.dashboard.farm'), {
            page,
            search,
            per_page: itemsPerPage
        }, { preserveState: true });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        router.get(route('admin.dashboard.farm'), {
            page: 1,
            search,
            per_page: newItemsPerPage
        }, { preserveState: true });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.dashboard.farm'), {
                search,
                per_page: itemsPerPage
            }, { preserveState: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const headers = [
        { title: 'Nome da Fazenda', field: 'name', sortable: false },
        { title: 'Produtor', field: 'producer', sortable: false },
        { title: 'Cidade/Estado', field: 'location', sortable: false },
        { title: 'Área Total (ha)', field: 'total_area', sortable: false },
        { title: 'Área Agricultável (ha)', field: 'arable_area', sortable: false },
        { title: 'Área Vegetação (ha)', field: 'vegetation_area', sortable: false },
        { title: 'Safras', field: 'harvests_count', sortable: false }
    ];

    const formatDocument = (document: string, type: string) => {
        const cleaned = document.replace(/\D/g, '');
        if (type === 'CPF') {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-6">
                <Container>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-secondary mb-2">Fazendas</h1>
                        <p className="text-secondary70">Visualize todas as fazendas cadastradas</p>
                    </div>

                    {/* Busca */}
                    <div className="mb-6">
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nome da fazenda, cidade, estado ou produtor..."
                        />
                    </div>

                    {/* Tabela */}
                    <div className="overflow-x-auto">
                        <CompleteTable
                            headers={headers}
                            currentPage={farms.current_page}
                            lastPage={farms.last_page}
                            handleItemsPerPageChange={handleItemsPerPageChange}
                            handlePageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                        >
                            <tbody>
                                {farms.data?.map((farm, index) => (
                                    <tr
                                        key={farm.id}
                                        className={`hover:bg-gray-100 text-gray-600 gap-4 text-sm ${
                                            index !== farms.data.length - 1 ? 'border-b border-gray-200' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-4 font-medium">{farm.name}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{farm.producer.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDocument(farm.producer.document, farm.producer.document_type)} ({farm.producer.document_type})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">{farm.city} - {farm.state}</td>
                                        <td className="px-4 py-4">
                                            {farm.total_area.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-4 py-4 text-green-600">
                                            {farm.arable_area.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-4 py-4 text-emerald-600">
                                            {farm.vegetation_area.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Icon icon="mdi:flower" className="w-5 h-5 text-primary" />
                                                <span>{farm.harvests_count || 0}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </CompleteTable>
                    </div>
                </Container>
            </div>
        </AdminLayout>
    );
}


