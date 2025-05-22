import { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Paper,
} from "@mui/material";
import { Delete, PersonAdd, CheckCircle, Close } from "@mui/icons-material";
import { typeStudent } from "../../moduls/Student";

const StudentDatabase = () => {
  const [students, setStudents] = useState<typeStudent[]>([]);
  const [registeredStudents, setRegisteredStudents] = useState(new Set<number>());
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    const studentList = Array.from({ length: 400 }, (_, i) => ({
      id: i + 1,
      firstName: `תלמיד ${i + 1}`,
      lastName: `שם ${i + 1}`,
      address: `רחוב הדוגמה ${i + 1}`,
    }));
    setStudents(studentList);

    const storedRegisteredStudents = JSON.parse(localStorage.getItem("registeredStudents") || "[]");
    setRegisteredStudents(new Set(storedRegisteredStudents));
  }, []);

  const handleRegister = (id: number) => {
    setRegisteredStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      localStorage.setItem("registeredStudents", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleDelete = (id: number) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
    setConfirmDelete(null);
  };

  return (
    <Box sx={{ 
      width: "80%", 
      margin: "0 auto", 
      bgcolor: "#E3F2FD", 
      padding: 4, 
      borderRadius: 3, 
      minHeight: "100vh",
      overflowX: "hidden",
      direction: "rtl",
      pt: 10 
    }}>
      <Typography variant="h3" align="center" sx={{ fontWeight: "bold", color: "#003366", mb: 3 }}>
        מאגר התלמידים
      </Typography>

      {/* טבלה */}
      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ffffff" }}> 
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>שם פרטי</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>שם משפחה</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>כתובת</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>רישום</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>מחיקה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow hover key={student.id}>
                <TableCell align="center">{student.firstName}</TableCell>
                <TableCell align="center">{student.lastName}</TableCell>
                <TableCell align="center">{student.address}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    sx={{
                      minWidth: 120,
                      bgcolor: registeredStudents.has(student.id) ? "#607d8b" : "#1976d2", // צבע אפרפר אחרי רישום
                      color: "white",
                      "&:hover": {
                        bgcolor: registeredStudents.has(student.id) ? "#455a64" : "#135ba1",
                      },
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                    onClick={() => handleRegister(student.id)}
                    startIcon={registeredStudents.has(student.id) ? <CheckCircle /> : <PersonAdd />}
                  >
                    {registeredStudents.has(student.id) ? "רשום" : "רישום"}
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => setConfirmDelete(student.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{
          textAlign: "center", 
          fontWeight: "bold", 
          bgcolor: "#f44336", 
          color: "#ffffff", 
          padding: 2
        }}>
          <IconButton onClick={() => setConfirmDelete(null)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <Close sx={{ color: "#ffffff" }} />
          </IconButton>
          אישור מחיקה
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", paddingTop: 4 }}>
          <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>האם אתה בטוח שברצונך למחוק את התלמיד?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="contained" color="error" onClick={() => handleDelete(confirmDelete!)} sx={{ width: 100 }}>
            מחיקה
          </Button>
          <Button variant="outlined" onClick={() => setConfirmDelete(null)} sx={{ width: 100 }}>
            ביטול
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDatabase;
