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


export default function DashboardProducer({
    auth,
    producers
}: PagePropsData & ProducerPagination) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState<number | null>(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        document: '',
        document_type: 'CPF' as 'CPF' | 'CNPJ',
        name: ''
    });


    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(producers.per_page);

    const { delete: deleteProducer } = useForm();

    const handleDeleteProducer = (producer: Producer) => {
        setSelectedProducer(producer);
        setDeleteMessage(`Tem certeza que deseja excluir o produtor "${producer.name}"? Todas as fazendas associadas também serão excluídas.`);
        setOnDeleteAction(() => () => {
            deleteProducer(route('admin.admin.producer.delete', { id: producer.id }), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                }
            });
        });
        setIsDeleteModalOpen(true);
    };

    const [onDeleteAction, setOnDeleteAction] = useState<() => void>(() => () => {});


    const handleEditProducer = (producer: Producer) => {
        setSelectedProducer(producer);
        setData({
            document: producer.document,
            document_type: producer.document_type,
            name: producer.name
        });
        setIsEditModalOpen(true);
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove todos os caracteres não numéricos
        const numericValue = e.target.value.replace(/\D/g, '');
        
        // Define o limite baseado no tipo de documento
        const maxLength = data.document_type === 'CPF' ? 11 : 14;
        
        // Limita o tamanho
        const limitedValue = numericValue.slice(0, maxLength);
        
        setData('document', limitedValue);
    };

    // Helper para pegar a primeira mensagem de erro (caso seja array)
    const getErrorMessage = (field: keyof typeof errors): string | undefined => {
        const error = errors[field];
        if (!error) return undefined;
        if (Array.isArray(error)) return error[0];
        return error as string;
    };

    // Limita o documento quando o tipo de documento mudar
    useEffect(() => {
        if (data.document) {
            const numericValue = data.document.replace(/\D/g, '');
            const maxLength = data.document_type === 'CPF' ? 11 : 14;
            const limitedValue = numericValue.slice(0, maxLength);
            if (limitedValue !== data.document) {
                setData('document', limitedValue);
            }
        }
    }, [data.document_type]);

    const submitAddProducer = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('admin.admin.producer.create'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsAddModalOpen(false);
            }
        });
    };

    const submitEditProducer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProducer) return;

        put(route('admin.admin.producer.edit', { id: selectedProducer.id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsEditModalOpen(false);
                setSelectedProducer(null);
            }
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.admin.dashboard.producer'), {
            page,
            search,
            per_page: itemsPerPage
        }, { preserveState: true });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        router.get(route('admin.admin.dashboard.producer'), {
            page: 1,
            search,
            per_page: newItemsPerPage
        }, { preserveState: true });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.admin.dashboard.producer'), {
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

    return (
        <AdminLayout>
            <div className="min-h-screen p-0 md:p-6">
                <Container>
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Produtores Rurais</h1>
                            <p className="text-sm md:text-base text-secondary70">Gerencie o cadastro de produtores e suas propriedades</p>
                        </div>
                        <Button
                            onClick={() => {
                                reset();
                                setIsAddModalOpen(true);
                            }}
                            className="flex items-center gap-2 w-full md:w-auto justify-center"
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
                                        <td className="px-2 md:px-4 py-2 md:py-4">
                                            {formatDocument(producer.document, producer.document_type)}
                                        </td>
                                        <td className="px-2 md:px-4 py-2 md:py-4">{producer.document_type}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-4 font-medium">{producer.name}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-4">{producer.farms_count || 0}</td>
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
                                                            onView={() => router.visit(route('admin.admin.dashboard.producer.detail', { id: producer.id }))}
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

                    {/* Modal Adicionar - APENAS DADOS DO PRODUTOR */}
                    <DynamicModal
                        isOpen={isAddModalOpen}
                        onClose={() => {
                            reset();
                            setIsAddModalOpen(false);
                        }}
                        title="Adicionar Produtor"
                    >
                        <Form validationErrors={errors} onSubmit={submitAddProducer}>
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
                                    {getErrorMessage('document_type') && (
                                        <p className="mt-1 text-sm text-red-500">{getErrorMessage('document_type')}</p>
                                    )}
                                </div>

                                <InputPopUpAdmin
                                    label="Documento"
                                    value={data.document}
                                    onChange={handleDocumentChange}
                                    errorMessage={getErrorMessage('document')}
                                    placeholder={data.document_type === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                                    maxLength={data.document_type === 'CPF' ? 11 : 14}
                                />

                                <InputPopUpAdmin
                                    label="Nome do Produtor"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    errorMessage={getErrorMessage('name')}
                                    placeholder="Nome completo"
                                />

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="cancel"
                                        onClick={() => {
                                            reset();
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

                    {/* Modal Editar - APENAS DADOS DO PRODUTOR */}
                    <DynamicModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            reset();
                            setIsEditModalOpen(false);
                            setSelectedProducer(null);
                        }}
                        title="Editar Produtor"
                    >
                        <Form validationErrors={errors} onSubmit={submitEditProducer}>
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
                                    {getErrorMessage('document_type') && (
                                        <p className="mt-1 text-sm text-red-500">{getErrorMessage('document_type')}</p>
                                    )}
                                </div>

                                <InputPopUpAdmin
                                    label="Documento"
                                    value={data.document}
                                    onChange={handleDocumentChange}
                                    errorMessage={getErrorMessage('document')}
                                    placeholder={data.document_type === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                                    maxLength={data.document_type === 'CPF' ? 11 : 14}
                                />

                                <InputPopUpAdmin
                                    label="Nome do Produtor"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    errorMessage={getErrorMessage('name')}
                                    placeholder="Nome completo"
                                />

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="cancel"
                                        onClick={() => {
                                            reset();
                                            setIsEditModalOpen(false);
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
