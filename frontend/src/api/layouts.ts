import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface ContentBlock {
  id: number;
  block_type: string;
  order: number;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  image_alt?: string;
  video_url?: string;
  link_url?: string;
  link_text?: string;
  link_target?: string;
  icon_name?: string;
  icon_color?: string;
  metadata?: any;
  is_visible: boolean;
}

export interface Section {
  id: number;
  section_type: string;
  section_type_display: string;
  title?: string;
  subtitle?: string;
  order: number;
  background_type: string;
  background_type_display: string;
  background_color?: string;
  background_image?: string;
  padding_top: number;
  padding_bottom: number;
  is_full_width: boolean;
  is_visible: boolean;
  metadata?: Record<string, any>;
  content_blocks: ContentBlock[];
}

export interface PageLayout {
  id: number;
  name: string;
  display_name: string;
  layout_type: string;
  layout_type_display: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sections: Section[];
}

export const layoutsApi = {
  getAllLayouts: async (): Promise<PageLayout[]> => {
    const response = await axios.get<PageLayout[]>(`${API_BASE_URL}/layouts/`);
    return response.data;
  },

  getLayout: async (layoutId: number): Promise<PageLayout> => {
    const response = await axios.get<PageLayout>(`${API_BASE_URL}/layouts/${layoutId}/`);
    return response.data;
  },

  getLayoutWithSections: async (layoutId: number): Promise<PageLayout> => {
    const response = await axios.get<PageLayout>(`${API_BASE_URL}/layouts/${layoutId}/with_sections/`);
    return response.data;
  },

  createLayout: async (data: Partial<PageLayout>): Promise<PageLayout> => {
    const response = await axios.post<PageLayout>(`${API_BASE_URL}/layouts/`, data);
    return response.data;
  },

  updateLayout: async (layoutId: number, data: Partial<PageLayout>): Promise<PageLayout> => {
    const response = await axios.patch<PageLayout>(`${API_BASE_URL}/layouts/${layoutId}/`, data);
    return response.data;
  },

  deleteLayout: async (layoutId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/layouts/${layoutId}/`);
  },

  getSections: async (layoutId?: number): Promise<Section[]> => {
    const url = layoutId 
      ? `${API_BASE_URL}/sections/?layout_id=${layoutId}`
      : `${API_BASE_URL}/sections/`;
    const response = await axios.get<Section[]>(url);
    return response.data;
  },

  createSection: async (data: Partial<Section>): Promise<Section> => {
    const response = await axios.post<Section>(`${API_BASE_URL}/sections/`, data);
    return response.data;
  },

  updateSection: async (sectionId: number, data: Partial<Section>): Promise<Section> => {
    const response = await axios.patch<Section>(`${API_BASE_URL}/sections/${sectionId}/`, data);
    return response.data;
  },

  deleteSection: async (sectionId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/sections/${sectionId}/`);
  },

  getContentBlocks: async (sectionId?: number): Promise<ContentBlock[]> => {
    const url = sectionId
      ? `${API_BASE_URL}/blocks/?section_id=${sectionId}`
      : `${API_BASE_URL}/blocks/`;
    const response = await axios.get<ContentBlock[]>(url);
    return response.data;
  },

  createContentBlock: async (data: Partial<ContentBlock>): Promise<ContentBlock> => {
    const response = await axios.post<ContentBlock>(`${API_BASE_URL}/blocks/`, data);
    return response.data;
  },

  updateContentBlock: async (blockId: number, data: Partial<ContentBlock>): Promise<ContentBlock> => {
    const response = await axios.patch<ContentBlock>(`${API_BASE_URL}/blocks/${blockId}/`, data);
    return response.data;
  },

  deleteContentBlock: async (blockId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/blocks/${blockId}/`);
  },

  // Page management
  getPages: async (): Promise<any[]> => {
    const response = await axios.get<any[]>(`${API_BASE_URL}/pages/all_pages/`);
    return response.data as any[];
  },

  createPage: async (data: { title: string; slug: string; content?: string; is_published?: boolean }): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/pages/`, data);
    return response.data;
  },

  assignLayoutToPage: async (pageId: number, layoutId: number): Promise<any> => {
    const response = await axios.patch(`${API_BASE_URL}/pages/${pageId}/`, {
      layout: layoutId
    });
    return response.data;
  },

  removeLayoutFromPage: async (pageId: number): Promise<any> => {
    const response = await axios.patch(`${API_BASE_URL}/pages/${pageId}/`, {
      layout: null
    });
    return response.data;
  },

  getTrashedPages: async (): Promise<any[]> => {
    const response = await axios.get<any[]>(`${API_BASE_URL}/pages/trashed/`);
    return response.data as any[];
  },

  trashPage: async (pageId: number): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/pages/${pageId}/trash/`);
    return response.data;
  },

  restorePage: async (pageId: number): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/pages/${pageId}/restore/`);
    return response.data;
  },

  emptyTrash: async (): Promise<any> => {
    const response = await axios.delete(`${API_BASE_URL}/pages/empty_trash/`);
    return response.data;
  },

  deletePage: async (pageId: number): Promise<any> => {
    const response = await axios.delete(`${API_BASE_URL}/pages/${pageId}/`);
    return response.data;
  }
};
