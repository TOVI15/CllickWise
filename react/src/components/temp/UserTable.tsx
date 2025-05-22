import React, { useEffect, useState } from 'react';
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Stack, Chip, CircularProgress,
    AlertColor
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { typeUser } from '../../moduls/User';
import axios from 'axios';
import ErrorAlert from '../main/ErrorAlart';
import { useSearch } from '../main/contexSearch';
import EmployeeDialog from '../user/EmployeeDialog';
import DeleteDialog from '../user/DeleteDialog';

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<typeUser[]>([]);
    const [open, setOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedEmployee, setSelectedEmployee] = useState<typeUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [alertState, setAlertState] = useState<{ open: boolean; message: string; severity: AlertColor }>({
        open: false,
        message: '',
        severity: 'success',
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<typeUser | null>(null);

    const { searchTerm } = useSearch();

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://localhost:7278/api/Users');
            const result = Array.isArray(res.data) ? res.data : [];
            setEmployees(result);
        } catch (err) {
            console.error('שגיאה בשליפת עובדים:', err);
            setAlertState({ open: true, message: "שגיאת שרת, נסה שוב מאוחר יותר", severity: "error" });
            setEmployees([]);
        } finally {
            setLoading(false);
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
        } catch (err) {
            console.error('שגיאה במחיקת עובד:', err);
            setAlertState({ open: true, message: "שגיאת שרת במחיקה, נסה שוב", severity: "error" });
        } finally {
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
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
                console.log(formData , "formData");
                
                await axios.put(`https://localhost:7278/api/Users/${selectedEmployee.id}`, formData);
                setAlertState({ open: true, message: "העובד עודכן בהצלחה", severity: "success" });
            }
            handleCloseDialog();
            fetchEmployees();
        } catch (err) {
            console.error('שגיאה:', err);
            setAlertState({ open: true, message: "שגיאת שרת בפעולה, נסה שוב", severity: "error" });
        }
    };

    const filtered = employees.filter(
        (e) =>
            (e.name ?? '').includes(searchTerm) ||
            (e.email ?? '').includes(searchTerm) ||
            (e.role ?? '').includes(searchTerm)
    );
    return (
        <Box sx={{ p: 4, direction: 'rtl' }}>

            {alertState.open && (
                <Box sx={{ mb: 2 }}>
                    <ErrorAlert alertState={alertState} setAlertState={setAlertState} />
                </Box>
            )}

            <Typography variant="h4" gutterBottom>
                ניהול עובדים
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Add sx={{ color: 'black' }} />}
                    onClick={handleOpenAddDialog}
                >
                    הוסף עובד
                </Button>
            </Stack>

            {loading ? (
                <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
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
                                            label={employee.isActive === true ? 'פעיל' : 'לא פעיל'}
                                            color={employee.isActive === true ? 'success' : 'warning'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleOpenEditDialog(employee)}>
                                            <Edit sx={{ color: 'black' }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(employee)}>
                                            <Delete sx={{ color: 'black' }} />
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