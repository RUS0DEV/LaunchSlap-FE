import type { Promotion } from '@/entities/promotion/model/types';

export type ProjectCategory =
  | 'saas'
  | 'web_app'
  | 'mobile_app'
  | 'ai_tool'
  | 'ecommerce'
  | 'education'
  | 'other';

export interface Project {
  id: string;
  user_id: string;
  user_email?: string;
  name: string;
  description: string;
  url: string;
  image_url: string;
  category: ProjectCategory;
  tags: string[];
  contact?: string | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  is_featured?: boolean;
  active_promotion?: Promotion | null;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  category?: ProjectCategory | string;
  tags?: string[];
}

export interface CreateProjectDto {
  name: string;
  description: string;
  url: string;
  category: ProjectCategory;
  tags?: string[];
  contact?: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  id: string;
}

export interface UploadImageDto {
  projectId: string;
  file: File;
}

export interface ImageUploadResponse {
  image_url: string;
}
