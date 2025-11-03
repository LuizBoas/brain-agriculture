import { AdminLayout } from '@/layouts/admin-layout';
import { PagePropsData } from '@/types';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import CompleteTable from '@/components/admin-panel/complete-table';
import SearchInput from '@/components/admin-panel/search-input';
import { Container } from '@/components/common/container';
import { router } from '@inertiajs/react';

interface Harvest {
    id: string;
    year: string;
    name: string; // Nome da plantação/cultura
    farm: {
        id: string;
        name: string;
        producer: {
            id: string;
            name: string;
            document: string;
            document_type: string;
        };
    };
}

interface HarvestPagination {
    harvests: {
        data: Harvest[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function DashboardHarvest({
    auth,
    harvests
}: PagePropsData & HarvestPagination) {
    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(harvests.per_page);

    const handlePageChange = (page: number) => {
        router.get(route('admin.dashboard.harvest'), {
            page,
            search,
            per_page: itemsPerPage
        }, { preserveState: true });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        router.get(route('admin.dashboard.harvest'), {
            page: 1,
            search,
            per_page: newItemsPerPage
        }, { preserveState: true });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.dashboard.harvest'), {
                search,
                per_page: itemsPerPage
            }, { preserveState: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const headers = [
        { title: 'Ano da Safra', field: 'year', sortable: false },
        { title: 'Fazenda', field: 'farm', sortable: false },
        { title: 'Produtor', field: 'producer', sortable: false },
        { title: 'Plantação/Cultura', field: 'name', sortable: false }
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
                        <h1 className="text-3xl font-bold text-secondary mb-2">Colheitas</h1>
                        <p className="text-secondary70">Visualize todas as safras cadastradas</p>
                    </div>

                    {/* Busca */}
                    <div className="mb-6">
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por ano, nome da fazenda, produtor ou cultura..."
                        />
                    </div>

                    {/* Tabela */}
                    <div className="overflow-x-auto">
                        <CompleteTable
                            headers={headers}
                            currentPage={harvests.current_page}
                            lastPage={harvests.last_page}
                            handleItemsPerPageChange={handleItemsPerPageChange}
                            handlePageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                        >
                            <tbody>
                                {harvests.data?.map((harvest, index) => (
                                    <tr
                                        key={harvest.id}
                                        className={`hover:bg-gray-100 text-gray-600 gap-4 text-sm ${
                                            index !== harvests.data.length - 1 ? 'border-b border-gray-200' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Icon icon="mdi:calendar" className="w-5 h-5 text-primary" />
                                                <span className="font-medium">{harvest.year}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 font-medium">{harvest.farm.name}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{harvest.farm.producer.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDocument(harvest.farm.producer.document, harvest.farm.producer.document_type)} ({harvest.farm.producer.document_type})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {harvest.name ? (
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded inline-block">
                                                    {harvest.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">Sem cultura</span>
                                            )}
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


