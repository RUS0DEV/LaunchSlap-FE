import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ProjectForm,
  type ProjectFormValues,
} from '@/entities/project/ui/ProjectForm';
import {
  useCreateProjectMutation,
  useUploadProjectImageMutation,
} from '@/features/projects/api/projectsApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Card } from '@/shared/ui/Card';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';

export default function ProjectCreatePage() {
  usePageTitle('Добавить проект');
  const navigate = useNavigate();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadProjectImageMutation();

  const handleSubmit = async ({ imageFile, ...values }: ProjectFormValues) => {
    try {
      const project = await createProject(values).unwrap();

      if (imageFile) {
        await uploadImage({ projectId: project.id, file: imageFile }).unwrap();
      }

      toast.success('Проект создан');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <DashboardSidebar />
      <section>
        <Card className="p-6">
          <h1 className="text-2xl font-semibold text-gray-950">
            Добавить проект
          </h1>
          <div className="mt-6">
            <ProjectForm
              mode="create"
              isSubmitting={isCreating || isUploading}
              onSubmit={handleSubmit}
            />
          </div>
        </Card>
      </section>
    </div>
  );
}
