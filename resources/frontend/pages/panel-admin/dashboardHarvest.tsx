import { AdminLayout } from '@/layouts/admin-layout';
import { AuthData } from '@/types';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import CompleteTable from '@/components/admin-panel/complete-table';
import SearchInput from '@/components/admin-panel/search-input';
import { Container } from '@/components/common/container';
import { router, useForm } from '@inertiajs/react';
import { DynamicModal } from '@/components/admin-panel/dynamic-modal-admin';
import { InputPopUpAdmin } from '@/components/common/field';
import { Button } from '@/components/common/button';
import { ActionAdminPopup } from '@/components/admin-panel/action-admin-popup';

interface Crop {
    id: string;
    name: string;
}

interface Harvest {
    id: string;
    year: string;
    crops: Crop[];
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
    auth: AuthData;
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
}: HarvestPagination) {
    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(harvests.per_page);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);
    const [crops, setCrops] = useState<string[]>([]);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);

    const { data, setData, put, reset, errors, processing } = useForm({
        year: '',
        crops: [] as string[]
    });

    const handlePageChange = (page: number) => {
        router.get(route('admin.admin.dashboard.harvest'), {
            page,
            search,
            per_page: itemsPerPage
        }, { preserveState: true });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        router.get(route('admin.admin.dashboard.harvest'), {
            page: 1,
            search,
            per_page: newItemsPerPage
        }, { preserveState: true });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.admin.dashboard.harvest'), {
                search,
                per_page: itemsPerPage
            }, { preserveState: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const headers = [
        { title: 'Safra', field: 'year', sortable: false },
        { title: 'Fazenda', field: 'farm', sortable: false },
        { title: 'Produtor', field: 'producer', sortable: false },
        { title: 'Culturas Plantadas', field: 'crops', sortable: false },
        { title: 'Ações', field: 'actions', sortable: false }
    ];

    const formatDocument = (document: string, type: string) => {
        const cleaned = document.replace(/\D/g, '');
        if (type === 'CPF') {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
    };

    const handleEditHarvest = (harvest: Harvest) => {
        setSelectedHarvest(harvest);
        setData('year', harvest.year);
        setCrops(harvest.crops?.map(c => c.name) || []);
        setIsEditModalOpen(true);
    };

    const addCrop = () => {
        setCrops([...crops, '']);
    };

    const removeCrop = (index: number) => {
        const newCrops = crops.filter((_, i) => i !== index);
        setCrops(newCrops);
    };

    const updateCrop = (index: number, value: string) => {
        const newCrops = [...crops];
        newCrops[index] = value;
        setCrops(newCrops);
    };

    const submitEditHarvest = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedHarvest?.id) {
            console.error('Nenhuma safra selecionada');
            return;
        }
        
        const cropsData = crops.filter(crop => crop.trim() !== '');
        
        router.put(route('admin.admin.harvest.update', { id: selectedHarvest.id }), {
            year: data.year,
            crops: cropsData
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
                setCrops([]);
                setSelectedHarvest(null);
            },
            onError: (errors) => {
                console.error('Erro ao atualizar safra:', errors);
            }
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-6">
                <Container>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-secondary mb-2">Safras</h1>
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
                                {harvests.data?.map((harvest: Harvest, index: number) => (
                                    <tr
                                        key={harvest.id}
                                        className={`hover:bg-gray-100 text-gray-600 gap-4 text-sm ${
                                            index !== harvests.data.length - 1 ? 'border-b border-gray-200' : ''
                                        }`}
                                    >
                                        <td className="px-2 md:px-4 py-2 md:py-4">
                                            <div className="flex items-center gap-2">
                                                <Icon icon="mdi:calendar" className="w-5 h-5 text-primary" />
                                                <span className="font-medium">Safra {harvest.year}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 md:px-4 py-2 md:py-4 font-medium">{harvest.farm.name}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{harvest.farm.producer.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDocument(harvest.farm.producer.document, harvest.farm.producer.document_type)} ({harvest.farm.producer.document_type})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-2 md:px-4 py-2 md:py-4">
                                            {harvest.crops && harvest.crops.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {harvest.crops.map((crop: Crop, idx: number) => (
                                                        <span key={crop.id || idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded inline-block">
                                                            {crop.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Sem culturas</span>
                                            )}
                                        </td>
                                        <td className="px-1 md:px-2 py-1 md:py-2 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Icon
                                                    icon="material-symbols:more-vert"
                                                    className="w-6 h-6 rounded-full cursor-pointer hover:bg-gray-100"
                                                    onClick={() => setMenuOpen(menuOpen === index ? null : index)}
                                                />
                                                <div className={`z-50`}>
                                                    {menuOpen === index && (
                                                        <ActionAdminPopup
                                                            onEdit={() => {
                                                                handleEditHarvest(harvest);
                                                                setMenuOpen(null);
                                                            }}
                                                            closeMenu={() => setMenuOpen(null)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </CompleteTable>
                    </div>

                    {/* Modal de Edição */}
                    <DynamicModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            reset();
                            setCrops([]);
                            setSelectedHarvest(null);
                        }}
                        title="Editar Safra"
                    >
                        <form onSubmit={submitEditHarvest}>
                            <div className="space-y-4">
                                <InputPopUpAdmin
                                    label="Ano da Safra"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    errorMessage={errors.year}
                                    placeholder="Ex: 2024"
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Culturas Plantadas
                                    </label>
                                    {crops.map((crop, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <InputPopUpAdmin
                                                value={crop}
                                                onChange={(e) => updateCrop(index, e.target.value)}
                                                errorMessage={errors.crops?.[index] || undefined}
                                                placeholder="Ex: Soja, Milho, Café"
                                            />
                                            <Button
                                                type="button"
                                                variant="cancel"
                                                onClick={() => removeCrop(index)}
                                                className="px-3"
                                            >
                                                <Icon icon="mdi:delete" className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={addCrop}
                                        className="mt-2"
                                    >
                                        <Icon icon="mdi:plus" className="w-4 h-4" />
                                        Adicionar Cultura
                                    </Button>
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        type="button"
                                        variant="cancel"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            reset();
                                            setCrops([]);
                                            setSelectedHarvest(null);
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        disabled={processing}
                                    >
                                        {processing ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </DynamicModal>
                </Container>
            </div>
        </AdminLayout>
    );
}


