import { Button } from '@/components/common/button';
import { Container } from '@/components/common/container';
import { AdminLayout } from '@/layouts/admin-layout';
import { AuthData } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { DynamicModal } from '@/components/admin-panel/dynamic-modal-admin';
import { InputPopUpAdmin } from '@/components/common/field';
import { Form } from '@/components/common/form';
import { useForm } from '@inertiajs/react';

interface Crop {
    id: string;
    name: string;
}

interface Harvest {
    id: string;
    year: string;
    crops?: Crop[];
}

interface Farm {
    id: string;
    name: string;
    city: string;
    state: string;
    total_area: number;
    arable_area: number;
    vegetation_area: number;
    harvests: Harvest[];
}

interface Producer {
    id: string;
    document: string;
    document_type: 'CPF' | 'CNPJ';
    name: string;
    farms: Farm[];
    created_at: string;
    created_by?: string;
    creator?: {
        id: string;
        name: string;
        email: string;
    };
}

export default function DashboardProducerDetail({
    auth,
    producer
}: { auth: AuthData } & { producer: Producer }) {
    const [isAddFarmModalOpen, setIsAddFarmModalOpen] = useState(false);
    const [isFarmsOpen, setIsFarmsOpen] = useState(true);

    const { data, setData, post, reset, errors } = useForm({
        name: '',
        city: '',
        state: '',
        total_area: '',
        arable_area: '',
        vegetation_area: ''
    });

    const formatDocument = (document: string, type: string) => {
        const cleaned = document.replace(/\D/g, '');
        if (type === 'CPF') {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
    };

    const submitAddFarm = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.admin.farm.create', { producerId: producer.id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsAddFarmModalOpen(false);
                router.reload();
            },
            onError: (errors) => {
                console.error('Erro ao criar fazenda:', errors);
            }
        });
    };

    const totalHectares = producer.farms.reduce((sum, farm) => sum + parseFloat(farm.total_area.toString()), 0);
    const totalArable = producer.farms.reduce((sum, farm) => sum + parseFloat(farm.arable_area.toString()), 0);
    const totalVegetation = producer.farms.reduce((sum, farm) => sum + parseFloat(farm.vegetation_area.toString()), 0);

    return (
        <Container noPadding className="px-2 relative max-w-[2000px] m-auto">
            <main className="flex flex-col items-center justify-start px-10 py-8 text-black w-full bg-[#FCFCFC] rounded-3xl overflow-hidden">
                <div className="absolute top-7 left-12">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => router.visit(route('admin.admin.dashboard.producer'))}
                    >
                        <Icon icon="bitcoin-icons:arrow-left-outline" className="w-6 h-6" />
                    </Button>
                </div>

                <h1 className="mb-6 text-2xl text-center text-gray-900 font-raleway">Detalhes do Produtor</h1>

                <div className="flex flex-col gap-5 w-full">
                    {/* Informações do Produtor */}
                    <div className="p-6 rounded-2xl flex flex-col gap-4 border-[1px] border-primary/20 hoverhive bg-white shadow-sm">
                        <h2 className="flex gap-3 items-center pb-3 text-2xl text-gray-900 border-b font-raleway">
                            <Icon icon="mdi:account-circle" className="w-7 h-7 text-black" />
                            Informações do Produtor
                        </h2>
                        <div className="grid flex-1 grid-cols-1 text-base text-gray-600 md:grid-cols-2">
                            <div className="flex gap-2 items-center">
                                <Icon icon="mdi:account" className="w-5 h-5 text-primary/80" />
                                <p className="truncate">
                                    <strong>Nome:</strong> {producer.name}
                                </p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Icon icon="mdi:card-account-details" className="w-5 h-5 text-primary/80" />
                                <p className="truncate">
                                    <strong>Documento:</strong> {formatDocument(producer.document, producer.document_type)} ({producer.document_type})
                                </p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Icon icon="mdi:calendar" className="w-5 h-5 text-primary/80" />
                                <p>
                                    <strong>Cadastro:</strong>{' '}
                                    {producer.created_at && formatDate(producer.created_at)}
                                </p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Icon icon="mdi:farm" className="w-5 h-5 text-primary/80" />
                                <p>
                                    <strong>Total de Fazendas:</strong> {producer.farms.length}
                                </p>
                            </div>

                            {producer.creator && (
                                <div className="flex gap-2 items-center">
                                    <Icon icon="mdi:account-plus" className="w-5 h-5 text-primary/80" />
                                    <p>
                                        <strong>Criado por:</strong> {producer.creator.name} ({producer.creator.email})
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estatísticas Gerais */}
                    <div className="p-6 rounded-2xl flex flex-col gap-4 border-[1px] border-primary/20 hoverhive bg-white shadow-sm">
                        <h2 className="flex gap-3 items-center pb-3 text-2xl text-gray-900 border-b font-raleway">
                            <Icon icon="mdi:chart-bar" className="w-7 h-7 text-black" />
                            Estatísticas Gerais
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base text-gray-600">
                            <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
                                <div className="flex gap-2 items-center">
                                    <Icon icon="mdi:ruler" className="w-5 h-5 text-primary/80" />
                                    <strong>Total de Hectares:</strong>
                                </div>
                                <p className="text-xl font-bold text-primary ml-7">
                                    {totalHectares.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} ha
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
                                <div className="flex gap-2 items-center">
                                    <Icon icon="mdi:seed" className="w-5 h-5 text-primary/80" />
                                    <strong>Área Agricultável:</strong>
                                </div>
                                <p className="text-xl font-bold text-green-600 ml-7">
                                    {totalArable.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} ha
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
                                <div className="flex gap-2 items-center">
                                    <Icon icon="mdi:tree" className="w-5 h-5 text-primary/80" />
                                    <strong>Área de Vegetação:</strong>
                                </div>
                                <p className="text-xl font-bold text-emerald-600 ml-7">
                                    {totalVegetation.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} ha
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fazendas */}
                    <div className="p-6 flex-col gap-3 bg-white rounded-2xl border-[1px] border-primary/20 hover:shadow-lg transition-shadow hoverhive">
                        <div className="flex justify-between items-center">
                            <div
                                className="flex justify-between items-center cursor-pointer flex-1"
                                onClick={() => setIsFarmsOpen(!isFarmsOpen)}
                            >
                                <h2 className="flex gap-2 items-center text-2xl text-gray-900 font-raleway">
                                    <Icon icon="mdi:farm" className="w-7 h-7" /> Fazendas
                                </h2>
                                {producer.farms.length > 0 && (
                                    <Icon
                                        icon={isFarmsOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                                        className="w-7 h-7 text-gray-700 transition-transform"
                                    />
                                )}
                            </div>
                        </div>

                        <p className="text-lg text-gray-600">
                            Total de fazendas: <span className="text-primary">{producer.farms.length}</span>
                        </p>

                        {isFarmsOpen && (
                            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                                {producer.farms.length > 0 ? (
                                    producer.farms.map((farm) => (
                                        <div
                                            key={farm.id}
                                            className="p-4 bg-gray-50 rounded-xl shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                                                {farm.name}
                                            </h3>

                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <div className="flex gap-2 items-center">
                                                    <Icon icon="mdi:map-marker" className="w-4 h-4 text-primary/80" />
                                                    <p>
                                                        <strong>Localização:</strong> {farm.city} - {farm.state}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 items-center">
                                                    <Icon icon="mdi:ruler" className="w-4 h-4 text-primary/80" />
                                                    <p>
                                                        <strong>Área Total:</strong>{' '}
                                                        {farm.total_area.toLocaleString('pt-BR', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{' '}
                                                        ha
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 items-center">
                                                    <Icon icon="mdi:seed" className="w-4 h-4 text-green-600" />
                                                    <p>
                                                        <strong>Agricultável:</strong>{' '}
                                                        {farm.arable_area.toLocaleString('pt-BR', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{' '}
                                                        ha
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 items-center">
                                                    <Icon icon="mdi:tree" className="w-4 h-4 text-emerald-600" />
                                                    <p>
                                                        <strong>Vegetação:</strong>{' '}
                                                        {farm.vegetation_area.toLocaleString('pt-BR', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{' '}
                                                        ha
                                                    </p>
                                                </div>
                                            </div>

                                            {farm.harvests.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <p className="mb-2 text-sm font-medium text-gray-700">Safras:</p>
                                                    <div className="space-y-2">
                                                        {farm.harvests.map((harvest) => (
                                                            <div key={harvest.id} className="p-2 bg-white rounded border border-gray-200">
                                                                <p className="mb-1 font-medium text-gray-800">
                                                                    Safra {harvest.year}
                                                                </p>
                                                                {harvest.crops && harvest.crops.length > 0 ? (
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {harvest.crops.map((crop, idx) => (
                                                                            <span key={crop.id || idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded inline-block">
                                                                                {crop.name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400 italic text-xs">Sem culturas</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full p-4 text-center text-gray-500 bg-gray-50 rounded-xl">
                                        Nenhuma fazenda cadastrada
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Adicionar Fazenda */}
                <DynamicModal
                    isOpen={isAddFarmModalOpen}
                    onClose={() => {
                        reset();
                        setIsAddFarmModalOpen(false);
                    }}
                    title="Adicionar Fazenda"
                >
                    <Form validationErrors={errors} onSubmit={submitAddFarm}>
                        <div className="space-y-4">
                            <InputPopUpAdmin
                                label="Nome da Fazenda"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                errorMessage={errors.name}
                                placeholder="Nome da propriedade"
                            />

                            <InputPopUpAdmin
                                label="Cidade"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                errorMessage={errors.city}
                                placeholder="Cidade"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado
                                </label>
                                <select
                                    value={data.state}
                                    onChange={(e) => setData('state', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="TO">Tocantins</option>
                                </select>
                                {errors.state && (
                                    <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                                )}
                            </div>

                            <InputPopUpAdmin
                                label="Área Total (hectares)"
                                type="number"
                                step="0.01"
                                value={data.total_area}
                                onChange={(e) => setData('total_area', e.target.value)}
                                errorMessage={errors.total_area}
                                placeholder="0.00"
                            />

                            <InputPopUpAdmin
                                label="Área Agricultável (hectares)"
                                type="number"
                                step="0.01"
                                value={data.arable_area}
                                onChange={(e) => setData('arable_area', e.target.value)}
                                errorMessage={errors.arable_area}
                                placeholder="0.00"
                            />

                            <InputPopUpAdmin
                                label="Área de Vegetação (hectares)"
                                type="number"
                                step="0.01"
                                value={data.vegetation_area}
                                onChange={(e) => setData('vegetation_area', e.target.value)}
                                errorMessage={errors.vegetation_area}
                                placeholder="0.00"
                            />

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="cancel"
                                    onClick={() => {
                                        reset();
                                        setIsAddFarmModalOpen(false);
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit">Salvar</Button>
                            </div>
                        </div>
                    </Form>
                </DynamicModal>
            </main>
        </Container>
    );
}

DashboardProducerDetail.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
