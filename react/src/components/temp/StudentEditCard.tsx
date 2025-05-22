import { useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { typeStudent } from "../../moduls/Student";

const EditStudent = () => {
    const { id } = useParams(); // קבלת ה-ID מהנתיב
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode") || "view";

    const [student, setStudent] = useState<typeStudent | null>(null);

    useEffect(() => {
        // שליפה מהשרת (כרגע מדומה)
        const fetchedStudent = {
            firstName: student?.firstName,
            lastName: student?.lastName,
            fatherName: student?.fatherName,
            motherName: student?.motherName,
            dateOfBirth: student?.dateOfBirth,
            hebrewDateOfBirth: student?.hebrewDateOfBirth,
            identityNumber: student?.identityNumber,
            healthInsurance: student?.healthInsurance,
            yeshivaName: student?.yeshivaName,
            fatherOccupation: student?.fatherOccupation,
            fatherPhone: student?.fatherPhone,
            motherOccupation: student?.motherOccupation,
            motherPhone: student?.motherPhone,
            motherPreviousFamily: student?.motherPreviousFamily,
            address: student?.address,
        };
        setStudent(fetchedStudent);
    }, [id]);

    const handleSave = () => {
        console.log("שמור שינויים:", student);
        // כאן ישלח עדכון לשרת
    };

    if (!student) return <Typography>טוען נתונים...</Typography>;

    return (
        <Box sx={{ width: "50%", margin: "0 auto", padding: 4, bgcolor: "#E3F2FD", borderRadius: 3 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
                {mode === "edit" ? "עריכת תלמיד" : "פרטי תלמיד"}
            </Typography>

            <TextField
                fullWidth
                label="שם פרטי"
                value={student.firstName}
                disabled={mode === "view"}
                onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="שם משפחה"
                value={student.lastName}
                disabled={mode === "view"}
                onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="כתובת"
                value={student.address}
                disabled={mode === "view"}
                onChange={(e) => setStudent({ ...student, address: e.target.value })}
                sx={{ mb: 2 }}
            />

            {mode === "edit" && (
                <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
                    שמור שינויים
                </Button>
            )}
        </Box>
    );
};

export default EditStudent;
