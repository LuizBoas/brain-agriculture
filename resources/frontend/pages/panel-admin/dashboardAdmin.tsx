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

interface Admin {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

interface AdminPagination {
    admins: {
        data: Admin[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function DashboardAdmin({
    auth,
    admins
}: PagePropsData & AdminPagination) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState<number | null>(null);

    const { data, setData, post, reset, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        reset: resetEditForm,
        errors: editErrors,
        processing: editingProcessing
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(admins.per_page);

    const { delete: deleteAdmin } = useForm();

    const handleDeleteAdmin = (admin: Admin) => {
        setSelectedAdmin(admin);
        setDeleteMessage(`Tem certeza que deseja excluir o administrador "${admin.name}"?`);
        setOnDeleteAction(() => () => {
            deleteAdmin(route('admin.delete', { id: admin.id }), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                }
            });
        });
        setIsDeleteModalOpen(true);
    };

    const [onDeleteAction, setOnDeleteAction] = useState<() => void>(() => () => {});

    const handleEditAdmin = (admin: Admin) => {
        setSelectedAdmin(admin);
        setEditData({
            name: admin.name,
            email: admin.email,
            password: '',
            password_confirmation: '',
        });
        setIsEditModalOpen(true);
    };

    const submitAddAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('admin.create'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsAddModalOpen(false);
            },
            onError: (errors) => {
                console.error('Erro ao criar administrador:', errors);
            }
        });
    };

    const submitEditAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdmin) return;

        putEdit(route('admin.edit', { id: selectedAdmin.id }), {
            preserveScroll: true,
            onSuccess: () => {
                resetEditForm();
                setIsEditModalOpen(false);
                setSelectedAdmin(null);
            },
            onError: (errors) => {
                console.error('Erro ao editar administrador:', errors);
            }
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.dashboard.admin'), {
            page,
            search,
            per_page: itemsPerPage
        }, { preserveState: true });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        router.get(route('admin.dashboard.admin'), {
            page: 1,
            search,
            per_page: newItemsPerPage
        }, { preserveState: true });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.dashboard.admin'), {
                search,
                per_page: itemsPerPage
            }, { preserveState: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const headers = [
        { title: 'Nome', field: 'name', sortable: false },
        { title: 'Email', field: 'email', sortable: false },
        { title: 'Cadastrado em', field: 'created_at', sortable: false },
        { title: 'Ações', field: undefined, sortable: false }
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen p-6">
                <Container>
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary mb-2">Administradores</h1>
                            <p className="text-secondary70">Gerencie as contas de administradores do sistema</p>
                        </div>
                        <Button
                            onClick={() => {
                                reset();
                                setIsAddModalOpen(true);
                            }}
                            className="flex items-center gap-2"
                        >
                            <Icon icon="mdi:account-plus" className="w-5 h-5" />
                            Adicionar Administrador
                        </Button>
                    </div>

                    {/* Busca */}
                    <div className="mb-6">
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nome ou email..."
                        />
                    </div>

                    {/* Tabela */}
                    <div className="overflow-x-auto">
                        <CompleteTable
                            headers={headers}
                            currentPage={admins.current_page}
                            lastPage={admins.last_page}
                            handleItemsPerPageChange={handleItemsPerPageChange}
                            handlePageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                        >
                            <tbody>
                                {admins.data?.map((admin, index) => (
                                    <tr
                                        key={admin.id}
                                        className={`hover:bg-gray-100 text-gray-600 gap-4 text-sm ${
                                            index !== admins.data.length - 1 ? 'border-b border-gray-200' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-4 font-medium">{admin.name}</td>
                                        <td className="px-4 py-4">{admin.email}</td>
                                        <td className="px-4 py-4">
                                            {new Date(admin.created_at).toLocaleDateString('pt-BR')}
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
                                                            onEdit={() => handleEditAdmin(admin)}
                                                            onDelete={() => handleDeleteAdmin(admin)}
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

                    {/* Modal Adicionar */}
                    <DynamicModal
                        isOpen={isAddModalOpen}
                        onClose={() => {
                            reset();
                            setIsAddModalOpen(false);
                        }}
                        title="Adicionar Administrador"
                    >
                        <Form validationErrors={errors} onSubmit={submitAddAdmin}>
                            <div className="space-y-4">
                                <InputPopUpAdmin
                                    label="Nome"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    errorMessage={errors.name}
                                    placeholder="Nome completo"
                                />

                                <InputPopUpAdmin
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    errorMessage={errors.email}
                                    placeholder="email@exemplo.com"
                                />

                                <InputPopUpAdmin
                                    label="Senha"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    errorMessage={errors.password}
                                    placeholder="Mínimo 8 caracteres"
                                />

                                <InputPopUpAdmin
                                    label="Confirmar Senha"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    errorMessage={errors.password_confirmation}
                                    placeholder="Digite a senha novamente"
                                />

                                <div className="flex justify-end gap-3 pt-4">
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

                    {/* Modal Editar */}
                    <DynamicModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            resetEditForm();
                            setIsEditModalOpen(false);
                            setSelectedAdmin(null);
                        }}
                        title="Editar Administrador"
                    >
                        <Form validationErrors={editErrors} onSubmit={submitEditAdmin}>
                            <div className="space-y-4">
                                <InputPopUpAdmin
                                    label="Nome"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    errorMessage={editErrors.name}
                                    placeholder="Nome completo"
                                />

                                <InputPopUpAdmin
                                    label="Email"
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData('email', e.target.value)}
                                    errorMessage={editErrors.email}
                                    placeholder="email@exemplo.com"
                                />

                                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                    <p className="text-sm text-blue-800">
                                        Deixe a senha em branco se não quiser alterá-la
                                    </p>
                                </div>

                                <InputPopUpAdmin
                                    label="Nova Senha (opcional)"
                                    type="password"
                                    value={editData.password}
                                    onChange={(e) => setEditData('password', e.target.value)}
                                    errorMessage={editErrors.password}
                                    placeholder="Mínimo 8 caracteres"
                                />

                                <InputPopUpAdmin
                                    label="Confirmar Nova Senha"
                                    type="password"
                                    value={editData.password_confirmation}
                                    onChange={(e) => setEditData('password_confirmation', e.target.value)}
                                    errorMessage={editErrors.password_confirmation}
                                    placeholder="Digite a senha novamente"
                                />

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="cancel"
                                        onClick={() => {
                                            resetEditForm();
                                            setIsEditModalOpen(false);
                                            setSelectedAdmin(null);
                                        }}
                                        disabled={editingProcessing}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={editingProcessing}>
                                        {editingProcessing ? 'Salvando...' : 'Salvar'}
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


