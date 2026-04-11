import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import Login from '../../components/Login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Login', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/benutzername/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument();
  });

  it('shows error for invalid credentials', async () => {
    render(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/benutzername/i), 'admin');
    await user.type(screen.getByLabelText(/passwort/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /anmelden/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('navigates to /admin on successful login', async () => {
    render(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/benutzername/i), 'admin');
    await user.type(screen.getByLabelText(/passwort/i), 'correctpassword');
    await user.click(screen.getByRole('button', { name: /anmelden/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('disables form fields while loading', async () => {
    render(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/benutzername/i), 'admin');
    await user.type(screen.getByLabelText(/passwort/i), 'correctpassword');

    const submitButton = screen.getByRole('button', { name: /anmelden/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
