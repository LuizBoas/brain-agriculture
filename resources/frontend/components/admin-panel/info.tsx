import { ImageUploaderAdmin } from '@/components/file-area';
import { Course } from '@/types';
import { useForm } from '@inertiajs/react';
import { Button } from '../common/button';
import { InputPopUpAdmin } from '../common/field';
import { Form } from '../common/form';
import { CheckboxAdmin } from './checkbox-admin';

interface Props {
    course: Course;
}

interface IFormData {
    name: string;
    description: string;
    cover: File[];
    has_certificate: boolean;
    workload: string;
    coming_soon: boolean;
    // modules: Module[];
}

export default function CourseInfoTab({ course }: Props) {
    const { data, setData, post, errors } = useForm({
        name: course.name,
        description: course.description,
        cover: [],
        has_certificate: course.has_certificate ?? false,
        workload: course.workload?.toString() ?? '',
        coming_soon: course.coming_soon ?? false
    } as IFormData);

    const submit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        post(route('admin.course.edit', { id: course.id }), {
            onError: (errors) => console.log(errors)
        });
    };

    return (
        <Form className="flex flex-col w-full gap-3 mt-4">
            <InputPopUpAdmin
                name="name"
                type="text"
                label="Nome"
                placeholder="Nome"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                errorMessage={errors.name}
            />
            <InputPopUpAdmin
                label="Descrição"
                name="description"
                type="text"
                placeholder="Descrição"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                errorMessage={errors.description}
            />
            <ImageUploaderAdmin
                label="Imagem"
                maxImages={1}
                onChange={(value: File[]) => setData('cover', value)}
                initialImage={course.cover}
            />
            <CheckboxAdmin
                checkedLabel="Emitir certificado ao finalizar o curso"
                uncheckedLabel="Emitir certificado ao finalizar o curso"
                checked={data.has_certificate}
                noBackground
                onChange={() => {
                    setData('has_certificate', !data.has_certificate);
                }}
            />
            <InputPopUpAdmin
                label="Carga Horária (horas)"
                placeholder="Digite a carga horária em horas"
                type="number"
                value={data.workload}
                onChange={(e) => setData('workload', e.target.value)}
                errorMessage={errors.workload}
            />
            <CheckboxAdmin
                checkedLabel="Configurar para modo 'Em Breve'"
                uncheckedLabel="Configurar para modo 'Em Breve'"
                checked={data.coming_soon}
                noBackground
                onChange={() => {
                    setData('coming_soon', !data.coming_soon);
                }}
            />
            <div className="flex justify-end w-full mt-8">
                <Button type="submit" className="gap-2 text-lg" size={'lg'} onClick={submit}>
                    Salvar Informações
                </Button>
            </div>
        </Form>
    );
}
