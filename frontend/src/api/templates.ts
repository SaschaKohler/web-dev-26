import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface DesignTemplate {
  id: number;
  name: string;
  display_name: string;
  description: string;
  preview_image?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  heading_font: string;
  border_radius: number;
  spacing_unit: number;
  header_style: string;
  footer_style: string;
  button_style: string;
  card_shadow: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  site_tagline: string;
  logo_url?: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  active_template?: number;
  active_template_details?: DesignTemplate;
  decade_theme_id?: string;
  custom_css: string;
  custom_js: string;
  updated_at: string;
}

export const templatesApi = {
  getAllTemplates: async (): Promise<DesignTemplate[]> => {
    const response = await axios.get<DesignTemplate[]>(`${API_BASE_URL}/templates/`);
    return response.data;
  },

  getActiveTemplate: async (): Promise<DesignTemplate> => {
    const response = await axios.get<DesignTemplate>(`${API_BASE_URL}/templates/active/`);
    return response.data;
  },

  activateTemplate: async (templateId: number): Promise<DesignTemplate> => {
    const response = await axios.post<{ status: string; template: DesignTemplate }>(`${API_BASE_URL}/templates/${templateId}/activate/`);
    return response.data.template;
  },

  updateTemplate: async (templateId: number, data: Partial<DesignTemplate>): Promise<DesignTemplate> => {
    const response = await axios.patch<DesignTemplate>(`${API_BASE_URL}/templates/${templateId}/`, data);
    return response.data;
  },

  getSiteSettings: async (): Promise<SiteSettings> => {
    const response = await axios.get<SiteSettings>(`${API_BASE_URL}/settings/current/`);
    return response.data;
  },

  updateSiteSettings: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    const response = await axios.patch<SiteSettings>(`${API_BASE_URL}/settings/update_current/`, data);
    return response.data;
  },

  setDecadeTheme: async (themeId: string): Promise<SiteSettings> => {
    const response = await axios.patch<SiteSettings>(`${API_BASE_URL}/settings/update_current/`, {
      decade_theme_id: themeId
    });
    return response.data;
  }
};
