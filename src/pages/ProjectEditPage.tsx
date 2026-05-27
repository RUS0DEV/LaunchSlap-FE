import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ProjectForm,
  type ProjectFormValues,
} from '@/entities/project/ui/ProjectForm';
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useUploadProjectImageMutation,
} from '@/features/projects/api/projectsApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Skeleton } from '@/shared/ui/Skeleton';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';

export default function ProjectEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useGetProjectByIdQuery(id, {
    skip: !id,
  });
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadProjectImageMutation();

  usePageTitle(project?.name ? `Редактировать ${project.name}` : 'Редактировать');

  const handleSubmit = async ({ imageFile, ...values }: ProjectFormValues) => {
    try {
      await updateProject({ id, ...values }).unwrap();

      if (imageFile) {
        await uploadImage({ projectId: id, file: imageFile }).unwrap();
      }

      toast.success('Проект обновлён');
      navigate('/dashboard');
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError));
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <DashboardSidebar />
      <section>
        <Card className="p-6">
          <h1 className="text-2xl font-semibold text-gray-950">
            Редактировать проект
          </h1>
          <div className="mt-6">
            {isLoading ? <Skeleton className="h-[640px]" /> : null}
            {error ? <ErrorState description={getApiErrorMessage(error)} /> : null}
            {project ? (
              <ProjectForm
                mode="edit"
                initialValues={project}
                isSubmitting={isUpdating || isUploading}
                onSubmit={handleSubmit}
              />
            ) : null}
          </div>
        </Card>
      </section>
    </div>
  );
}
