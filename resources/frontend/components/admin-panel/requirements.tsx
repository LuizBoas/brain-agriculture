import { Course } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../common/button';
import DynamicSelection from './dynamic-selection';

interface Props {
    course: Course;
    courses: { data: Course[] };
    requirements: Course[];
}

interface IRequirementsFormData {
    course_id?: string;
    requirements_id?: string[];
    course: Course | null;
    requirements: Course[];
}

export default function RequirementsTab({ course, courses, requirements }: Props) {
    const [search, setSearch] = useState('');

    const {
        data: requirementsData,
        setData: setRequirementsData,
        post: requirementsPost,
        errors: requirementsErrors,
        transform
    } = useForm<IRequirementsFormData>({
        course: course,
        requirements: requirements
    });

    transform((data) => ({
        course_id: data.course?.id,
        requirement_id: data.requirements.flatMap((course) => course.id),
        course: null,
        requirements: []
    }));

    const handleUserSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);
        router.get(
            `/admin/dashboard/course/${course.id}`,
            { page: 1, per_page: 10, search: search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const submitRequirements = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        console.log('testeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', requirementsData);
        console.log(course, courses, requirements);

        requirementsPost(route('admin.requirements.save'), {
            preserveScroll: true,
            onError: (errors) => console.log(errors)
        });
    };

    return (
        <>
            <div className={`w-full`}>
                <DynamicSelection
                    searchValue={search}
                    onSearchChange={(e) => handleUserSearchChange(e)}
                    placeholder="Selecione os pré-requisitos..."
                    items={courses.data}
                    selectedItems={requirementsData.requirements}
                    onItemSelect={(course) =>
                        setRequirementsData('requirements', [...requirementsData.requirements, course])
                    }
                    onItemRemove={(course) =>
                        setRequirementsData(
                            'requirements',
                            requirementsData.requirements.filter((c) => c.id !== course.id)
                        )
                    }
                    displayProperty="name"
                    emptyMessage="Nenhum curso encontrado"
                    addMessage="Adicione os cursos para matrícula"
                    errors={requirementsErrors.requirements_id}
                />
            </div>
            <div className="flex justify-end w-full mt-8">
                <Button type="submit" className="gap-2 text-lg" size={'lg'} onClick={submitRequirements}>
                    Salvar Pré-Requisitos
                </Button>
            </div>
        </>
    );
}
