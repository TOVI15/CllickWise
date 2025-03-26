import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import { Edit, Delete, Close } from "@mui/icons-material";
import { typeStudent } from "../../moduls/Student";
import { useNavigate } from "react-router";

const RegisteredStudents = () => {
  const [registeredStudents, setRegisteredStudents] = useState<typeStudent[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const navigate = useNavigate();
  // שליפה מדומה מהשרת
  useEffect(() => {
    const studentList = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      firstName: `תלמיד ${i + 1}`,
      lastName: `שם ${i + 1}`,
      address: `רחוב הדוגמה ${i + 1}`,
    }));
    setRegisteredStudents(studentList);
  }, []);

  const handleDelete = (id: number) => {
    setRegisteredStudents((prev) => prev.filter((student) => student.id !== id));
    setConfirmDelete(null);
  };

  const handleEdit = (id: number, mode: "edit" | "view") => {
    console.log("מעבר לעריכת תלמיד עם ID:", id);
    navigate(`/main/edit-student/${id}?mode=${mode}`);
  };

  return (
    <Box
      sx={{
        width: "80%",
        margin: "0 auto",
        bgcolor: "#E3F2FD",
        padding: 4,
        borderRadius: 3,
        minHeight: "100vh",
        overflowX: "hidden",
        direction: "rtl",
      }}
    >
      {/* כותרת גדולה ובולטת יותר */}
      <Typography
        variant="h2"
        align="center"
        sx={{ fontWeight: "bold", color: "#003366", mb: 3 }}
      >
        רשימת התלמידים הרשומים
      </Typography>

      {/* טבלה */}
      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ffffff" }}>
            <TableRow >
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>שם פרטי</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>שם משפחה</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>כתובת</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>עריכה</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>מחיקה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredStudents.map((student) => (
              <TableRow hover key={student.id} onClick={() => handleEdit(student.id, "view")} sx={{ cursor: "pointer" }}>
                <TableCell align="center">{student.firstName}</TableCell>
                <TableCell align="center">{student.lastName}</TableCell>
                <TableCell align="center">{student.address}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    sx={{
                      minWidth: 120,
                      bgcolor: "#9E9E9E",
                      color: "white",
                      "&:hover": { bgcolor: "#757575" },
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(student.id, "edit");
                    }}
                    startIcon={<Edit />}
                  >
                    עריכה
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(student.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* דיאלוג מחיקה */}
      <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            bgcolor: "#f44336",
            color: "#ffffff",
            padding: 2,
          }}
        >
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

export default RegisteredStudents;
