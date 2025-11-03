import { DeleteModal } from '@/components/admin-panel/delete-modal';
import { AdminLayout } from '@/layouts/admin-layout';
import { PagePropsData } from '@/types';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { ActionAdminPopup } from '@/components/admin-panel/action-admin-popup';
import CompleteTable from '@/components/admin-panel/complete-table';
import SearchInput from '@/components/admin-panel/search-input';
import { Button } from '@/components/common/button';
import { Container } from '@/components/common/container';
import { Form } from '@/components/common/form';
import { router, useForm } from '@inertiajs/react';
import { DynamicModal } from '@/components/admin-panel/dynamic-modal-admin';
import { InputPopUpAdmin } from '@/components/common/field';

interface Producer {
    id: string;
    document: string;
    document_type: 'CPF' | 'CNPJ';
    name: string;
    farms_count?: number;
    created_at: string;
}

interface ProducerPagination {
    producers: {
        data: Producer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface FarmFormData {
    name: string;
    city: string;
    state: string;
    total_area: string;
    arable_area: string;
    vegetation_area: string;
    harvests: Array<{
        year: string;
        crops: string[];
    }>;
}

export default function DashboardProducer({
    auth,
    producers
}: PagePropsData & ProducerPagination) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [farms, setFarms] = useState<FarmFormData[]>([{
        name: '',
        city: '',
        state: '',
        total_area: '',
        arable_area: '',
        vegetation_area: '',
        harvests: []
    }]);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        document: '',
        document_type: 'CPF' as 'CPF' | 'CNPJ',
        name: '',
        farms: [] as FarmFormData[]
    });


    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(producers.per_page);

    const { delete: deleteProducer } = useForm();

    const handleDeleteProducer = (producer: Producer) => {
        setSelectedProducer(producer);
        setDeleteMessage(`Tem certeza que deseja excluir o produtor "${producer.name}"? Todas as fazendas associadas também serão excluídas.`);
        setOnDeleteAction(() => () => {
            deleteProducer(route('admin.producer.delete', { id: producer.id }), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                }
            });
        });
        setIsDeleteModalOpen(true);
    };

    const [onDeleteAction, setOnDeleteAction] = useState<() => void>(() => () => {});

    const handleEditProducer = async (producer: Producer) => {
        setSelectedProducer(producer);
        setIsEditModalOpen(true);
        
        // Carregar dados completos do produtor
        try {
            const response = await fetch(route('producer.edit.form', { id: producer.id }));
            const result = await response.json();
            
            setData({
                document: result.producer.document,
                document_type: result.producer.document_type,
                name: result.producer.name,
                farms: []
            });
            
            // Carregar fazendas
            if (result.farms && result.farms.length > 0) {
                setFarms(result.farms.map((farm: any) => ({
                    name: farm.name,
                    city: farm.city,
                    state: farm.state,
                    total_area: farm.total_area,
                    arable_area: farm.arable_area,
                    vegetation_area: farm.vegetation_area,
                    harvests: farm.harvests.map((harvest: any) => ({
                        year: harvest.year,
                        crops: harvest.crops || []
                    }))
                })));
            } else {
                setFarms([{
                    name: '',
                    city: '',
                    state: '',
                    total_area: '',
                    arable_area: '',
                    vegetation_area: '',
                    harvests: []
                }]);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do produtor:', error);
            // Fallback: usar dados básicos
            setData({
                document: producer.document,
                document_type: producer.document_type,
                name: producer.name,
                farms: []
            });
            setFarms([{
                name: '',
                city: '',
                state: '',
                total_area: '',
                arable_area: '',
                vegetation_area: '',
                harvests: []
            }]);
        }
    };

    const addFarm = () => {
        setFarms([...farms, {
            name: '',
            city: '',
            state: '',
            total_area: '',
            arable_area: '',
            vegetation_area: '',
            harvests: []
        }]);
    };

    const removeFarm = (index: number) => {
        setFarms(farms.filter((_, i) => i !== index));
    };

    const updateFarm = (index: number, field: keyof FarmFormData, value: any) => {
        const newFarms = [...farms];
        newFarms[index] = { ...newFarms[index], [field]: value };
        setFarms(newFarms);
    };

    const addHarvest = (farmIndex: number) => {
        const newFarms = [...farms];
        newFarms[farmIndex].harvests.push({ year: '', crops: [] });
        setFarms(newFarms);
    };

    const removeHarvest = (farmIndex: number, harvestIndex: number) => {
        const newFarms = [...farms];
        newFarms[farmIndex].harvests.splice(harvestIndex, 1);
        setFarms(newFarms);
    };

    const updateHarvestYear = (farmIndex: number, harvestIndex: number, year: string) => {
        const newFarms = [...farms];
        newFarms[farmIndex].harvests[harvestIndex].year = year;
        setFarms(newFarms);
    };

    const addCrop = (farmIndex: number, harvestIndex: number, cropName: string) => {
        if (!cropName.trim()) return;
        const newFarms = [...farms];
        if (!newFarms[farmIndex].harvests[harvestIndex].crops) {
            newFarms[farmIndex].harvests[harvestIndex].crops = [];
        }
        newFarms[farmIndex].harvests[harvestIndex].crops.push(cropName);
        setFarms(newFarms);
    };

    const removeCrop = (farmIndex: number, harvestIndex: number, cropIndex: number) => {
        const newFarms = [...farms];
        newFarms[farmIndex].harvests[harvestIndex].crops.splice(cropIndex, 1);
        setFarms(newFarms);
    };

    const submitAddProducer = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Preparar dados das fazendas para envio
        const farmsData = farms
            .map(farm => ({
                name: farm.name?.trim() || '',
                city: farm.city?.trim() || '',
                state: farm.state?.trim() || '',
                total_area: farm.total_area?.toString() || '0',
                arable_area: farm.arable_area?.toString() || '0',
                vegetation_area: farm.vegetation_area?.toString() || '0',
                harvests: (farm.harvests || []).map(h => ({
                    year: h.year?.trim() || '',
                    crops: (h.crops || []).filter((c: string) => c && c.trim() !== '').map((c: string) => c.trim())
                })).filter(h => h.year.trim() !== '') // Remove safras sem ano
            }))
            .filter(farm => farm.name.trim() !== '' && farm.city.trim() !== '' && farm.state.trim() !== ''); // Remove fazendas incompletas

        console.log('Dados sendo enviados:', {
            document: data.document,
            document_type: data.document_type,
            name: data.name,
            farms: farmsData
        });

        // Usar router.post diretamente para garantir que os dados sejam enviados corretamente
        router.post(route('admin.producer.create'), {
            document: data.document,
            document_type: data.document_type,
            name: data.name,
            farms: farmsData
        }, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                reset();
                setFarms([{
                    name: '',
                    city: '',
                    state: '',
                    total_area: '',
                    arable_area: '',
                    vegetation_area: '',
                    harvests: []
                }]);
                setIsAddModalOpen(false);
            },
            onError: (errors) => {
                console.error('Erro ao criar produtor:', errors);
                console.error('Dados sendo enviados:', {
                    document: data.document,
                    document_type: data.document_type,
                    name: data.name,
                    farms: farmsData
                });
            }
        });
    };

    const submitEditProducer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProducer) return;

        // Preparar dados das fazendas para envio (mesma lógica do cadastro)
        const farmsData = farms
            .map(farm => ({
                name: farm.name?.trim() || '',
                city: farm.city?.trim() || '',
                state: farm.state?.trim() || '',
                total_area: farm.total_area?.toString() || '0',
                arable_area: farm.arable_area?.toString() || '0',
                vegetation_area: farm.vegetation_area?.toString() || '0',
                harvests: (farm.harvests || []).map(h => ({
                    year: h.year?.trim() || '',
                    crops: (h.crops || []).filter((c: string) => c && c.trim() !== '').map((c: string) => c.trim())
                })).filter(h => h.year.trim() !== '') // Remove safras sem ano
            }))
            .filter(farm => farm.name.trim() !== '' && farm.city.trim() !== '' && farm.state.trim() !== ''); // Remove fazendas incompletas

        console.log('Dados sendo enviados para edição:', {
            document: data.document,
            document_type: data.document_type,
            name: data.name,
            farms: farmsData
        });

        // Usar router.put diretamente para garantir que os dados sejam enviados corretamente
        router.put(route('admin.producer.edit', { id: selectedProducer.id }), {
            document: data.document,
            document_type: data.document_type,
            name: data.name,
            farms: farmsData
        }, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                reset();
                setFarms([{
                    name: '',
                    city: '',
                    state: '',
                    total_area: '',
                    arable_area: '',
                    vegetation_area: '',
                    harvests: []
                }]);
                setIsEditModalOpen(false);
                setIsEditing(false);
                setSelectedProducer(null);
            },
            onError: (errors) => {
                console.error('Erro ao editar produtor:', errors);
                console.error('Dados enviados:', {
                    document: data.document,
                    document_type: data.document_type,
                    name: data.name,
                    farms: farmsData
                });
            }
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.dashboard.producer'), {
            page,
            search,
            per_page: itemsPerPage
        }, { preserveState: true });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        router.get(route('admin.dashboard.producer'), {
            page: 1,
            search,
            per_page: newItemsPerPage
        }, { preserveState: true });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.dashboard.producer'), {
                search,
                per_page: itemsPerPage
            }, { preserveState: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const headers = [
        { title: 'Documento', field: 'document', sortable: false },
        { title: 'Tipo', field: 'document_type', sortable: false },
        { title: 'Nome', field: 'name', sortable: false },
        { title: 'Fazendas', field: 'farms_count', sortable: false },
        { title: 'Ações', field: undefined, sortable: false }
    ];

    const formatDocument = (document: string, type: string) => {
        const cleaned = document.replace(/\D/g, '');
        if (type === 'CPF') {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
    };

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen p-6">
                <Container>
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary mb-2">Produtores Rurais</h1>
                            <p className="text-secondary70">Gerencie o cadastro de produtores e suas propriedades</p>
                        </div>
                        <Button
                            onClick={() => {
                                reset();
                                setFarms([{
                                    name: '',
                                    city: '',
                                    state: '',
                                    total_area: '',
                                    arable_area: '',
                                    vegetation_area: '',
                                    harvests: []
                                }]);
                                setIsAddModalOpen(true);
                            }}
                            className="flex items-center gap-2"
                        >
                            <Icon icon="mdi:account-plus" className="w-5 h-5" />
                            Adicionar Produtor
                        </Button>
                    </div>

                    {/* Busca */}
                    <div className="mb-6">
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nome ou documento..."
                        />
                    </div>

                    {/* Tabela */}
                    <div className="overflow-x-auto">
                        <CompleteTable
                            headers={headers}
                            currentPage={producers.current_page}
                            lastPage={producers.last_page}
                            handleItemsPerPageChange={handleItemsPerPageChange}
                            handlePageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                        >
                            <tbody>
                                {producers.data?.map((producer, index) => (
                                    <tr
                                        key={producer.id}
                                        className={`hover:bg-gray-100 text-gray-600 gap-4 text-sm ${
                                            index !== producers.data.length - 1 ? 'border-b border-gray-200' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-4">
                                            {formatDocument(producer.document, producer.document_type)}
                                        </td>
                                        <td className="px-4 py-4">{producer.document_type}</td>
                                        <td className="px-4 py-4 font-medium">{producer.name}</td>
                                        <td className="px-4 py-4">{producer.farms_count || 0}</td>
                                        <td className="px-2 py-2 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Icon
                                                    icon="material-symbols:more-vert"
                                                    className="w-6 h-6 rounded-full cursor-pointer hover:bg-gray-100"
                                                    onClick={() => setMenuOpen(menuOpen === index ? null : index)}
                                                />
                                                <div className={`z-50`}>
                                                    {menuOpen === index && (
                                                        <ActionAdminPopup
                                                            onView={() => router.visit(route('admin.dashboard.producer.detail', { id: producer.id }))}
                                                            onEdit={() => handleEditProducer(producer)}
                                                            onDelete={() => handleDeleteProducer(producer)}
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

                    {/* Modal Adicionar - FORMULÁRIO COMPLETO */}
                    <DynamicModal
                        isOpen={isAddModalOpen}
                        onClose={() => {
                            reset();
                            setFarms([{
                                name: '',
                                city: '',
                                state: '',
                                total_area: '',
                                arable_area: '',
                                vegetation_area: '',
                                harvests: []
                            }]);
                            setIsAddModalOpen(false);
                        }}
                        title="Adicionar Produtor"
                    >
                        <Form validationErrors={errors} onSubmit={submitAddProducer}>
                            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                                {/* Dados do Produtor */}
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Produtor</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de Documento
                                            </label>
                                            <select
                                                value={data.document_type}
                                                onChange={(e) => setData('document_type', e.target.value as 'CPF' | 'CNPJ')}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="CPF">CPF</option>
                                                <option value="CNPJ">CNPJ</option>
                                            </select>
                                            {errors.document_type && (
                                                <p className="mt-1 text-sm text-red-500">{errors.document_type}</p>
                                            )}
                                        </div>

                                        <InputPopUpAdmin
                                            label="Documento"
                                            value={data.document}
                                            onChange={(e) => setData('document', e.target.value)}
                                            errorMessage={errors.document}
                                            placeholder={data.document_type === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                                        />

                                        <InputPopUpAdmin
                                            label="Nome do Produtor"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            errorMessage={errors.name}
                                            placeholder="Nome completo"
                                        />
                                    </div>
                                </div>

                                {/* Fazendas */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Fazendas</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addFarm}
                                            className="text-sm"
                                        >
                                            <Icon icon="mdi:plus" className="w-4 h-4 mr-1" />
                                            Adicionar Fazenda
                                        </Button>
                                    </div>

                                    {farms.map((farm, farmIndex) => (
                                        <div key={farmIndex} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-medium text-gray-700">Fazenda {farmIndex + 1}</h4>
                                                {farms.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="cancel"
                                                        onClick={() => removeFarm(farmIndex)}
                                                        className="text-sm"
                                                    >
                                                        <Icon icon="mdi:delete" className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <InputPopUpAdmin
                                                    label="Nome da Fazenda"
                                                    value={farm.name}
                                                    onChange={(e) => updateFarm(farmIndex, 'name', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.name`]}
                                                    placeholder="Nome da propriedade"
                                                />

                                                <InputPopUpAdmin
                                                    label="Cidade"
                                                    value={farm.city}
                                                    onChange={(e) => updateFarm(farmIndex, 'city', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.city`]}
                                                    placeholder="Cidade"
                                                />

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Estado
                                                    </label>
                                                    <select
                                                        value={farm.state}
                                                        onChange={(e) => updateFarm(farmIndex, 'state', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {states.map(state => (
                                                            <option key={state} value={state}>{state}</option>
                                                        ))}
                                                    </select>
                                                    {errors[`farms.${farmIndex}.state`] && (
                                                        <p className="mt-1 text-sm text-red-500">{errors[`farms.${farmIndex}.state`]}</p>
                                                    )}
                                                </div>

                                                <InputPopUpAdmin
                                                    label="Área Total (hectares)"
                                                    type="number"
                                                    step="0.01"
                                                    value={farm.total_area}
                                                    onChange={(e) => updateFarm(farmIndex, 'total_area', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.total_area`]}
                                                    placeholder="0.00"
                                                />

                                                <InputPopUpAdmin
                                                    label="Área Agricultável (hectares)"
                                                    type="number"
                                                    step="0.01"
                                                    value={farm.arable_area}
                                                    onChange={(e) => updateFarm(farmIndex, 'arable_area', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.arable_area`]}
                                                    placeholder="0.00"
                                                />

                                                <InputPopUpAdmin
                                                    label="Área de Vegetação (hectares)"
                                                    type="number"
                                                    step="0.01"
                                                    value={farm.vegetation_area}
                                                    onChange={(e) => updateFarm(farmIndex, 'vegetation_area', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.vegetation_area`]}
                                                    placeholder="0.00"
                                                />

                                                {farm.vegetation_area && farm.arable_area && farm.total_area && (
                                                    parseFloat(farm.arable_area) + parseFloat(farm.vegetation_area) > parseFloat(farm.total_area) && (
                                                        <p className="text-sm text-red-500">
                                                            A soma das áreas agricultável e vegetação não pode ultrapassar a área total
                                                        </p>
                                                    )
                                                )}

                                                {/* Safras */}
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="font-medium text-gray-700">Safras</h5>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => addHarvest(farmIndex)}
                                                            className="text-xs"
                                                        >
                                                            <Icon icon="mdi:plus" className="w-3 h-3 mr-1" />
                                                            Adicionar Safra
                                                        </Button>
                                                    </div>

                                                    {farm.harvests.map((harvest, harvestIndex) => (
                                                        <div key={harvestIndex} className="mb-3 p-3 bg-white rounded border border-gray-200">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-sm font-medium text-gray-600">Safra {harvestIndex + 1}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="cancel"
                                                                    onClick={() => removeHarvest(farmIndex, harvestIndex)}
                                                                    className="text-xs"
                                                                >
                                                                    <Icon icon="mdi:delete" className="w-3 h-3" />
                                                                </Button>
                                                            </div>

                                                            <InputPopUpAdmin
                                                                label="Ano da Safra"
                                                                value={harvest.year}
                                                                onChange={(e) => updateHarvestYear(farmIndex, harvestIndex, e.target.value)}
                                                                errorMessage={errors[`farms.${farmIndex}.harvests.${harvestIndex}.year`]}
                                                                placeholder="Ex: 2024"
                                                            />

                                                            <div className="mt-2">
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Culturas
                                                                </label>
                                                                <div className="space-y-2">
                                                                    {harvest.crops.map((crop, cropIndex) => (
                                                                        <div key={cropIndex} className="flex items-center gap-2">
                                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                                                {crop}
                                                                            </span>
                                                                            <Button
                                                                                type="button"
                                                                                variant="cancel"
                                                                                onClick={() => removeCrop(farmIndex, harvestIndex, cropIndex)}
                                                                                className="text-xs p-1"
                                                                            >
                                                                                <Icon icon="mdi:close" className="w-3 h-3" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Nome da cultura (ex: Soja)"
                                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    e.preventDefault();
                                                                                    const input = e.target as HTMLInputElement;
                                                                                    if (input.value.trim()) {
                                                                                        addCrop(farmIndex, harvestIndex, input.value.trim());
                                                                                        input.value = '';
                                                                                    }
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            onClick={(e) => {
                                                                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                                                if (input?.value.trim()) {
                                                                                    addCrop(farmIndex, harvestIndex, input.value.trim());
                                                                                    input.value = '';
                                                                                }
                                                                            }}
                                                                            className="text-xs"
                                                                        >
                                                                            <Icon icon="mdi:plus" className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(errors.farms || (typeof errors.farms === 'string' && errors.farms)) && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {typeof errors.farms === 'string' ? errors.farms : 'Erro ao cadastrar fazendas'}
                                        </p>
                                    )}
                                    
                                    {/* Erros gerais não relacionados a campos específicos */}
                                    {Object.keys(errors).filter(key => !key.includes('.') && !['document', 'document_type', 'name', 'farms'].includes(key)).map(key => (
                                        <p key={key} className="mt-2 text-sm text-red-500">
                                            {errors[key]}
                                        </p>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="cancel"
                                        onClick={() => {
                                            reset();
                                            setFarms([{
                                                name: '',
                                                city: '',
                                                state: '',
                                                total_area: '',
                                                arable_area: '',
                                                vegetation_area: '',
                                                harvests: []
                                            }]);
                                            setIsAddModalOpen(false);
                                        }}
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </DynamicModal>

                    {/* Modal Editar - FORMULÁRIO COMPLETO */}
                    <DynamicModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            reset();
                            setFarms([{
                                name: '',
                                city: '',
                                state: '',
                                total_area: '',
                                arable_area: '',
                                vegetation_area: '',
                                harvests: []
                            }]);
                            setIsEditModalOpen(false);
                            setIsEditing(false);
                            setSelectedProducer(null);
                        }}
                        title="Editar Produtor"
                    >
                        <Form validationErrors={errors} onSubmit={submitEditProducer}>
                            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                                {/* Dados do Produtor */}
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Produtor</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de Documento
                                            </label>
                                            <select
                                                value={data.document_type}
                                                onChange={(e) => setData('document_type', e.target.value as 'CPF' | 'CNPJ')}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="CPF">CPF</option>
                                                <option value="CNPJ">CNPJ</option>
                                            </select>
                                            {errors.document_type && (
                                                <p className="mt-1 text-sm text-red-500">{errors.document_type}</p>
                                            )}
                                        </div>

                                        <InputPopUpAdmin
                                            label="Documento"
                                            value={data.document}
                                            onChange={(e) => setData('document', e.target.value)}
                                            errorMessage={errors.document}
                                            placeholder={data.document_type === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                                        />

                                        <InputPopUpAdmin
                                            label="Nome do Produtor"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            errorMessage={errors.name}
                                            placeholder="Nome completo"
                                        />
                                    </div>
                                </div>

                                {/* Fazendas */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Fazendas</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addFarm}
                                            className="text-sm"
                                        >
                                            <Icon icon="mdi:plus" className="w-4 h-4 mr-1" />
                                            Adicionar Fazenda
                                        </Button>
                                    </div>

                                    {farms.map((farm, farmIndex) => (
                                        <div key={farmIndex} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-medium text-gray-700">Fazenda {farmIndex + 1}</h4>
                                                {farms.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="cancel"
                                                        onClick={() => removeFarm(farmIndex)}
                                                        className="text-sm"
                                                    >
                                                        <Icon icon="mdi:delete" className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <InputPopUpAdmin
                                                    label="Nome da Fazenda"
                                                    value={farm.name}
                                                    onChange={(e) => updateFarm(farmIndex, 'name', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.name`]}
                                                    placeholder="Nome da propriedade"
                                                />

                                                <InputPopUpAdmin
                                                    label="Cidade"
                                                    value={farm.city}
                                                    onChange={(e) => updateFarm(farmIndex, 'city', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.city`]}
                                                    placeholder="Cidade"
                                                />

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Estado
                                                    </label>
                                                    <select
                                                        value={farm.state}
                                                        onChange={(e) => updateFarm(farmIndex, 'state', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {states.map(state => (
                                                            <option key={state} value={state}>{state}</option>
                                                        ))}
                                                    </select>
                                                    {errors[`farms.${farmIndex}.state`] && (
                                                        <p className="mt-1 text-sm text-red-500">{errors[`farms.${farmIndex}.state`]}</p>
                                                    )}
                                                </div>

                                                <InputPopUpAdmin
                                                    label="Área Total (hectares)"
                                                    type="number"
                                                    step="0.01"
                                                    value={farm.total_area}
                                                    onChange={(e) => updateFarm(farmIndex, 'total_area', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.total_area`]}
                                                    placeholder="0.00"
                                                />

                                                <InputPopUpAdmin
                                                    label="Área Agricultável (hectares)"
                                                    type="number"
                                                    step="0.01"
                                                    value={farm.arable_area}
                                                    onChange={(e) => updateFarm(farmIndex, 'arable_area', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.arable_area`]}
                                                    placeholder="0.00"
                                                />

                                                <InputPopUpAdmin
                                                    label="Área de Vegetação (hectares)"
                                                    type="number"
                                                    step="0.01"
                                                    value={farm.vegetation_area}
                                                    onChange={(e) => updateFarm(farmIndex, 'vegetation_area', e.target.value)}
                                                    errorMessage={errors[`farms.${farmIndex}.vegetation_area`]}
                                                    placeholder="0.00"
                                                />

                                                {farm.vegetation_area && farm.arable_area && farm.total_area && (
                                                    parseFloat(farm.arable_area) + parseFloat(farm.vegetation_area) > parseFloat(farm.total_area) && (
                                                        <p className="text-sm text-red-500">
                                                            A soma das áreas agricultável e vegetação não pode ultrapassar a área total
                                                        </p>
                                                    )
                                                )}

                                                {/* Safras */}
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="font-medium text-gray-700">Safras</h5>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => addHarvest(farmIndex)}
                                                            className="text-xs"
                                                        >
                                                            <Icon icon="mdi:plus" className="w-3 h-3 mr-1" />
                                                            Adicionar Safra
                                                        </Button>
                                                    </div>

                                                    {farm.harvests.map((harvest, harvestIndex) => (
                                                        <div key={harvestIndex} className="mb-3 p-3 bg-white rounded border border-gray-200">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-sm font-medium text-gray-600">Safra {harvestIndex + 1}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="cancel"
                                                                    onClick={() => removeHarvest(farmIndex, harvestIndex)}
                                                                    className="text-xs"
                                                                >
                                                                    <Icon icon="mdi:delete" className="w-3 h-3" />
                                                                </Button>
                                                            </div>

                                                            <InputPopUpAdmin
                                                                label="Ano da Safra"
                                                                value={harvest.year}
                                                                onChange={(e) => updateHarvestYear(farmIndex, harvestIndex, e.target.value)}
                                                                errorMessage={errors[`farms.${farmIndex}.harvests.${harvestIndex}.year`]}
                                                                placeholder="Ex: 2024"
                                                            />

                                                            <div className="mt-2">
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Culturas
                                                                </label>
                                                                <div className="space-y-2">
                                                                    {harvest.crops.map((crop, cropIndex) => (
                                                                        <div key={cropIndex} className="flex items-center gap-2">
                                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                                                {crop}
                                                                            </span>
                                                                            <Button
                                                                                type="button"
                                                                                variant="cancel"
                                                                                onClick={() => removeCrop(farmIndex, harvestIndex, cropIndex)}
                                                                                className="text-xs p-1"
                                                                            >
                                                                                <Icon icon="mdi:close" className="w-3 h-3" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Nome da cultura (ex: Soja)"
                                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    e.preventDefault();
                                                                                    const input = e.target as HTMLInputElement;
                                                                                    if (input.value.trim()) {
                                                                                        addCrop(farmIndex, harvestIndex, input.value.trim());
                                                                                        input.value = '';
                                                                                    }
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            onClick={(e) => {
                                                                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                                                if (input?.value.trim()) {
                                                                                    addCrop(farmIndex, harvestIndex, input.value.trim());
                                                                                    input.value = '';
                                                                                }
                                                                            }}
                                                                            className="text-xs"
                                                                        >
                                                                            <Icon icon="mdi:plus" className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Erros gerais */}
                                {Object.keys(errors).filter(key => !key.includes('.')).length > 0 && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                                        {Object.keys(errors)
                                            .filter(key => !key.includes('.'))
                                            .map(key => (
                                                <p key={key} className="mt-2 text-sm text-red-500">
                                                    {errors[key]}
                                                </p>
                                            ))}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="cancel"
                                        onClick={() => {
                                            reset();
                                            setFarms([{
                                                name: '',
                                                city: '',
                                                state: '',
                                                total_area: '',
                                                arable_area: '',
                                                vegetation_area: '',
                                                harvests: []
                                            }]);
                                            setIsEditModalOpen(false);
                                            setIsEditing(false);
                                            setSelectedProducer(null);
                                        }}
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </DynamicModal>

                    {/* Modal Excluir */}
                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={onDeleteAction}
                        message={deleteMessage}
                    />
                </Container>
            </div>
        </AdminLayout>
    );
}
