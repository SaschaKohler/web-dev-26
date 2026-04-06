import axios from 'axios';
import { API_BASE_URL } from './config';

export interface DecadeTheme {
  id: number;
  theme_id: string;
  name: string;
  description: string;
  decade: '90s' | '2000s' | '2010s' | '2020s';
  decade_display: string;
  variation: number;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  accent_color: string;
  font_family: string;
  heading_font: string;
  border_radius: number;
  spacing_unit: number;
  card_shadow: string;
  button_style: 'pill' | 'squared' | 'soft-rounded' | 'rounded';
  button_style_display: string;
  custom_css: string;
  is_predefined: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DecadeThemesByDecade {
  '90s': DecadeTheme[];
  '2000s': DecadeTheme[];
  '2010s': DecadeTheme[];
  '2020s': DecadeTheme[];
}

export const decadeThemesApi = {
  // Get all decade themes
  getAll: async (): Promise<DecadeTheme[]> => {
    const response = await axios.get<DecadeTheme[]>(`${API_BASE_URL}/decade-themes/`);
    return response.data;
  },

  // Get themes by decade
  getByDecade: async (decade: string): Promise<DecadeTheme[]> => {
    const response = await axios.get<DecadeTheme[]>(`${API_BASE_URL}/decade-themes/?decade=${decade}`);
    return response.data;
  },

  // Get all themes grouped by decade
  getAllByDecade: async (): Promise<DecadeThemesByDecade> => {
    const response = await axios.get<DecadeThemesByDecade>(`${API_BASE_URL}/decade-themes/by_decade/`);
    return response.data;
  },

  // Get predefined themes only
  getPredefined: async (): Promise<DecadeTheme[]> => {
    const response = await axios.get<DecadeTheme[]>(`${API_BASE_URL}/decade-themes/predefined/`);
    return response.data;
  },

  // Get active theme
  getActive: async (): Promise<DecadeTheme> => {
    const response = await axios.get<DecadeTheme>(`${API_BASE_URL}/decade-themes/active/`);
    return response.data;
  },

  // Get single theme by ID
  getById: async (id: number): Promise<DecadeTheme> => {
    const response = await axios.get<DecadeTheme>(`${API_BASE_URL}/decade-themes/${id}/`);
    return response.data;
  },

  // Activate a theme
  activate: async (id: number): Promise<{ status: string; theme: DecadeTheme }> => {
    const response = await axios.post<{ status: string; theme: DecadeTheme }>(`${API_BASE_URL}/decade-themes/${id}/activate/`);
    return response.data;
  },

  // Create a new theme (customization)
  create: async (themeData: Partial<DecadeTheme>): Promise<DecadeTheme> => {
    const response = await axios.post<DecadeTheme>(`${API_BASE_URL}/decade-themes/`, themeData);
    return response.data;
  },

  // Update a theme
  update: async (id: number, themeData: Partial<DecadeTheme>): Promise<DecadeTheme> => {
    const response = await axios.patch<DecadeTheme>(`${API_BASE_URL}/decade-themes/${id}/`, themeData);
    return response.data;
  },

  // Delete a theme
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/decade-themes/${id}/`);
  },
};
