import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:8000/api';

export const mockUser = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  first_name: 'Admin',
  last_name: 'User',
  is_staff: true,
  is_active: true,
  is_superuser: true,
  date_joined: '2024-01-01T00:00:00Z',
  last_login: '2024-01-01T12:00:00Z',
};

export const mockPage = {
  id: 1,
  title: 'Startseite',
  slug: 'startseite',
  content: '<p>Willkommen</p>',
  layout: null,
  is_published: true,
};

export const mockLayout = {
  id: 1,
  name: 'main-layout',
  display_name: 'Hauptlayout',
  layout_type: 'standard',
  layout_type_display: 'Standard',
  description: '',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  sections: [],
};

export const handlers = [
  http.post(`${API_BASE}/auth/login/`, async ({ request }) => {
    const body = await request.json() as { username?: string; password?: string };
    if (body.username === 'admin' && body.password === 'correctpassword') {
      return HttpResponse.json({
        user: mockUser,
        access: 'mock-access-token',
        message: 'Login successful',
      });
    }
    return HttpResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 });
  }),

  http.post(`${API_BASE}/auth/logout/`, () => {
    return HttpResponse.json({ message: 'Logout successful' });
  }),

  http.post(`${API_BASE}/auth/refresh/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      user: mockUser,
    });
  }),

  http.get(`${API_BASE}/pages/all_pages/`, () => {
    return HttpResponse.json([mockPage]);
  }),

  http.get(`${API_BASE}/layouts/`, () => {
    return HttpResponse.json([mockLayout]);
  }),

  http.get(`${API_BASE}/layouts/:id/with_sections/`, ({ params }) => {
    return HttpResponse.json({ ...mockLayout, id: Number(params.id) });
  }),

  http.get(`${API_BASE}/pages/`, () => {
    return HttpResponse.json([mockPage]);
  }),
];
