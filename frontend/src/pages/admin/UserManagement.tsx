import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  VpnKey,
  PersonOff,
  PersonAdd
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
}

const API_BASE_URL = 'http://localhost:8000/api';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [_loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_staff: false,
    is_active: true,
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/users/`);
      setUsers(response.data);
    } catch (error) {
      showSnackbar('Fehler beim Laden der Benutzer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: '',
        is_staff: user.is_staff,
        is_active: user.is_active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        is_staff: false,
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleOpenPasswordDialog = (userId: number) => {
    setSelectedUserId(userId);
    setPasswordData({ password: '', confirmPassword: '' });
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setSelectedUserId(null);
    setPasswordData({ password: '', confirmPassword: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await axios.patch(`${API_BASE_URL}/users/${editingUser.id}/`, formData);
        showSnackbar('Benutzer erfolgreich aktualisiert', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/users/`, formData);
        showSnackbar('Benutzer erfolgreich erstellt', 'success');
      }
      handleCloseDialog();
      fetchUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.username?.[0] || 'Fehler beim Speichern des Benutzers';
      showSnackbar(errorMsg, 'error');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      showSnackbar('Passwörter stimmen nicht überein', 'error');
      return;
    }

    if (passwordData.password.length < 8) {
      showSnackbar('Passwort muss mindestens 8 Zeichen lang sein', 'error');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/users/${selectedUserId}/set_password/`, {
        password: passwordData.password,
      });
      showSnackbar('Passwort erfolgreich geändert', 'success');
      handleClosePasswordDialog();
    } catch (error) {
      showSnackbar('Fehler beim Ändern des Passworts', 'error');
    }
  };

  const handleToggleStaff = async (user: User) => {
    if (user.id === currentUser?.id) {
      showSnackbar('Sie können Ihren eigenen Staff-Status nicht ändern', 'error');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/users/${user.id}/toggle_staff/`);
      showSnackbar('Staff-Status erfolgreich geändert', 'success');
      fetchUsers();
    } catch (error) {
      showSnackbar('Fehler beim Ändern des Staff-Status', 'error');
    }
  };

  const _handleToggleActive = async (user: User) => {
    if (user.id === currentUser?.id) {
      showSnackbar('Sie können sich nicht selbst deaktivieren', 'error');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/users/${user.id}/toggle_active/`);
      showSnackbar('Benutzer-Status erfolgreich geändert', 'success');
      fetchUsers();
    } catch (error) {
      showSnackbar('Fehler beim Ändern des Benutzer-Status', 'error');
    }
  };

  const handleDelete = async (userId: number) => {
    if (userId === currentUser?.id) {
      showSnackbar('Sie können sich nicht selbst löschen', 'error');
      return;
    }

    if (!window.confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}/`);
      showSnackbar('Benutzer erfolgreich gelöscht', 'success');
      fetchUsers();
    } catch (error) {
      showSnackbar('Fehler beim Löschen des Benutzers', 'error');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nie';
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Benutzerverwaltung
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Neuer Benutzer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Benutzername</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>E-Mail</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Rollen</TableCell>
              <TableCell>Letzter Login</TableCell>
              <TableCell>Erstellt</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`.trim() || '-'}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.is_active ? 'Aktiv' : 'Inaktiv'}
                    color={user.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {user.is_superuser && (
                      <Chip label="Superuser" color="error" size="small" />
                    )}
                    {user.is_staff && (
                      <Chip label="Staff" color="primary" size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{formatDate(user.last_login)}</TableCell>
                <TableCell>{formatDate(user.date_joined)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(user)}
                    title="Bearbeiten"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenPasswordDialog(user.id)}
                    title="Passwort ändern"
                  >
                    <VpnKey />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleStaff(user)}
                    title="Staff-Status umschalten"
                    disabled={user.id === currentUser?.id}
                  >
                    {user.is_staff ? <PersonOff /> : <PersonAdd />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(user.id)}
                    title="Löschen"
                    disabled={user.id === currentUser?.id}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Benutzername"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              fullWidth
              disabled={!!editingUser}
            />
            <TextField
              label="E-Mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Vorname"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Nachname"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              fullWidth
            />
            {!editingUser && (
              <TextField
                label="Passwort"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                fullWidth
                helperText="Mindestens 8 Zeichen"
              />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_staff}
                  onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
                />
              }
              label="Staff-Zugriff"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              }
              label="Aktiv"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Abbrechen</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Passwort ändern</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Neues Passwort"
              type="password"
              value={passwordData.password}
              onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
              required
              fullWidth
              helperText="Mindestens 8 Zeichen"
            />
            <TextField
              label="Passwort bestätigen"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Abbrechen</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Passwort ändern
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
