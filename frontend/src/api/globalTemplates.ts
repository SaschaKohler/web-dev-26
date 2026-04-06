import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface NavigationItem {
  id: number;
  label: string;
  url: string;
  order: number;
  parent: number | null;
  icon_name?: string;
  is_external: boolean;
  is_visible: boolean;
  children?: NavigationItem[];
}

export interface GlobalTemplate {
  id: number;
  name: string;
  display_name: string;
  template_type: 'header' | 'navigation' | 'footer';
  logo_url?: string;
  logo_alt?: string;
  style?: string;
  background_color?: string;
  text_color?: string;
  show_social_links: boolean;
  show_contact_info: boolean;
  custom_html?: string;
  custom_css?: string;
  metadata?: any;
  is_active: boolean;
  nav_items: NavigationItem[];
}

export interface SiteSettings {
  id: number;
  site_name: string;
  site_tagline?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  active_template?: number;
  custom_css?: string;
  custom_js?: string;
}

export const globalTemplatesApi = {
  getAll: async (): Promise<GlobalTemplate[]> => {
    const response = await axios.get<GlobalTemplate[]>(`${API_BASE_URL}/global-templates/`);
    return response.data;
  },

  getById: async (id: number): Promise<GlobalTemplate> => {
    const response = await axios.get<GlobalTemplate>(`${API_BASE_URL}/global-templates/${id}/`);
    return response.data;
  },

  getHeader: async (): Promise<GlobalTemplate> => {
    const response = await axios.get<GlobalTemplate>(`${API_BASE_URL}/global-templates/header/`);
    return response.data;
  },

  getNavigation: async (): Promise<GlobalTemplate> => {
    const response = await axios.get<GlobalTemplate>(`${API_BASE_URL}/global-templates/navigation/`);
    return response.data;
  },

  getFooter: async (): Promise<GlobalTemplate> => {
    const response = await axios.get<GlobalTemplate>(`${API_BASE_URL}/global-templates/footer/`);
    return response.data;
  },

  create: async (data: Partial<GlobalTemplate>): Promise<GlobalTemplate> => {
    const response = await axios.post<GlobalTemplate>(`${API_BASE_URL}/global-templates/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<GlobalTemplate>): Promise<GlobalTemplate> => {
    const response = await axios.patch<GlobalTemplate>(`${API_BASE_URL}/global-templates/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/global-templates/${id}/`);
  },
};

export const siteSettingsApi = {
  getCurrent: async (): Promise<SiteSettings> => {
    const response = await axios.get<SiteSettings>(`${API_BASE_URL}/settings/current/`);
    return response.data;
  },

  updateCurrent: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    const response = await axios.patch<SiteSettings>(`${API_BASE_URL}/settings/update_current/`, data);
    return response.data;
  },
};
