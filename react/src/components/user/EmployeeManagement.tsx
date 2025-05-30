import type React from "react"
import { useEffect, useState } from "react"
import { Box, Button, Typography, Stack, CircularProgress, type AlertColor, Card, CardContent } from "@mui/material"
import { Add, People } from "@mui/icons-material"
import axios from "axios"
import type { typeUser } from "../../moduls/User"
import EmployeeDialog from "./EmployeeDialog"
import DeleteDialog from "./DeleteDialog"
import { useSearch } from "../main/contexSearch"
import EmployeeTable from "./EmployeeTable"
import ErrorAlert from "../main/Error-alert"

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<typeUser[]>([])
  const [open, setOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [selectedEmployee, setSelectedEmployee] = useState<typeUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [alertState, setAlertState] = useState<{ open: boolean ,message: string ,severity: AlertColor}>({ open: false, message: "", severity: "success" })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<typeUser | null>(null)
  const { searchTerm } = useSearch()

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const res = await axios.get("https://click-wisw-server.onrender.com/api/Users")
      setEmployees(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setAlertState({ open: true, message: "שגיאת שרת, נסה שוב מאוחר יותר", severity: "error" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleOpenAddDialog = () => {
    setDialogMode("add")
    setSelectedEmployee(null)
    setOpen(true)
  }

  const handleOpenEditDialog = (employee: typeUser) => {
    setDialogMode("edit")
    setSelectedEmployee(employee)
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setSelectedEmployee(null)
  }

  const handleSubmit = async (formData: Omit<typeUser, "id" | "status">) => {
    try {
      if (dialogMode === "add") {
        await axios.post("https://click-wisw-server.onrender.com/api/Users", formData)
        setAlertState({ open: true, message: "עובד נוסף בהצלחה", severity: "success" })
      } else if (dialogMode === "edit" && selectedEmployee?.id) {
        await axios.put(`https://click-wisw-server.onrender.com/api/Users/${selectedEmployee.id}`, formData)
        setAlertState({ open: true, message: "העובד עודכן בהצלחה", severity: "success" })
      }
      handleCloseDialog()
      fetchEmployees()
    } catch {
      setAlertState({ open: true, message: "שגיאת שרת בפעולה, נסה שוב", severity: "error" })
    }
  }

  const handleDeleteClick = (employee: typeUser) => {
    setEmployeeToDelete(employee)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return
    try {
      await axios.delete(`https://click-wisw-server.onrender.com/api/Users/${employeeToDelete.id}`)
      setAlertState({ open: true, message: "העובד נמחק בהצלחה", severity: "success" })
      fetchEmployees()
    } catch {
      setAlertState({ open: true, message: "שגיאת שרת במחיקה, נסה שוב", severity: "error" })
    } finally {
      setDeleteDialogOpen(false)
      setEmployeeToDelete(null)
    }
  }

  return (
    <Box
      sx={{
        p: 3,
        direction: "rtl",
        maxWidth: "100%",
        mx: "auto",
        position: "relative",
        zIndex: 0,
        "& *": {
          direction: "rtl",
        },
      }}
    >
      {alertState.open && <ErrorAlert alertState={alertState} setAlertState={setAlertState} />}

      <Card
        sx={{
          mb: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          direction: "rtl",
          position: "relative",
          zIndex: 1,
          backgroundColor: "#fff",
        }}
      >
        <CardContent sx={{ direction: "rtl" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, direction: "rtl" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, direction: "rtl" }}>
              <People sx={{ fontSize: 32, color: "#1976d2" }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
                ניהול עובדים
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#666" }}>
              סה"כ עובדים: {employees.length}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ direction: "rtl" }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAddDialog}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
                borderRadius: 2,
                px: 3,
                direction: "rtl",
              }}
            >
              הוסף עובד חדש
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <EmployeeTable
          employees={employees}
          searchTerm={searchTerm}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteClick}
        />
      )}

      <EmployeeDialog
        open={open}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialData={
          dialogMode === "edit" && selectedEmployee
            ? {
                name: selectedEmployee.name,
                email: selectedEmployee.email,
                role: selectedEmployee.role,
                address: selectedEmployee.address || "",
                phone: selectedEmployee.phone || "",
                isActive: selectedEmployee.isActive,
                identity: selectedEmployee.identity,
              }
            : undefined
        }
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  )
}

export default EmployeeManagement
