import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, IconButton, TextField, Box, Typography, Avatar
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { typeStudent } from "../../moduls/Student";
import axios from "axios";

type StudentDialogProps = {
  open: boolean;
  student: typeStudent | null;
  onClose: () => void;
  onSave: (student: typeStudent) => void;
  isEditing: boolean;
};

const calculateAge = (birthDateString: string): number => {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const StudentDialog = ({ open, student, onClose, onSave, isEditing }: StudentDialogProps) => {
  const [editedStudent, setEditedStudent] = useState<typeStudent | null>(null);
  const [folderPath, setFolderPath] = useState("5");

  useEffect(() => {
    if (open && student) {
      setEditedStudent(student);
      const fetchFolderPath = async () => {
        try {
          const response = await axios.get(`https://click-wisw-server.onrender.com/api/Students/${student.id}`);
          setFolderPath(response.data.folderKey);
        } catch (error) {
          console.error("Failed to load folder path", error);
        }
      };
      fetchFolderPath();

    }
  }, [open, student]);

  const handleChange = (field: keyof typeStudent) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedStudent) {
      setEditedStudent({ ...editedStudent, [field]: event.target.value });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const age = student?.dateOfBirth ? calculateAge(student.dateOfBirth) : "לא זמין";

    printWindow?.document.write(`
      <html dir="rtl">
        <head>
          <title>כרטיס תלמיד</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
            .card { display: flex; gap: 20px; }
            .image { width: 150px; height: 200px; border: 1px solid #ccc; }
            .info { flex: 1; }
            .info p { margin: 5px 0; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>כרטיס תלמיד</h2>
          <div class="card">
            <img src="https://click-wise-testpnoren.s3.amazonaws.com/${folderPath}/passport.jpg" class="image" />
            <div class="info">
              <p><strong>שם:</strong> ${student?.firstName} ${student?.lastName}</p>
              <p><strong>ת"ז:</strong> ${student?.identityNumber}</p>
              <p><strong>תאריך לידה:</strong> ${student?.dateOfBirth || "לא ידוע"}</p>
              <p><strong>גיל:</strong> ${age}</p>
              <p><strong>כתובת:</strong> ${student?.address}</p>
              <p><strong>טלפון:</strong> ${student?.phone}</p>
              <p><strong>שם האב:</strong> ${student?.fatherName}</p>
              <p><strong>שם האם:</strong> ${student?.motherName}</p>
              <p><strong>טלפון הורים:</strong> ${student?.fatherPhone || "לא זמין"}</p>
              <p><strong>קבוצה:</strong> ${student?.groupId || "לא משויך"}</p>
              <p><strong>סטטוס רישום:</strong> ${student?.registerStudent ? "רשום" : "לא רשום"}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  const imageUrl = folderPath
    ? `https://click-wise-testpnoren.s3.amazonaws.com/${folderPath}/passport.jpg`
    : `https://placehold.co/100x100?text=${student?.firstName?.charAt(0)}`;

  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        כרטיס תלמיד
        <IconButton
          edge="end"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          <Box>
            <Avatar src={imageUrl} sx={{ mr: 2 }}
              alt="תמונת תלמיד"
              style={{ width: 120, height: 150, border: "1px solid #ccc", borderRadius: 4 }}
            />
            <Typography sx={{ textAlign: "center", mt: 1, fontWeight: "bold" }}>
              {student.firstName} {student.lastName}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
            {isEditing ? (
              <>
                <TextField label="ת.ז" value={editedStudent?.id || ""} onChange={handleChange("id")} fullWidth />
                <TextField label="כתובת" value={editedStudent?.address || ""} onChange={handleChange("address")} fullWidth />
                <TextField label="משפחה" value={editedStudent?.lastName || ""} onChange={handleChange("lastName")} fullWidth />
                <TextField label="טלפון" value={editedStudent?.phone || ""} onChange={handleChange("phone")} fullWidth />
                <TextField label="שם האב" value={editedStudent?.fatherName || ""} onChange={handleChange("fatherName")} fullWidth />
                <TextField label="שם האם" value={editedStudent?.motherName || ""} onChange={handleChange("motherName")} fullWidth />
              </>
            ) : (
              <>
                <Typography><strong>ת"ז:</strong> {student.id}</Typography>
                <Typography><strong>תאריך לידה:</strong> {student.dateOfBirth}</Typography>
                <Typography><strong>גיל:</strong> {student.dateOfBirth ? calculateAge(student.dateOfBirth) : "לא זמין"}</Typography>
                <Typography><strong>כתובת:</strong> {student.address}</Typography>
                <Typography><strong>טלפון:</strong> {student.phone}</Typography>
                <Typography><strong>שם האב:</strong> {student.fatherName}</Typography>
                <Typography><strong>שם האם:</strong> {student.motherName}</Typography>
                <Typography><strong>טלפון הורים:</strong> {student.fatherPhone || "לא זמין"}</Typography>
                <Typography><strong>קבוצה:</strong> {student.groupId || "לא משויך"}</Typography>
                <Typography><strong>סטטוס רישום:</strong> {student.registerStudent ? "רשום" : "לא רשום"}</Typography>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">סגור</Button>
        {isEditing && (
          <Button onClick={() => editedStudent && onSave(editedStudent)} color="primary">שמור</Button>
        )}
        <Button onClick={handlePrint} color="secondary">הדפס</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDialog;
