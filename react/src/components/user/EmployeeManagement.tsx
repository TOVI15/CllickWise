import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Stack, CircularProgress, AlertColor } from '@mui/material';
import { Add } from '@mui/icons-material';
import axios from 'axios';
import { typeUser } from '../../moduls/User';
import EmployeeDialog from './EmployeeDialog';
import DeleteDialog from './DeleteDialog';
import { useSearch } from '../main/contexSearch';
import ErrorAlert from '../main/ErrorAlart';
import EmployeeTable from './EmployeeTable';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<typeUser[]>([]);
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = useState<typeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertState, setAlertState] = useState<{ open: boolean; message: string; severity: AlertColor }>({ open: false, message: '', severity: 'success',});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<typeUser | null>(null);
  const { searchTerm } = useSearch();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://localhost:7278/api/Users');
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setAlertState({ open: true, message: "שגיאת שרת, נסה שוב מאוחר יותר", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setSelectedEmployee(null);
    setOpen(true);
  };

  const handleOpenEditDialog = (employee: typeUser) => {
    setDialogMode("edit");
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = async (formData: Omit<typeUser, "id" | "status">) => {
    try {
      if (dialogMode === 'add') {
        await axios.post('https://localhost:7278/api/Users', formData);
        setAlertState({ open: true, message: "עובד נוסף בהצלחה", severity: "success" });
      } else if (dialogMode === 'edit' && selectedEmployee?.id) {
        await axios.put(`https://localhost:7278/api/Users/${selectedEmployee.id}`, formData);
        setAlertState({ open: true, message: "העובד עודכן בהצלחה", severity: "success" });
      }
      handleCloseDialog();
      fetchEmployees();
    } catch {
      setAlertState({ open: true, message: "שגיאת שרת בפעולה, נסה שוב", severity: "error" });
    }
  };

  const handleDeleteClick = (employee: typeUser) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await axios.delete(`https://localhost:7278/api/Users/${employeeToDelete.id}`);
      setAlertState({ open: true, message: "העובד נמחק בהצלחה", severity: "success" });
      fetchEmployees();
    } catch {
      setAlertState({ open: true, message: "שגיאת שרת במחיקה, נסה שוב", severity: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <Box sx={{ p: 4, direction: 'rtl' }}>
      {alertState.open && <ErrorAlert alertState={alertState} setAlertState={setAlertState} />}
      <Typography variant="h4" gutterBottom>ניהול עובדים</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAddDialog}>הוסף עובד</Button>
      </Stack>

      {loading ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> : (
        <EmployeeTable
          employees={employees}
          searchTerm={searchTerm}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteClick}
        />
      )}

      <EmployeeDialog
        open={open}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialData={dialogMode === "edit" && selectedEmployee
          ? {
              name: selectedEmployee.name,
              email: selectedEmployee.email,
              role: selectedEmployee.role,
              address: selectedEmployee.address || "",
              phone: selectedEmployee.phone || "",
              isActive: selectedEmployee.isActive,
              identity: selectedEmployee.identity,
            }
          : undefined}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default EmployeeManagement;