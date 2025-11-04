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
import { Form } from '@/components/common/form';
import { ActionAdminPopup } from '@/components/admin-panel/action-admin-popup';
import { CitySelect, Select } from '@/components/common/form-fields';
import { getStatesForSelect } from '@/data/geographic-data';

interface Crop {
    id: string;
    name: string;
}

interface Harvest {
    id: string;
    year: string;
    crops: Crop[];
}

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
    harvests?: Harvest[];
    harvests_count?: number;
}

interface Producer {
    id: string;
    name: string;
    document: string;
    document_type: string;
}

interface FarmPagination {
    farms: {
        data: Farm[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    producers?: Producer[];
}

export default function DashboardFarm({
    farms,
    producers = []
}: FarmPagination) {
    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(farms.per_page);
    const [isAddFarmModalOpen, setIsAddFarmModalOpen] = useState(false);
    const [isEditFarmModalOpen, setIsEditFarmModalOpen] = useState(false);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [editHarvests, setEditHarvests] = useState<Array<{ year: string; crops: string[] }>>([]);
    const [addHarvests, setAddHarvests] = useState<Array<{ year: string; crops: string[] }>>([]);
    const [producerIdError, setProducerIdError] = useState<string | undefined>(undefined);

    // Form para adicionar fazenda
    const { data: addFarmData, setData: setAddFarmData, post: postFarm, reset: resetAddFarm, errors: addFarmErrors, processing: processingAddFarm } = useForm({
        producer_id: '',
        name: '',
        city: '',
        state: '',
        total_area: '',
        arable_area: '',
        vegetation_area: '',
        harvests: [] as Array<{ year: string; crops: string[] }>
    });

    // Form para editar fazenda
    const { data: editFarmData, setData: setEditFarmData, put: putFarm, reset: resetEditFarm, errors: editFarmErrors, processing: processingFarm } = useForm({
        name: '',
        city: '',
        state: '',
        total_area: '',
        arable_area: '',
        vegetation_area: '',
        harvests: [] as Array<{ year: string; crops: string[] }>
    });

    // Helper para pegar a primeira mensagem de erro (caso seja array)
    const getErrorMessage = (errors: any, field: string): string | undefined => {
        const error = errors[field];
        if (!error) return undefined;
        if (Array.isArray(error)) return error[0];
        return error as string;
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.admin.dashboard.farm'), {
            page,
            search,
            per_page: itemsPerPage
        }, { preserveState: true });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        router.get(route('admin.admin.dashboard.farm'), {
            page: 1,
            search,
            per_page: newItemsPerPage
        }, { preserveState: true });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.admin.dashboard.farm'), {
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
        { title: 'Ações', field: 'actions', sortable: false }
    ];

    const handleEditFarm = (farm: Farm) => {
        setSelectedFarm(farm);
        
        // Preparar safras para edição
        const harvestsData = farm.harvests && farm.harvests.length > 0
            ? farm.harvests.map(h => ({
                year: h.year,
                crops: h.crops?.map(c => c.name) || []
            }))
            : [];
        
        setEditHarvests(harvestsData);
        
        setEditFarmData({
            name: farm.name,
            city: farm.city,
            state: farm.state,
            total_area: farm.total_area.toString(),
            arable_area: farm.arable_area.toString(),
            vegetation_area: farm.vegetation_area.toString(),
            harvests: harvestsData
        });
        
        setIsEditFarmModalOpen(true);
    };

    const submitEditFarm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFarm) return;
        
        const harvestsData = editHarvests.map(h => ({
            year: h.year,
            crops: h.crops.filter(c => c.trim() !== '').map(c => c.trim())
        })).filter(h => h.year.trim() !== '' && h.crops.length > 0);

        // Usar router.put diretamente para garantir que os dados sejam enviados
        router.put(route('admin.admin.farm.edit', { producerId: selectedFarm.producer.id, farmId: selectedFarm.id }), {
            ...editFarmData,
            harvests: harvestsData
        }, {
            preserveScroll: false,
            onSuccess: () => {
                resetEditFarm();
                setEditHarvests([]);
                setIsEditFarmModalOpen(false);
                setSelectedFarm(null);
                router.reload();
            },
            onError: (errors) => {
                console.error('Erro ao atualizar fazenda:', errors);
            }
        });
    };

    const handleAddFarm = () => {
        setAddHarvests([]);
        setProducerIdError(undefined);
        setIsAddFarmModalOpen(true);
    };

    const submitAddFarm = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar se o produtor foi selecionado antes de enviar
        if (!addFarmData.producer_id || addFarmData.producer_id.trim() === '') {
            setProducerIdError('Selecione um produtor');
            return;
        }
        
        // Limpar erro se o produtor foi selecionado
        setProducerIdError(undefined);
        
        const harvestsData = addHarvests.map(h => ({
            year: h.year,
            crops: h.crops.filter(c => c.trim() !== '').map(c => c.trim())
        })).filter(h => h.year.trim() !== '' && h.crops.length > 0);

        // Atualizar os dados do formulário com as safras antes de enviar
        setAddFarmData('harvests', harvestsData);

        // Usar o método post do useForm para que os erros sejam automaticamente capturados
        postFarm(route('admin.admin.farm.create', { producerId: addFarmData.producer_id }), {
            preserveScroll: true,
            onSuccess: () => {
                resetAddFarm();
                setAddHarvests([]);
                setIsAddFarmModalOpen(false);
                setProducerIdError(undefined);
                // O backend já redireciona para a tela de detalhes do produtor
            }
        });
    };

    // Funções para gerenciar safras na edição
    const addEditHarvest = () => {
        setEditHarvests([...editHarvests, { year: '', crops: [] }]);
    };

    const removeEditHarvest = (index: number) => {
        setEditHarvests(editHarvests.filter((_, i) => i !== index));
    };

    const updateEditHarvestYear = (index: number, year: string) => {
        const newHarvests = [...editHarvests];
        newHarvests[index].year = year;
        setEditHarvests(newHarvests);
    };

    const addEditCrop = (harvestIndex: number) => {
        const newHarvests = [...editHarvests];
        newHarvests[harvestIndex].crops.push('');
        setEditHarvests(newHarvests);
    };

    const removeEditCrop = (harvestIndex: number, cropIndex: number) => {
        const newHarvests = [...editHarvests];
        newHarvests[harvestIndex].crops = newHarvests[harvestIndex].crops.filter((_, i) => i !== cropIndex);
        setEditHarvests(newHarvests);
    };

    const updateEditCrop = (harvestIndex: number, cropIndex: number, value: string) => {
        const newHarvests = [...editHarvests];
        newHarvests[harvestIndex].crops[cropIndex] = value;
        setEditHarvests(newHarvests);
    };

    // Funções para gerenciar safras na adição
    const addAddHarvest = () => {
        setAddHarvests([...addHarvests, { year: '', crops: [] }]);
    };

    const removeAddHarvest = (index: number) => {
        setAddHarvests(addHarvests.filter((_, i) => i !== index));
    };

    const updateAddHarvestYear = (index: number, year: string) => {
        const newHarvests = [...addHarvests];
        newHarvests[index].year = year;
        setAddHarvests(newHarvests);
    };

    const addAddCrop = (harvestIndex: number) => {
        const newHarvests = [...addHarvests];
        newHarvests[harvestIndex].crops.push('');
        setAddHarvests(newHarvests);
    };

    const removeAddCrop = (harvestIndex: number, cropIndex: number) => {
        const newHarvests = [...addHarvests];
        newHarvests[harvestIndex].crops = newHarvests[harvestIndex].crops.filter((_, i) => i !== cropIndex);
        setAddHarvests(newHarvests);
    };

    const updateAddCrop = (harvestIndex: number, cropIndex: number, value: string) => {
        const newHarvests = [...addHarvests];
        newHarvests[harvestIndex].crops[cropIndex] = value;
        setAddHarvests(newHarvests);
    };


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
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary mb-2">Fazendas</h1>
                            <p className="text-secondary70">Visualize todas as fazendas cadastradas</p>
                        </div>
                        <Button onClick={handleAddFarm} className="flex items-center gap-2">
                            <Icon icon="mdi:plus" className="w-5 h-5" />
                            Adicionar Fazenda
                        </Button>
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
                                {farms.data?.map((farm: Farm, index: number) => (
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
                                                            onEdit={() => handleEditFarm(farm)}
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

                    {/* Modal Adicionar Fazenda */}
                    <DynamicModal
                        isOpen={isAddFarmModalOpen}
                        onClose={() => {
                            resetAddFarm();
                            setAddHarvests([]);
                            setProducerIdError(undefined);
                            setIsAddFarmModalOpen(false);
                        }}
                        title="Adicionar Fazenda"
                    >
                        <Form validationErrors={addFarmErrors} onSubmit={submitAddFarm}>
                            <div className="space-y-4">
                                <Select
                                    label="Produtor *"
                                    value={addFarmData.producer_id}
                                    onChange={(value) => {
                                        setAddFarmData('producer_id', value);
                                        // Limpar erro quando o usuário selecionar um produtor
                                        if (value) {
                                            setProducerIdError(undefined);
                                        }
                                    }}
                                    options={[
                                        { value: '', label: 'Selecione um produtor...' },
                                        ...producers.map((producer: Producer) => ({
                                            value: producer.id,
                                            label: `${producer.name} - ${formatDocument(producer.document, producer.document_type)}`
                                        }))
                                    ]}
                                    placeholder="Buscar produtor..."
                                    searchable={true}
                                    variant="light"
                                    errorMessage={producerIdError || getErrorMessage(addFarmErrors, 'producer_id')}
                                />

                                <InputPopUpAdmin
                                    label="Nome da Fazenda"
                                    value={addFarmData.name}
                                    onChange={(e) => setAddFarmData('name', e.target.value)}
                                    errorMessage={getErrorMessage(addFarmErrors, 'name')}
                                    placeholder="Nome da propriedade"
                                />

                                <Select
                                    label="Estado"
                                    value={addFarmData.state}
                                    onChange={(value) => {
                                        setAddFarmData('state', value);
                                        // Limpar cidade quando o estado mudar
                                        setAddFarmData('city', '');
                                    }}
                                    errorMessage={getErrorMessage(addFarmErrors, 'state')}
                                    options={getStatesForSelect()}
                                    hideDefaultWhenOpen={true}
                                    variant="light"
                                />

                                <CitySelect
                                    label="Cidade"
                                    state={addFarmData.state}
                                    value={addFarmData.city}
                                    onChange={(value) => setAddFarmData('city', value)}
                                    errorMessage={getErrorMessage(addFarmErrors, 'city')}
                                />

                                <InputPopUpAdmin
                                    label="Área Total (hectares)"
                                    type="number"
                                    step="0.01"
                                    value={addFarmData.total_area}
                                    onChange={(e) => setAddFarmData('total_area', e.target.value)}
                                    errorMessage={getErrorMessage(addFarmErrors, 'total_area')}
                                    placeholder="0.00"
                                />

                                <InputPopUpAdmin
                                    label="Área Agricultável (hectares)"
                                    type="number"
                                    step="0.01"
                                    value={addFarmData.arable_area}
                                    onChange={(e) => setAddFarmData('arable_area', e.target.value)}
                                    errorMessage={getErrorMessage(addFarmErrors, 'arable_area')}
                                    placeholder="0.00"
                                />

                                <InputPopUpAdmin
                                    label="Área de Vegetação (hectares)"
                                    type="number"
                                    step="0.01"
                                    value={addFarmData.vegetation_area}
                                    onChange={(e) => setAddFarmData('vegetation_area', e.target.value)}
                                    errorMessage={getErrorMessage(addFarmErrors, 'vegetation_area')}
                                    placeholder="0.00"
                                />

                                {/* Safras */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Safras
                                        </label>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={addAddHarvest}
                                            className="text-xs"
                                        >
                                            <Icon icon="mdi:plus" className="w-4 h-4" />
                                            Adicionar Safra
                                        </Button>
                                    </div>

                                    {addHarvests.map((harvest, harvestIndex) => (
                                        <div key={harvestIndex} className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Safra {harvestIndex + 1}</span>
                                                <Button
                                                    type="button"
                                                    variant="cancel"
                                                    onClick={() => removeAddHarvest(harvestIndex)}
                                                    className="text-xs px-2 py-1"
                                                >
                                                    <Icon icon="mdi:delete" className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                <InputPopUpAdmin
                                                    label="Ano da Safra"
                                                    value={harvest.year}
                                                    onChange={(e) => updateAddHarvestYear(harvestIndex, e.target.value)}
                                                    placeholder="Ex: 2024"
                                                />
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="block text-xs font-medium text-gray-700">Culturas</label>
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() => addAddCrop(harvestIndex)}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            <Icon icon="mdi:plus" className="w-3 h-3" />
                                                            Adicionar
                                                        </Button>
                                                    </div>
                                                    {harvest.crops.map((crop, cropIndex) => (
                                                        <div key={cropIndex} className="flex gap-2 mb-2">
                                                            <InputPopUpAdmin
                                                                value={crop}
                                                                onChange={(e) => updateAddCrop(harvestIndex, cropIndex, e.target.value)}
                                                                placeholder="Ex: Soja, Milho"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="cancel"
                                                                onClick={() => removeAddCrop(harvestIndex, cropIndex)}
                                                                className="px-3"
                                                            >
                                                                <Icon icon="mdi:delete" className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="cancel"
                                        onClick={() => {
                                            resetAddFarm();
                                            setAddHarvests([]);
                                            setIsAddFarmModalOpen(false);
                                        }}
                                        disabled={processingAddFarm}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processingAddFarm}>
                                        {processingAddFarm ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </DynamicModal>

                    {/* Modal Editar Fazenda */}
                    <DynamicModal
                        isOpen={isEditFarmModalOpen}
                        onClose={() => {
                            resetEditFarm();
                            setEditHarvests([]);
                            setIsEditFarmModalOpen(false);
                            setSelectedFarm(null);
                        }}
                        title="Editar Fazenda"
                    >
                        <Form validationErrors={editFarmErrors} onSubmit={submitEditFarm}>
                            <div className="space-y-4">
                                <InputPopUpAdmin
                                    label="Nome da Fazenda"
                                    value={editFarmData.name}
                                    onChange={(e) => setEditFarmData('name', e.target.value)}
                                    errorMessage={getErrorMessage(editFarmErrors, 'name')}
                                    placeholder="Nome da propriedade"
                                />

                                <Select
                                    label="Estado"
                                    value={editFarmData.state}
                                    onChange={(value) => {
                                        setEditFarmData('state', value);
                                        // Limpar cidade quando o estado mudar
                                        setEditFarmData('city', '');
                                    }}
                                    errorMessage={getErrorMessage(editFarmErrors, 'state')}
                                    options={getStatesForSelect()}
                                    hideDefaultWhenOpen={true}
                                    variant="light"
                                />

                                <CitySelect
                                    label="Cidade"
                                    state={editFarmData.state}
                                    value={editFarmData.city}
                                    onChange={(value) => setEditFarmData('city', value)}
                                    errorMessage={getErrorMessage(editFarmErrors, 'city')}
                                />

                                <InputPopUpAdmin
                                    label="Área Total (hectares)"
                                    type="number"
                                    step="0.01"
                                    value={editFarmData.total_area}
                                    onChange={(e) => setEditFarmData('total_area', e.target.value)}
                                    errorMessage={getErrorMessage(editFarmErrors, 'total_area')}
                                    placeholder="0.00"
                                />

                                <InputPopUpAdmin
                                    label="Área Agricultável (hectares)"
                                    type="number"
                                    step="0.01"
                                    value={editFarmData.arable_area}
                                    onChange={(e) => setEditFarmData('arable_area', e.target.value)}
                                    errorMessage={getErrorMessage(editFarmErrors, 'arable_area')}
                                    placeholder="0.00"
                                />

                                <InputPopUpAdmin
                                    label="Área de Vegetação (hectares)"
                                    type="number"
                                    step="0.01"
                                    value={editFarmData.vegetation_area}
                                    onChange={(e) => setEditFarmData('vegetation_area', e.target.value)}
                                    errorMessage={getErrorMessage(editFarmErrors, 'vegetation_area')}
                                    placeholder="0.00"
                                />

                                {/* Safras */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Safras
                                        </label>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={addEditHarvest}
                                            className="text-xs"
                                        >
                                            <Icon icon="mdi:plus" className="w-4 h-4" />
                                            Adicionar Safra
                                        </Button>
                                    </div>

                                    {editHarvests.map((harvest, harvestIndex) => (
                                        <div key={harvestIndex} className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Safra {harvestIndex + 1}</span>
                                                <Button
                                                    type="button"
                                                    variant="cancel"
                                                    onClick={() => removeEditHarvest(harvestIndex)}
                                                    className="text-xs px-2 py-1"
                                                >
                                                    <Icon icon="mdi:delete" className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                <InputPopUpAdmin
                                                    label="Ano da Safra"
                                                    value={harvest.year}
                                                    onChange={(e) => updateEditHarvestYear(harvestIndex, e.target.value)}
                                                    placeholder="Ex: 2024"
                                                />
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="block text-xs font-medium text-gray-700">Culturas</label>
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() => addEditCrop(harvestIndex)}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            <Icon icon="mdi:plus" className="w-3 h-3" />
                                                            Adicionar
                                                        </Button>
                                                    </div>
                                                    {harvest.crops.map((crop, cropIndex) => (
                                                        <div key={cropIndex} className="flex gap-2 mb-2">
                                                            <InputPopUpAdmin
                                                                value={crop}
                                                                onChange={(e) => updateEditCrop(harvestIndex, cropIndex, e.target.value)}
                                                                placeholder="Ex: Soja, Milho"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="cancel"
                                                                onClick={() => removeEditCrop(harvestIndex, cropIndex)}
                                                                className="px-3"
                                                            >
                                                                <Icon icon="mdi:delete" className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="cancel"
                                        onClick={() => {
                                            resetEditFarm();
                                            setEditHarvests([]);
                                            setIsEditFarmModalOpen(false);
                                            setSelectedFarm(null);
                                        }}
                                        disabled={processingFarm}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processingFarm}>
                                        {processingFarm ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </DynamicModal>
                </Container>
            </div>
        </AdminLayout>
    );
}
