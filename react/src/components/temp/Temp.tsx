import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Chip,
  InputAdornment,
} from '@mui/material';
import { Add, Delete, Edit, Search } from '@mui/icons-material';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Pending' | 'Active';
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'יוסי לוי',
      email: 'yossi@example.com',
      role: 'Admin',
      status: 'Active',
    },
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [search, setSearch] = useState('');

  const filtered = employees.filter(
    (e) =>
      e.name.includes(search) || e.email.includes(search) || e.role.includes(search)
  );

  const handleAdd = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...form,
      status: 'Pending',
    };
    setEmployees([...employees, newEmployee]);
    setForm({ name: '', email: '', role: '' });
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  return (
    <Box sx={{ p: 4, direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom>
        ניהול עובדים
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="חפש עובד"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          הוסף עובד
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>שם</TableCell>
              <TableCell>אימייל</TableCell>
              <TableCell>תפקיד</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell align="center">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.status}
                    color={employee.status === 'Active' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(employee.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  לא נמצאו עובדים תואמים.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} dir="rtl">
        <DialogTitle>הוספת עובד חדש</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="שם מלא"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="אימייל"
              fullWidth
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="תפקיד"
              fullWidth
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          <Button onClick={handleAdd} variant="contained">
            שמירה
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement;
