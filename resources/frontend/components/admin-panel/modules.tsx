import { DynamicModal } from '@/components/admin-panel/dynamic-modal-admin';
import SortableList from '@/components/admin-panel/sortable-list';

import { DeleteModal } from '@/components/admin-panel/delete-modal';
import { Content, Lesson, Module, Quiz } from '@/types';
import { Icon } from '@iconify/react/dist/iconify.js';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../common/button';
import { InputPopUpAdmin } from '../common/field';
import { Form } from '../common/form';

interface IFormData {
    name: string;
    description: string;
    cover: File[];
    // modules: Module[];
}

interface IFormDataModule {
    name: string;
    course_id: string;
    order: number;
    lessons: Lesson[];
}

type FormDataContent = {
    id?: string;
    name: string;
    content: string;
};

interface IFormDataLesson {
    name: string;
    description: string | null;
    video: string;
    module_id: string;
    order?: number;
    contents: FormDataContent[];
}

const tabs: any = [
    { id: 'info', label: 'Informações', icon: 'mdi:information-outline' },
    { id: 'modules', label: 'Módulos', icon: 'mdi:folder-outline' },
    { id: 'requirements', label: 'Pré-requisitos', icon: 'mdi:account-check-outline' }
];

export default function ModulesTab({ course }: any) {
    // Quiz
    const [isDeleteQuizModalOpen, setIsDeleteQuizModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz>();
    const { get: getQuiz, delete: deleteQuiz } = useForm({});
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [moduleAction, setModuleAction] = useState<'add' | 'edit'>('add');
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [lessonAction, setLessonAction] = useState<'add' | 'edit'>('add');
    const [modules, setModules] = useState(course.modules);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isOrderLessonModalOpen, setIsOrderLessonModalOpen] = useState(false);

    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
    const [isDeleteModuleModalOpen, setIsDeleteModuleModalOpen] = useState(false);
    const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);

    const createQuiz = (module: Module) => {
        getQuiz(route('admin.dashboard.quiz.save', { course_id: course.id, module_id: module.id }));
    };

    const handleEditQuiz = (quiz: Quiz) => {
        window.location.href = route('admin.dashboard.quiz.detail', {
            course_id: course.id,
            module_id: quiz.module_id,
            id: quiz.id
        });
    };

    const handleDeleteQuiz = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setIsDeleteQuizModalOpen(true);
    };

    const submitDeleteQuiz = () => {
        if (!selectedQuiz) return;

        deleteQuiz(route('admin.quiz.delete', { id: selectedQuiz.id }), {
            onSuccess: () => {
                setIsDeleteQuizModalOpen(false);
            },
            onError: (errors) => console.log(errors)
        });
    };

    const saveModuleOrder = () => {
        const orderedModules = modules.map((module: any) => ({ id: module.id }));

        router.post(
            route('admin.module.reorder'),
            { order: orderedModules },
            {
                preserveScroll: true,
                onSuccess: (response) => {
                    if (response.props && Array.isArray(response.props.modules)) {
                        setModules(response.props.modules); // Atualiza a lista com a ordem correta
                    } else {
                        console.error('Erro: Resposta inesperada ao salvar ordem dos módulos', response);
                    }
                    setIsOrderModalOpen(false); // Fecha o modal ao finalizar o salvamento
                },
                onError: (errors) => console.log(errors)
            }
        );
    };

    const saveLessonOrder = () => {
        const orderedLessons = lessons?.flatMap((lesson) => ({ id: lesson.id }));

        router.post(
            route('admin.lesson.reorder'),
            { order: orderedLessons },
            {
                onSuccess: () => {
                    console.log('Ordem salva com sucesso!');
                    setIsOrderLessonModalOpen(false); // Fecha o modal ao finalizar o salvamento
                },
                onError: (errors) => console.log(errors)
            }
        );
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Module
    const {
        data: dataModule,
        setData: setDataModule,
        post: postModule,
        put: putModule,
        delete: deleteModule,
        errors: errorsModule
    } = useForm({
        name: '',
        course_id: course.id,
        order: 0,
        lessons: []
    } as IFormDataModule);

    const openModuleModal = (module?: Module) => {
        setSelectedModule(module || null);
        setDataModule('name', module?.name || '');
        setModuleAction(module ? 'edit' : 'add');
        setIsModuleModalOpen(true);
    };

    const submitModule = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        postModule(route('admin.module.save'), {
            onSuccess: (response) => {
                setIsModuleModalOpen(false); // Fecha o modal

                if (response.props && Array.isArray(response.props.modules)) {
                    if (response.props && Array.isArray(response.props.modules)) {
                        setModules(response.props.modules); // Atualiza a lista com os novos módulos
                    } else {
                        console.error('Erro: Resposta inesperada ao atualizar os módulos', response);
                    }
                } else {
                    console.error('Resposta inesperada:', response);
                }
            },

            onError: (errors) => console.log(errors)
        });
    };

    const submitEditModule = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!selectedModule) return;
        putModule(route('admin.module.edit', { id: selectedModule.id }), {
            onSuccess: () => {
                setIsModuleModalOpen(false); // FECHA O MODAL
            },
            onError: (errors) => console.log(errors)
        });
    };

    const handleDeleteModule = (module: any) => {
        setSelectedModule(module);
        setIsDeleteModuleModalOpen(true);
    };

    const submitDeleteModule = () => {
        if (!selectedModule) return;
        deleteModule(route('admin.module.delete', { id: selectedModule.id }), {
            onSuccess: () => {
                setIsDeleteModuleModalOpen(false);
            },
            onError: (errors) => console.log(errors)
        });
    };

    const { errors } = useForm({
        name: course.name,
        description: course.description,
        cover: []
    } as IFormData);

    const {
        data: dataLesson,
        setData: setDataLesson,
        post: postLesson,
        put: putLesson,
        delete: deleteLesson,
        reset: resetLesson,
        errors: errorsLesson
    } = useForm({
        name: '',
        description: null,
        video: '',
        module_id: '',
        contents: []
    } as IFormDataLesson);

    const openLessonModal = (module: Module, lesson?: Lesson) => {
        if (lesson) {
            setDataLesson({
                name: lesson.name,
                description: lesson.description || '',
                video: lesson.video,
                module_id: lesson.module_id,
                contents: lesson.contents.map(
                    (item: Content): FormDataContent => ({
                        id: item.id,
                        name: item.name || '',
                        content: item.content
                    })
                )
            });
        } else {
            resetLesson();
            setDataLesson('module_id', module.id); // GARANTE QUE O MÓDULO ESTÁ SENDO SETADO CORRETAMENTE!
        }

        setSelectedLesson(lesson || null);
        setLessonAction(lesson ? 'edit' : 'add');
        setIsLessonModalOpen(true);
    };

    const submitLesson = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!dataLesson.module_id) {
            console.error('Erro: `module_id` não está definido!', dataLesson);
            return;
        }

        postLesson(route('admin.lesson.save'), {
            preserveScroll: true,
            onSuccess: () => {
                resetLesson();
                setIsLessonModalOpen(false);
            },
            onError: (errors) => {
                console.error('Erro ao adicionar aula:', errors);
            }
        });
    };

    const submitEditLesson = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!selectedLesson) return;
        putLesson(route('admin.lesson.edit', { id: selectedLesson.id }), {
            preserveScroll: true,
            onSuccess: () => {
                resetLesson();
                setIsLessonModalOpen(false); // FECHA O MODAL
            },
            onError: (errors) => console.log(errors)
        });
    };

    const handleDeleteLesson = (lesson: any) => {
        setSelectedLesson(lesson);
        setIsDeleteLessonModalOpen(true);
    };

    // Contents
    const handleDeleteContent = (index: number) => {
        const updatedContents = dataLesson.contents.filter((_, i) => i !== index);
        setDataLesson('contents', updatedContents);
    };

    const submitDeleteLesson = () => {
        if (!selectedLesson) return;
        deleteLesson(route('admin.lesson.delete', { id: selectedLesson.id }), {
            onSuccess: () => {
                setIsDeleteLessonModalOpen(false);
            },
            onError: (errors) => console.log(errors)
        });
    };

    const clearModuleErrors = () => {
        Object.keys(errorsModule).forEach((key) => {
            delete errorsModule[key as keyof IFormDataModule];
        });
    };

    const clearLessonErrors = () => {
        Object.keys(errorsLesson).forEach((key) => {
            delete errorsLesson[key as keyof IFormDataLesson];
        });
    };

    return (
        <>
            <div className={`w-full pb-10`}>
                <div className="flex flex-col w-full gap-2 mt-6">
                    {course.modules.map((module: any, moduleIndex: any) => (
                        <div key={module.id} className="p-4 bg-gray-100 border border-gray-300 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h4 className="ml-3 text-lg font-medium select-none">{module.name}</h4>
                                    <Button
                                        size="icon"
                                        variant="none"
                                        className="p-1"
                                        onClick={() => openModuleModal(module)}
                                    >
                                        <Icon
                                            icon="material-symbols-light:edit-square-outline-rounded"
                                            className="w-6 h-6"
                                        />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="none" className="p-1" onClick={() => handleDeleteModule(module)}>
                                        <Icon icon="mdi:trash-can-outline" className="w-6 h-6 text-red-500" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="none"
                                        className="p-1"
                                        onClick={() => toggleModule(module.id)}
                                    >
                                        <Icon
                                            icon="mdi:chevron-right"
                                            className={`w-7 h-7 text-gray-600 transform transition-transform duration-300 ${
                                                expandedModules[module.id] ? 'rotate-90' : ''
                                            }`}
                                        />
                                    </Button>
                                </div>
                            </div>

                            {expandedModules[module.id] && (
                                <>
                                    <div className="flex flex-col gap-2 mt-4">
                                        {module.lessons.map((lesson: any) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center justify-between p-2 px-4 bg-gray-200 border border-gray-300 select-none rounded-2xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon
                                                        className="w-6 h-6 text-gray-400"
                                                        icon="ic:twotone-play-lesson"
                                                    />
                                                    <span>{lesson.name}</span>
                                                    <Button
                                                        size="icon"
                                                        variant="none"
                                                        className="p-1"
                                                        onClick={() => openLessonModal(module, lesson)} // AGORA PASSA O MÓDULO CORRETO!
                                                    >
                                                        <Icon
                                                            icon="material-symbols-light:edit-square-outline-rounded"
                                                            className="w-6 h-6"
                                                        />
                                                    </Button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="none"
                                                        className="p-1"
                                                        onClick={() => handleDeleteLesson(lesson)}
                                                    >
                                                        <Icon
                                                            icon="mdi:trash-can-outline"
                                                            className="w-6 h-6 text-red-500"
                                                        />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {module.quiz && (
                                        <div
                                            key={`${module.id}-quiz`}
                                            className="flex items-center justify-between p-2 px-4 mt-2 border select-none bg-primary/10 border-primary rounded-2xl"
                                        >
                                            <div className="flex items-center gap-3 text-primary">
                                                <Icon className="w-6 h-6" icon="la:puzzle-piece" />
                                                <span className="text-black">Quiz do Módulo</span>
                                                <Button
                                                    size="icon"
                                                    variant="none"
                                                    className="p-1"
                                                    onClick={() => handleEditQuiz(module.quiz)}
                                                >
                                                    <Icon
                                                        icon="material-symbols-light:edit-square-outline-rounded"
                                                        className="w-6 h-6 text-black"
                                                    />
                                                </Button>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="none"
                                                    className="p-1"
                                                    onClick={() => handleDeleteQuiz(module.quiz)}
                                                >
                                                    <Icon
                                                        icon="mdi:trash-can-outline"
                                                        className="w-6 h-6 text-red-500"
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-row justify-between gap-2 mt-4">
                                        <div className="flex flex-row gap-2">
                                            {module.lessons.length > 0 && (
                                                <Button
                                                    onClick={() => {
                                                        setLessons(module.lessons), setIsOrderLessonModalOpen(true);
                                                    }}
                                                    variant="secondary"
                                                    className="gap-2"
                                                >
                                                    <Icon icon="lets-icons:widget-alt-light" className="w-5 h-5" />
                                                    Ordenar Aulas
                                                </Button>
                                            )}
                                            <Button
                                                className="hover:text-gray-500"
                                                variant="outline"
                                                onClick={() => openLessonModal(module)} // AGORA PASSA O MÓDULO CORRETO
                                            >
                                                <Icon icon="bitcoin-icons:plus-filled" className="w-5 h-5 mr-2" />
                                                Adicionar nova aula
                                            </Button>
                                        </div>
                                        {!module.quiz && (
                                            <Button type="button" onClick={() => createQuiz(module)} className="gap-2">
                                                <Icon icon="tabler:puzzle" className="w-5 h-5" />
                                                Adicionar Quiz
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                {Object.keys(errors).some((key) => key.startsWith('modules')) && (
                    <p className="w-full px-2 mt-1 text-xs text-red-500">
                        *
                        {Object.keys(errors)
                            .filter((key) => key.startsWith('modules'))
                            .map((key) => errors[key as keyof typeof errors])
                            .join(', ')}
                    </p>
                )}
                <div className="flex flex-row justify-end gap-2 mt-4">
                    <Button
                        onClick={() => setIsOrderModalOpen(true)} // Abre o modal de ordenar trilhas
                        variant="secondary"
                        className="gap-2"
                    >
                        <Icon icon="lets-icons:widget-alt-light" className="w-5 h-5" />
                        Ordenar Módulos
                    </Button>
                    <Button className=" hover:text-gray-500" variant={'outline'} onClick={() => openModuleModal()}>
                        <Icon icon="bitcoin-icons:plus-filled" className="w-5 h-5 mr-2" /> Adicionar novo módulo
                    </Button>
                </div>
            </div>

            {/* Editar Módulo */}
            <DynamicModal
                isOpen={isModuleModalOpen}
                onClose={() => {
                    setIsModuleModalOpen(false);
                    clearModuleErrors();
                }}
                title={moduleAction === 'add' ? 'Adicionar Módulo' : 'Editar Módulo'}
                footerButtons={
                    <>
                        <Button variant="cancel" size="sm" onClick={() => setIsModuleModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            onClick={moduleAction === 'add' ? submitModule : submitEditModule}
                        >
                            {moduleAction === 'add' ? 'Adicionar' : 'Salvar'}
                        </Button>
                    </>
                }
            >
                <Form onSubmit={moduleAction === 'add' ? submitModule : submitEditModule}>
                    <InputPopUpAdmin
                        label="Nome do Módulo"
                        name="moduleName"
                        placeholder="Digite o nome do módulo"
                        value={dataModule.name}
                        onChange={(e) => setDataModule('name', e.target.value)}
                    />
                </Form>
            </DynamicModal>

            {/* Editar Aula */}
            <DynamicModal
                isOpen={isLessonModalOpen}
                onClose={() => {
                    resetLesson();
                    setIsLessonModalOpen(false);
                    clearLessonErrors();
                }}
                title={lessonAction === 'add' ? 'Adicionar Aula' : 'Editar Aula'}
                footerButtons={
                    <>
                        <Button variant="cancel" size="sm" onClick={() => setIsLessonModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            onClick={lessonAction === 'add' ? submitLesson : submitEditLesson}
                        >
                            {lessonAction === 'add' ? 'Adicionar' : 'Salvar'}
                        </Button>
                    </>
                }
            >
                <Form
                    className="flex flex-col gap-4"
                    onSubmit={lessonAction === 'add' ? submitLesson : submitEditLesson}
                >
                    <InputPopUpAdmin
                        label="Nome da Aula"
                        name="lessonName"
                        value={dataLesson.name}
                        onChange={(e) => setDataLesson('name', e.target.value)}
                        errorMessage={errorsLesson.name}
                    />
                    <InputPopUpAdmin
                        label="Link do Vídeo"
                        name="lessonVideo"
                        value={dataLesson.video}
                        onChange={(e) => setDataLesson('video', e.target.value)}
                        errorMessage={errorsLesson.video}
                    />
                    <InputPopUpAdmin
                        label="Descrição (Opcional)"
                        name="lessonDescription"
                        multiline
                        value={dataLesson.description || ''}
                        onChange={(e) => setDataLesson('description', e.target.value)}
                        errorMessage={errorsLesson.description}
                    />

                    <div className="flex flex-col gap-2">
                        <h4 className="text-base text-black">Materiais complementares</h4>
                        {dataLesson.contents.map((material: FormDataContent, index: number) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 border-[1px] border-gray-300 px-2 py-3 rounded-lg"
                            >
                                <div className="flex flex-row w-full gap-2">
                                    <InputPopUpAdmin
                                        label="Nome do Material"
                                        value={material.name || ''}
                                        onChange={(e) => {
                                            const updatedContents = [...dataLesson.contents];
                                            updatedContents[index].name = e.target.value;
                                            setDataLesson('contents', updatedContents);
                                        }}
                                        errorMessage={
                                            // @ts-ignore
                                            errorsLesson?.[`contents.${index}.name`] || '' // Acessa erro específico de 'name'
                                        }
                                    />
                                    <InputPopUpAdmin
                                        label="Link do Material"
                                        value={material.content || ''}
                                        onChange={(e) => {
                                            const updatedContents = [...dataLesson.contents];
                                            updatedContents[index].content = e.target.value;
                                            setDataLesson('contents', updatedContents);
                                        }}
                                        errorMessage={
                                            // @ts-ignore
                                            errorsLesson?.[`contents.${index}.content`] || '' // Acessa erro específico de 'content'
                                        }
                                    />
                                </div>

                                <Button
                                    variant="none"
                                    size="icon"
                                    type="button"
                                    className="text-red-500"
                                    onClick={() => {
                                        handleDeleteContent(index);
                                    }}
                                >
                                    <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                                setDataLesson('contents', [...dataLesson.contents, { name: '', content: '' }]);
                            }}
                        >
                            <Icon icon="mdi:plus" className="w-5 h-5 mr-2" /> Adicionar Material
                        </Button>
                    </div>
                </Form>
            </DynamicModal>

            <DeleteModal
                isOpen={isDeleteModuleModalOpen}
                onClose={() => setIsDeleteModuleModalOpen(false)}
                onConfirm={() => submitDeleteModule()}
                objectId={selectedModule?.id}
                message={`Tem certeza de que deseja excluir o módulo "${selectedModule?.name}"? Essa ação também removerá permanentemente todas as aulas e o quiz vinculado a este módulo.`}
            />

            <DeleteModal
                isOpen={isDeleteLessonModalOpen}
                onClose={() => setIsDeleteLessonModalOpen(false)}
                onConfirm={() => submitDeleteLesson()}
                objectId={selectedLesson?.id}
                message={`Tem certeza que deseja excluir a aula "${selectedLesson?.name}"?`}
            />

            <DeleteModal
                isOpen={isDeleteQuizModalOpen}
                onClose={() => setIsDeleteQuizModalOpen(false)}
                onConfirm={() => submitDeleteQuiz()}
                objectId={selectedQuiz?.id}
                message={`Tem certeza que deseja excluir o quiz "${selectedQuiz?.title}"?`}
            />

            <DynamicModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                title="Ordenar Módulos"
                footerButtons={
                    <>
                        <Button type="button" variant="cancel" onClick={() => setIsOrderModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={saveModuleOrder}>
                            Salvar Ordem
                        </Button>
                    </>
                }
            >
                <p className="relative inline-flex items-center text-lg text-gray-500 mb- indent-6">
                    <Icon icon="material-symbols:drag-click-rounded" className="absolute w-5 h-5 top-1 text-primary" />
                    Arraste os cards para definir a ordem de exibição dos módulos dentro do curso.
                </p>

                <SortableList<Module> list={modules} setList={setModules} displayProperty="name" />
            </DynamicModal>

            <DynamicModal
                isOpen={isOrderLessonModalOpen}
                onClose={() => setIsOrderLessonModalOpen(false)}
                title="Ordenar Aulas"
                footerButtons={
                    <>
                        <Button type="button" variant="cancel" onClick={() => setIsOrderLessonModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={saveLessonOrder}>
                            Salvar Ordem
                        </Button>
                    </>
                }
            >
                <p className="relative inline-flex items-center text-lg text-gray-500 mb- indent-6">
                    <Icon icon="material-symbols:drag-click-rounded" className="absolute w-5 h-5 top-1 text-primary" />
                    Arraste os cards para definir a ordem de exibição das aulas dentro do módulo.
                </p>

                <SortableList<Lesson> list={lessons} setList={setLessons} displayProperty="name" />
            </DynamicModal>
        </>
    );
}
