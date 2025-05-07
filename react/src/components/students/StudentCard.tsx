import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, TextField, Box, Typography, Avatar
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { typeStudent } from "../../moduls/Student";
import axios from "axios";

type StudentDialogProps = {
  open: boolean;
  student: typeStudent | null;
  onClose: () => void;
  onSave: (student: typeStudent) => void; // פונקציה לשמירה (עריכה)
  isEditing: boolean;
};

const StudentDialog = ({ open, student, onClose, onSave, isEditing }: StudentDialogProps) => {
  const [editedStudent, setEditedStudent] = useState<typeStudent | null>(null);
  const [folderPath, setFolderPath] = useState("");

  // עדכון הנתונים כאשר התלמיד משתנה או המצב משתנה (עריכה)
  useEffect(() => {
    if (open && student) {
      setEditedStudent(student);
    }
    const fetchFolderPath = async () => {
      try {
        const response = await axios.get(`https://localhost:7278/api/Documents/folder-path`, {
          params: { studentId: student?.id },
        });
        setFolderPath(response.data.path);
      } catch (error) {
        console.error("Failed to load folder path", error);
      }
    };

    fetchFolderPath();
  }, [open, student]);

  // עדכון השדות כאשר משתמש משנה אותם
  const handleChange = (field: keyof typeStudent) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedStudent) {
      setEditedStudent({
        ...editedStudent,
        [field]: event.target.value
      });
    }
  };

  // כפתור הדפסה
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <h1>פרטי תלמיד</h1>
      <p><strong>שם:</strong> ${student?.name}</p>
      <p><strong>ת"ז:</strong> ${student?.id}</p>
      <p><strong>כתובת:</strong> ${student?.address}</p>
      <p><strong>משפחה:</strong> ${student?.lastName}</p>
      <p><strong>טלפון:</strong> ${student?.phone}</p>
      <p><strong>הורים:</strong> ${student?.fatherName}</p>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };
  const imageUrl = folderPath
  ? `https://your-s3-bucket.s3.amazonaws.com/${folderPath}/password.jpg`
  : `https://via.placeholder.com/100?text=${student?.id}`;
  if (!student) return null; // אם אין תלמיד, אל תציג כלום

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        פרטי תלמיד
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar src={imageUrl} sx={{ mr: 2 }} />
          <Typography variant="h6">{student.name}</Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {isEditing ? (
            <>
              <TextField
                label="ת.ז"
                value={editedStudent?.id || ""}
                onChange={handleChange("id")}
                fullWidth
              />
              <TextField
                label="כתובת"
                value={editedStudent?.address || ""}
                onChange={handleChange("address")}
                fullWidth
              />
              <TextField
                label="משפחה"
                value={editedStudent?.lastName || ""}
                onChange={handleChange("lastName")}
                fullWidth
              />
              <TextField
                label="טלפון"
                value={editedStudent?.phone || ""}
                onChange={handleChange("phone")}
                fullWidth
              />
              <TextField
                label="הורים"
                value={editedStudent?.fatherName || ""}
                onChange={handleChange("fatherName")}
                fullWidth
              />
            </>
          ) : (
            <>
              <Typography variant="body1"><strong>ת"ז:</strong> {student.id}</Typography>
              <Typography variant="body1"><strong>כתובת:</strong> {student.address}</Typography>
              <Typography variant="body1"><strong>טלפון:</strong> {student.phone}</Typography>
              <Typography variant="body1"><strong>הורים:</strong> {student.fatherName}</Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          סגור
        </Button>
        {isEditing && (
          <Button
            onClick={() => {
              if (editedStudent) {
                onSave(editedStudent);  // שמירה של התלמיד אחרי העריכה
              }
            }}
            color="primary"
          >
            שמור
          </Button>
        )}
        <Button onClick={handlePrint} color="secondary">
          הדפס
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDialog;
