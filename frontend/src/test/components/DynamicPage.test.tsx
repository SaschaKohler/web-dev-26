import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { render } from '../test-utils';
import { server } from '../mocks/server';
import DynamicPage from '../../components/DynamicPage';
import { mockPage, mockLayout } from '../mocks/handlers';

describe('DynamicPage', () => {
  it('shows loading spinner initially', () => {
    render(<DynamicPage slug="startseite" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page content when page has no layout', async () => {
    render(<DynamicPage slug="startseite" />);

    await waitFor(() => {
      expect(screen.getByText('Startseite')).toBeInTheDocument();
    });
  });

  it('shows error when page is not found', async () => {
    server.use(
      http.get('http://localhost:8000/api/pages/all_pages/', () =>
        HttpResponse.json([])
      )
    );

    render(<DynamicPage slug="nicht-vorhanden" />);

    await waitFor(() => {
      expect(screen.getByText('Seite nicht gefunden')).toBeInTheDocument();
    });
  });

  it('renders fallback content when page not found and fallback provided', async () => {
    server.use(
      http.get('http://localhost:8000/api/pages/all_pages/', () =>
        HttpResponse.json([])
      )
    );

    render(
      <DynamicPage
        slug="nicht-vorhanden"
        fallbackContent={<div>Fallback Inhalt</div>}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Fallback Inhalt')).toBeInTheDocument();
    });
  });

  it('uses PageRenderer when page has a layout assigned', async () => {
    server.use(
      http.get('http://localhost:8000/api/pages/all_pages/', () =>
        HttpResponse.json([{ ...mockPage, layout: 1 }])
      ),
      http.get('http://localhost:8000/api/layouts/1/with_sections/', () =>
        HttpResponse.json({ ...mockLayout, sections: [] })
      )
    );

    render(<DynamicPage slug="startseite" />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    server.use(
      http.get('http://localhost:8000/api/pages/all_pages/', () =>
        HttpResponse.error()
      )
    );

    render(<DynamicPage slug="startseite" />);

    await waitFor(() => {
      expect(screen.getByText('Fehler beim Laden der Seite')).toBeInTheDocument();
    });
  });
});
