import { useEffect, useRef, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Button, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  AlertColor
} from "@mui/material";
import { Delete, Edit, AccountBox, CheckCircle, PersonAdd } from "@mui/icons-material";
import axios from "axios";
import { Spinner } from "../main/Spiner";
import { typeStudent } from "../../moduls/Student";
import StudentDialog from "./StudentCard";
import { useSearch } from "../main/contexSearch";
import { useLocation, useParams } from "react-router";
import { Classroom, getClassrooms, subscribeToClassrooms } from "./Sidebar";
import ErrorAlert from "../main/ErrorAlart";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import StudentCard from "./StudentCard";

const StudentsTable: React.FC = () => {
  const [manualFilterOverride, setManualFilterOverride] = useState(false);
  const [students, setStudents] = useState<typeStudent[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [multiDeleteMode, setMultiDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openStudent, setOpenStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeStudent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { searchTerm } = useSearch();
  const { filterCriteria } = useSearch();
  const [filteredStudents, setFilteredStudents] = useState<typeStudent[]>([]);
  const location = useLocation();
  const [finalFiltered, setFinalFiltered] = useState(students);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const { groupId } = useParams();
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" as "success" | "error" as AlertColor });
  const printRef = useRef<HTMLDivElement>(null);
  const statusFromPath = location.pathname.split('/')[4];

  const filteredByRoute = filteredStudents.filter((student) => {
    if (groupId !== undefined) {
      return student.groupId === Number(groupId);
    }
    return statusFromPath === "true" ? student.registerStudent === true : student.registerStudent === false;
  });

  const handleOpenDialog = (student: typeStudent, editMode = false) => {
    setSelectedStudent(student);
    setIsEditing(editMode);
    setOpenStudent(true);
  };

  const handleCloseDialog = () => {
    setOpenStudent(false);
  };

  const handleSaveStudent = (updatedStudent: typeStudent) => {
    axios.put(`https://localhost:7278/api/Students/${updatedStudent.id}`, updatedStudent)
      .then(res => console.log("תלמיד התעדכן בשרת"))
      .catch(err => console.error("שגיאה בעדכון התלמיד"));
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
        setAlertState({ open: true, message: "אירעה שגיאה בלתי צפויה", severity: "error" });
      });
    const unsubscribe = subscribeToClassrooms(setClassrooms);
    return () => unsubscribe();
  }, []);

  const replaceClassNamesInFilter = (filterCode: string): string => {
    const allClassrooms = getClassrooms();
    return filterCode.replace(/['"]?([א-ת]{1,2}|כיתה [א-ת]{1,2})['"]?/g, (match, groupName) => {
      const normalized = groupName.replace("כיתה", "").trim();
      const found = allClassrooms.find(cls => cls.name.endsWith(normalized));
      return found ? found.id.toString() : match; 
    });
  };

  const filterStudents = () => {
    const safeSearchTerm = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';
    let filteredResults = [...filteredByRoute];

    if (filterCriteria && filterCriteria.startsWith("s =>")) {
      try {
        const fixedCriteria = replaceClassNamesInFilter(filterCriteria);
        const normalizedFilter = fixedCriteria.replace(/GroupId/g, "groupId");
        const filterFn = new Function("return " + normalizedFilter)();
        filteredResults = filteredResults.filter(filterFn);

        setFinalFiltered(filteredResults);
        setManualFilterOverride(true);
        return;
      } catch (err) {
        console.error("❌ שגיאה בהרצת ביטוי חכם מה-AI:", err);
      }
    }

    if (safeSearchTerm) {
      filteredResults = filteredResults.filter((student) => {
        const nameMatch = student.firstName?.toLowerCase().includes(safeSearchTerm) || false;
        const lastNameMatch = student.lastName?.toLowerCase().includes(safeSearchTerm) || false;
        return nameMatch || lastNameMatch;
      });
    }
    setFinalFiltered(filteredResults);
  };

  useEffect(() => {
    if (!manualFilterOverride) {
      filterStudents();
    } else {
      setManualFilterOverride(false);
    }
  }, [location.pathname, searchTerm, filterCriteria, filteredStudents]);

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
  const printCards = () => {
    const content = printRef.current;

    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
      alert('לא ניתן לפתוח חלון הדפסה');
      return;
    }

    const style = `
      <style>
        @media print {
          body {
            direction: rtl;
            font-family: sans-serif;
          }
  
          .print-area {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
            padding: 20px;
          }
  
          .print-card-wrapper {
            width: 48%;
            page-break-inside: avoid;
          }
  
          .student-card {
            border: 1px solid #ccc;
            padding: 16px;
            margin: 8px;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
          }
        }
      </style>
    `;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>הדפסת כרטיסי תלמיד</title>
          ${style}
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };
  const studentsToPrint = selectedStudent
    ? [selectedStudent]
    : students.filter(s => selectedIds.includes(s.id));

  const exportToExcel = () => {
    const dataToExport = students.filter((s) =>
      selectedIds.length === 0 || selectedIds.includes(s.id)
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'students.xlsx');
  };
  const confirmDelete = () => {
    if (multiDeleteMode) {
      setStudents(prev => prev.filter(s => !selectedIds.includes(s.id)));
      setSelectedIds([]);

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
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, student: typeStudent) => {
    const newGroupId = parseInt(e.target.value);
    setSelectedGroup(newGroupId);
    setIsEditing(false);
    const updatedStudent = { ...student, groupId: newGroupId };
    handleSaveStudent(updatedStudent);
  };
  const handleRegister = (student: typeStudent) => {
    const updatedStudent = { ...student, registerStudent: !student.registerStudent };

    axios.put(`https://localhost:7278/api/Students/${student.id}`, updatedStudent)
      .then(() => {
        console.log("סטטוס התעדכן בשרת");
        setStudents(prev =>
          prev.map(s => s.id === student.id ? { ...s, registerStudent: updatedStudent.registerStudent } : s)
        );

        setFilteredStudents(prev =>
          prev.map(s => s.id === student.id ? { ...s, registerStudent: updatedStudent.registerStudent } : s)
        );
      })
      .catch(err => {
        console.error("שגיאה בעדכון הסטטוס", err);
      });
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
            <Button onClick={exportToExcel}>ייצוא לאקסל</Button>
            <Button onClick={printCards}>הדפס כרטיסים</Button>
            <div style={{ display: 'none' }}>
              <div ref={printRef} className="print-area">
                {studentsToPrint.map(student => (
                  <div key={student.id} className="print-card-wrapper">
                    <StudentCard
                      student={student}
                      open={false}
                      onClose={() => { }}
                      onSave={(student: typeStudent) => { }}
                      isEditing={false}
                    />
                  </div>
                ))}
              </div>
            </div>
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
              ) : finalFiltered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Box
                      sx={{
                        backgroundColor: "#e3f2fd", 
                        color: "#1565c0",            
                        padding: 3,
                        borderRadius: 2,
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        boxShadow: 1,
                      }}
                    >
                      אין נתונים להצגה
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (

                finalFiltered.map(student => (
                  <TableRow key={student.id} hover sx={{ backgroundColor: selectedIds.includes(student.id) ? "#e3f2fd" : "transparent" }}>
                    {alertState.open && (<ErrorAlert alertState={alertState} setAlertState={setAlertState} />)}
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(student.id)}
                        onChange={() => handleSelect(student.id)}
                      />
                    </TableCell>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.fatherName}</TableCell>
                    <TableCell>{student.address}</TableCell>
                    <TableCell>{student.city}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      {editingStudentId === student.id ? (
                        <select
                          value={selectedGroup ?? ""}
                          onChange={(e) => handleChange(e, student)}
                          onBlur={() => setIsEditing(false)}
                          className="border rounded px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option value="" disabled>
                            בחר קבוצה
                          </option>
                          {classrooms.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          onClick={() => setEditingStudentId(student.id)}
                          className="cursor-pointer text-blue-600 hover:underline"
                        >
                          {
                            classrooms.find((cls) => cls.id === student.groupId)?.name
                            ?? "בחר קבוצה"
                          }
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          minWidth: 120,
                          bgcolor: student.registerStudent ? "#607d8b" : "#1976d2",
                          color: "white",
                          "&:hover": { bgcolor: student.registerStudent ? "#455a64" : "#135ba1" },
                          display: "flex", alignItems: "center", gap: 1
                        }}
                        onClick={() => handleRegister(student)}
                        startIcon={student.registerStudent ? <CheckCircle /> : <PersonAdd />}
                      >
                        {student.registerStudent ? "רשום" : "רישום"}
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