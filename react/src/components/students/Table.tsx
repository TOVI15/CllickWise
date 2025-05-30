"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Box, Button, Paper, TableContainer } from "@mui/material"
import { FileDownload, DeleteSweep } from "@mui/icons-material"
import axios from "axios"
import type { typeStudent } from "../../moduls/Student"
import { useSearch } from "../main/contexSearch"
import { useLocation, useParams } from "react-router"
import { getClassrooms, subscribeToClassrooms } from "../../moduls/classroom-service"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import StudentsTableHeader from "./StudentsTableHeader"
import StudentsTableBody from "./StudentsTableBody"
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"
import StudentDialog from "./StudentCard"
import type { Classroom } from "../../moduls/classroom"

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<typeStudent[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [multiDeleteMode, setMultiDeleteMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [openStudent, setOpenStudent] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeStudent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { searchTerm, filterCriteria, manualFilterOverride, setManualFilterOverride } = useSearch()
  const location = useLocation()
  const [finalFiltered, setFinalFiltered] = useState<typeStudent[]>([])
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState(0)
  const { groupId } = useParams()
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
  const statusFromPath = location.pathname.split("/")[4]

  // פונקציה לסינון תלמידים לפי הנתיב הנוכחי
  const getFilteredByRoute = (allStudents: typeStudent[]) => {
    return allStudents.filter((student) => {
      if (groupId !== undefined) {
        return student.groupId === Number(groupId)
      }
      return statusFromPath === "true" ? student.registerStudent === true : student.registerStudent === false
    })
  }

  const handleOpenDialog = (student: typeStudent, editMode = false) => {
    setSelectedStudent(student)
    setIsEditing(editMode)
    setOpenStudent(true)
  }

  const handleCloseDialog = () => {
    setOpenStudent(false)
  }

  // פונקציה לסינון לפי חיפוש/AI
  const applySearchFilter = (routeFilteredStudents: typeStudent[]) => {
    const safeSearchTerm = typeof searchTerm === "string" ? searchTerm.toLowerCase() : ""
    let filteredResults = [...routeFilteredStudents]

    if (filterCriteria && filterCriteria.startsWith("s =>")) {
      try {
        const fixedCriteria = replaceClassNamesInFilter(filterCriteria)
        const normalizedFilter = fixedCriteria.replace(/GroupId/g, "groupId")
        const filterFn = new Function("return " + normalizedFilter)()
        filteredResults = filteredResults.filter(filterFn)
        setFinalFiltered(filteredResults)
        setManualFilterOverride(true)
        return
      } catch (err) {
        console.error("שגיאה בפילטר AI:", err)
      }
    }
    if (safeSearchTerm) {
      filteredResults = filteredResults.filter((student) => {
        const nameMatch = student.firstName?.toLowerCase().includes(safeSearchTerm) || false
        const lastNameMatch = student.lastName?.toLowerCase().includes(safeSearchTerm) || false
        const idMatch = student.id?.toString().includes(safeSearchTerm) || false
        const phoneMatch = student.phone?.includes(safeSearchTerm) || false
        const addressMatch = student.address?.toLowerCase().includes(safeSearchTerm) || false
        const cityMatch = student.city?.toLowerCase().includes(safeSearchTerm) || false
        const fatherNameMatch = student.fatherName?.toLowerCase().includes(safeSearchTerm) || false

        return nameMatch || lastNameMatch || idMatch || phoneMatch || addressMatch || cityMatch || fatherNameMatch
      })
    }

    setFinalFiltered(filteredResults)
  }

  // פונקציה מרכזית לסינון
  const filterStudents = () => {
    const routeFiltered = getFilteredByRoute(students)
    applySearchFilter(routeFiltered)
  }

  const handleSaveStudent = (updatedStudent: typeStudent) => {
    // עדכון מיידי של students
    setStudents((prev) => {
      const newStudents = prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      // חישוב מיידי של הסינון עם הנתונים החדשים
      const newFilteredByRoute = getFilteredByRoute(newStudents)
      applySearchFilter(newFilteredByRoute)
      return newStudents
    })

    axios
      .put(`https://click-wisw-server.onrender.com/api/Students/${updatedStudent.id}`, updatedStudent)
      .then(() => {
        console.log("תלמיד התעדכן בשרת")
      })
      .catch((err) => {
        console.error("שגיאה בעדכון התלמיד:", err)
        setAlertState({
          open: true,
          message: "שגיאה בעדכון התלמיד. אנא נסה שוב.",
          severity: "error",
        })
      })
    handleCloseDialog()
  }

  useEffect(() => {
    axios
      .get("https://click-wisw-server.onrender.com/api/Students")
      .then((res) => {
        setStudents(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("שגיאה בטעינת נתונים:", err)
        setAlertState({ open: true, message: "אירעה שגיאה בלתי צפויה", severity: "error" as "success" | "error" })
      })

    const unsubscribe = subscribeToClassrooms((newClassrooms) => {
      setClassrooms(newClassrooms)
    })

    return () => unsubscribe()
  }, [])

  // עדכון הסינון כשמשתנים הנתונים
  useEffect(() => {
    if (!manualFilterOverride && students.length > 0) {
      filterStudents()
    } else if (manualFilterOverride) {
      setManualFilterOverride(false)
    }
  }, [location.pathname, searchTerm, filterCriteria, students, manualFilterOverride, groupId, statusFromPath])

  const replaceClassNamesInFilter = (filterCode: string): string => {
    const allClassrooms = getClassrooms()
    return filterCode.replace(/['"]?([א-ת]{1,2}|כיתה [א-ת]{1,2})['"]?/g, (match, groupName) => {
      const normalized = groupName.replace("כיתה", "").trim()
      const found = allClassrooms.find((cls) => cls.name.endsWith(normalized))
      return found ? found.id.toString() : match
    })
  }

  const handleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleDeleteClick = (id: number) => {
    setDeleteId(id)
    setMultiDeleteMode(false)
    setOpenDialog(true)
  }

  const handleDeleteSelected = () => {
    setMultiDeleteMode(true)
    setOpenDialog(true)
  }

  const exportToExcel = () => {
    const dataToExport = students.filter((s) => selectedIds.length === 0 || selectedIds.includes(s.id))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students")

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, "students.xlsx")
  }

  const confirmDelete = () => {
    if (multiDeleteMode) {
      // עדכון מיידי של students
      setStudents((prev) => {
        const newStudents = prev.filter((s) => !selectedIds.includes(s.id))
        // חישוב מיידי של הסינון עם הנתונים החדשים
        const newFilteredByRoute = getFilteredByRoute(newStudents)
        applySearchFilter(newFilteredByRoute)
        return newStudents
      })
      setSelectedIds([])

      axios
        .all(selectedIds.map((id) => axios.delete(`https://click-wisw-server.onrender.com/api/Students/${id}`)))
        .then(() => {
          console.log("נמחקו בהצלחה")
        })
        .catch((err) => {
          console.error("שגיאה במחיקה:", err)
          setAlertState({
            open: true,
            message: "שגיאה במחיקת התלמידים. אנא נסה שוב.",
            severity: "error",
          })
        })
    } else if (deleteId !== null) {
      // עדכון מיידי של students
      setStudents((prev) => {
        const newStudents = prev.filter((s) => s.id !== deleteId)
        // חישוב מיידי של הסינון עם הנתונים החדשים
        const newFilteredByRoute = getFilteredByRoute(newStudents)
        applySearchFilter(newFilteredByRoute)
        return newStudents
      })

      axios
        .delete(`https://click-wisw-server.onrender.com/api/Students/${deleteId}`)
        .then(() => {
          console.log("נמחק בהצלחה")
        })
        .catch((err) => {
          console.error("שגיאה במחיקה:", err)
          setAlertState({
            open: true,
            message: "שגיאה במחיקת התלמיד. אנא נסה שוב.",
            severity: "error",
          })
        })
    }
    setOpenDialog(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, student: typeStudent) => {
    const newGroupId = Number.parseInt(e.target.value)
    setSelectedGroup(newGroupId)
    setEditingStudentId(null)

    const updatedStudent = { ...student, groupId: newGroupId }

    // עדכון מיידי של students
    setStudents((prev) => {
      const newStudents = prev.map((s) => (s.id === student.id ? updatedStudent : s))
      // חישוב מיידי של הסינון עם הנתונים החדשים
      const newFilteredByRoute = getFilteredByRoute(newStudents)
      applySearchFilter(newFilteredByRoute)
      return newStudents
    })

    axios
      .put(`https://click-wisw-server.onrender.com/api/Students/${updatedStudent.id}`, updatedStudent)
      .then(() => {
        console.log("קבוצה התעדכנה בשרת")
      })
      .catch((err) => {
        console.error("שגיאה בעדכון הקבוצה:", err)
        setAlertState({
          open: true,
          message: "שגיאה בעדכון הקבוצה. אנא נסה שוב.",
          severity: "error",
        })
      })
  }

  const handleRegister = (student: typeStudent) => {
    const updatedStudent = { ...student, registerStudent: !student.registerStudent }

    // עדכון מיידי של students
    setStudents((prev) => {
      const newStudents = prev.map((s) =>
        s.id === student.id ? { ...s, registerStudent: updatedStudent.registerStudent } : s,
      )
      // חישוב מיידי של הסינון עם הנתונים החדשים
      const newFilteredByRoute = getFilteredByRoute(newStudents)
      applySearchFilter(newFilteredByRoute)
      return newStudents
    })

    axios
      .put(`https://click-wisw-server.onrender.com/api/Students/${student.id}`, updatedStudent)
      .then(() => {
        console.log("סטטוס התעדכן בשרת")
      })
      .catch((err) => {
        console.error("שגיאה בעדכון הסטטוס:", err)
        setAlertState({
          open: true,
          message: "שגיאה בעדכון סטטוס התלמיד. אנא נסה שוב.",
          severity: "error",
        })
      })
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      {selectedIds.length > 0 && (
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            p: 2,
            backgroundColor: "#f0f9ff",
            borderRadius: 2,
            mx: 1,
            mt: 1,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#3b82f6",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {selectedIds.length} נבחרו
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={exportToExcel}
            sx={{
              borderColor: "#3b82f6",
              color: "#3b82f6",
              fontWeight: 600,
              px: 2,
              py: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "0.8rem",
              "&:hover": {
                borderColor: "#2563eb",
                backgroundColor: "#eff6ff",
              },
            }}
          >
            <FileDownload sx={{ fontSize: 16 }} />
            ייצוא לאקסל
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDeleteSelected}
            sx={{
              backgroundColor: "#ef4444",
              fontWeight: 600,
              px: 2,
              py: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "0.8rem",
              "&:hover": {
                backgroundColor: "#dc2626",
              },
            }}
          >
            <DeleteSweep sx={{ fontSize: 16 }} />
            מחיקת נבחרים
          </Button>
        </Box>
      )}

      <Box sx={{ flex: 1, mx: 1, mb: 1 }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            border: "none",
            height: "auto",
            overflow: "visible",
          }}
        >
          <StudentsTableHeader selectedIds={selectedIds} students={students} setSelectedIds={setSelectedIds} />
          <StudentsTableBody
            loading={loading}
            finalFiltered={finalFiltered}
            selectedIds={selectedIds}
            alertState={alertState}
            onAlertStateChange={(newAlertState) =>
              setAlertState({
                ...newAlertState,
                severity: newAlertState.severity as "success" | "error",
              })
            }
            handleSelect={handleSelect}
            classrooms={classrooms}
            editingStudentId={editingStudentId}
            onEditingStudentIdChange={(id) => setEditingStudentId(id)}
            selectedGroup={selectedGroup}
            handleChange={handleChange}
            handleRegister={handleRegister}
            handleOpenDialog={handleOpenDialog}
            handleDeleteClick={handleDeleteClick}
          />
        </TableContainer>
      </Box>

      <DeleteConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        multiDeleteMode={multiDeleteMode}
        confirmDelete={confirmDelete}
      />

      <StudentDialog
        open={openStudent}
        student={selectedStudent}
        onClose={handleCloseDialog}
        onSave={handleSaveStudent}
        isEditing={isEditing}
      />
    </Box>
  )
}

export default StudentsTable
