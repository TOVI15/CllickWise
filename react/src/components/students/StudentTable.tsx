import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Button, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Avatar
} from "@mui/material";
import { Delete, Edit, AccountBox, CheckCircle, PersonAdd } from "@mui/icons-material";
import axios from "axios";
import { Spinner } from "../main/Spiner";
import { typeStudent } from "../../moduls/Student";
import StudentDialog from "./StudentCard";
import { useSearch } from "../main/contexSearch";


const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<typeStudent[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [multiDeleteMode, setMultiDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true); // מצב טעינה
  const [registeredStudents, setRegisteredStudents] = useState<Set<number>>(new Set());
  const [openStudent, setOpenStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { searchTerm, filterCriteria } = useSearch();
  const [filteredStudents, setFilteredStudents] = useState<typeStudent[]>([]);

  const handleOpenDialog = (student : any, editMode = false) => {
    setSelectedStudent(student);
    setIsEditing(editMode);
    setOpenStudent(true);
  };

  const handleCloseDialog = () => {
    setOpenStudent(false);
  };

  const handleSaveStudent = (updatedStudent: typeStudent) => {
    axios.put(`https://localhost:7278/api/Students/${updatedStudent.id}`, {  updatedStudent })
    .then(res => console.log("סטטוס התעדכן בשרת"))
    .catch(err => console.error("שגיאה בעדכון הסטטוס"));
    console.log("סטודנט מעודכן:", updatedStudent);
    handleCloseDialog(); 
  };

  useEffect(() => {
    axios.get("https://localhost:7278/api/Students")
      .then((res) => {
        setStudents(res.data);
        setFilteredStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) => {
      // בדוק אם name ו-lastName קיימים לפני שנבצע את קריאת toLowerCase()
      const nameMatch = student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const lastNameMatch = student.lastName && student.lastName.toLowerCase().includes(searchTerm.toLowerCase());
  
      // אם ה-criteria הוא לפי שם
      const searchMatch = nameMatch || lastNameMatch;
  
      if (filterCriteria === 'name') {
        return searchMatch;
      } else if (filterCriteria === 'age') {
        // בדוק אם class קיים לפני שנבצע קריאת toString()
        const classMatch = student.class && student.class.toString().includes(searchTerm);
        return searchMatch && classMatch;
      }
  
      return searchMatch;
    });
  
    setFilteredStudents(filtered);
  }, [searchTerm, filterCriteria, students]);
  const handleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setMultiDeleteMode(false);
    setOpenDialog(true);
  };

  const handleDeleteSelected = () => {
    setMultiDeleteMode(true);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (multiDeleteMode) {
      // במקרה של מחיקה מרובה
      setStudents(prev => prev.filter(s => !selectedIds.includes(s.id)));
      setSelectedIds([]);

      // שליחת בקשות מחיקה מרובות לשרת
      axios.all(selectedIds.map(id =>
        axios.delete(`https://localhost:7278/api/Students/${id}`)
      ))
        .then(() => {
          console.log("נמחקו בהצלחה");
        })
        .catch(err => {
          console.error("שגיאה במחיקה", err);
        });
    } else if (deleteId !== null) {
      // במקרה של מחיקה בודדת
      setStudents(prev => prev.filter(s => s.id !== deleteId));

      // שליחת בקשת מחיקה לשרת
      axios.delete(`https://localhost:7278/api/Students/${deleteId}`)
        .then(() => {
          console.log("נמחק בהצלחה");
        })
        .catch(err => {
          console.error("שגיאה במחיקה", err);
        });
    }
    setOpenDialog(false);
  };

  const handleRegister = (id: number) => {
    setRegisteredStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);  // אם כבר רשום, מבטלים את הרישום
      } else {
        newSet.add(id);  // אם לא רשום, מוסיפים
      }
      return newSet;
    });

    // לעדכן בשרת את הסטטוס של התלמיד
    axios.put(`https://localhost:7278/api/Students/${id}`, { status: registeredStudents.has(id) ? false : true })
      .then(res => console.log("סטטוס התעדכן בשרת"))
      .catch(err => console.error("שגיאה בעדכון הסטטוס"));
  };

  return (
    <Box sx={{ width: "97%", backgroundColor: "#f5f5f5", pt: 3, px: 2 }}>
      <Box sx={{ maxWidth: "100%", margin: "auto" }}>
        {selectedIds.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleDeleteSelected}
              sx={{ backgroundColor: "#616161", borderRadius: 3, px: 4, fontWeight: "bold" }}
            >
              מחיקת נבחרים
            </Button>
          </Box>
        )}

        <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 200px)", overflowX: "hidden", maxWidth: "100%" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e0e0e0", borderBottom: "3px solid #1976d2" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.length === students.length}
                    onChange={() => setSelectedIds(selectedIds.length === students.length ? [] : students.map(student => student.id))}
                    sx={{ p: 0.5 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>תמונה</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>שם תלמיד</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>משפחה</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>אב</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>כתובת</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>עיר</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>טלפון</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>שיעור</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#37474f" }}>סטטוס</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map(student => (
                  <TableRow key={student.id} hover sx={{ backgroundColor: selectedIds.includes(student.id) ? "#e3f2fd" : "transparent" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(student.id)}
                        onChange={() => handleSelect(student.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar src={`https://click-wise-testpnoren.s3.us-east-1.amazonaws.com/40?text=${student.id}/password.jpg`} />
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.fatherName}</TableCell>
                    <TableCell>{student.address}</TableCell>
                    <TableCell>{student.city}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          minWidth: 120,
                          bgcolor: registeredStudents.has(student.id) ? "#607d8b" : "#1976d2",
                          color: "white",
                          "&:hover": { bgcolor: registeredStudents.has(student.id) ? "#455a64" : "#135ba1" },
                          display: "flex", alignItems: "center", gap: 1
                        }}
                        onClick={() => handleRegister(student.id)}
                        startIcon={registeredStudents.has(student.id) ? <CheckCircle /> : <PersonAdd />}
                      >
                        {registeredStudents.has(student.id) ? "רשום" : "רישום"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleOpenDialog(student, false)}>
                          <AccountBox sx={{ color: "#455a64" }} />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDialog(student, true)}>
                          <Edit sx={{ color: "#455a64" }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(student.id)}><Delete sx={{ color: "#455a64" }} /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {multiDeleteMode
              ? "האם אתה בטוח שברצונך למחוק את כל התלמידים הנבחרים?"
              : "האם אתה בטוח שברצונך למחוק את התלמיד?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button onClick={confirmDelete} color="error">מחק</Button>
        </DialogActions>
      </Dialog>
      <StudentDialog
        open={openStudent}
        student={selectedStudent}
        onClose={handleCloseDialog}
        onSave={handleSaveStudent}
        isEditing={isEditing}
      />
    </Box>
  );
}
export default StudentsTable;