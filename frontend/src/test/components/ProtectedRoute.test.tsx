import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { render } from '../test-utils';
import { server } from '../mocks/server';
import ProtectedRoute from '../../components/ProtectedRoute';
import { mockUser } from '../mocks/handlers';

const renderWithProviders = (initialPath: string) => {
  return render(
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        }
      />
      <Route path="/admin/login" element={<div>Login Page</div>} />
    </Routes>,
    { initialEntries: [initialPath] }
  );
};

describe('ProtectedRoute', () => {
  it('shows protected content when authenticated', async () => {
    server.use(
      http.post('http://localhost:8000/api/auth/refresh/', () =>
        HttpResponse.json({ access: 'token', user: mockUser })
      )
    );

    renderWithProviders('/admin');

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('redirects to login when not authenticated', async () => {
    server.use(
      http.post('http://localhost:8000/api/auth/refresh/', () =>
        HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
      )
    );

    renderWithProviders('/admin');

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});
