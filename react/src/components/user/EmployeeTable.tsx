import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Chip
  } from '@mui/material';
  import { Edit, Delete } from '@mui/icons-material';
  import { typeUser } from '../../moduls/User';
  
  type Props = {
    employees: typeUser[];
    searchTerm: string;
    onEdit: (employee: typeUser) => void;
    onDelete: (employee: typeUser) => void;
  };
  
  const EmployeeTable: React.FC<Props> = ({ employees, searchTerm, onEdit, onDelete }) => {
    const filtered = employees.filter(
      (e) =>
        (e.name ?? '').includes(searchTerm) ||
        (e.email ?? '').includes(searchTerm) ||
        (e.role ?? '').includes(searchTerm)
    );
  
    return (
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
                    label={employee.isActive ? 'פעיל' : 'לא פעיל'}
                    color={employee.isActive ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(employee)}><Edit /></IconButton>
                  <IconButton onClick={() => onDelete(employee)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">לא נמצאו עובדים תואמים.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default EmployeeTable;
  