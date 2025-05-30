"use client"

import { Box, Divider, List, Button, IconButton, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  ManageAccounts as ManageAccountsIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material"
import { NavigationItem } from "./navigation-item"
import { ClassroomItem } from "./classroom-item"
import { AddStudentDialog } from "./add-student-dialog"
import { ClassroomDialogs } from "./classroom-dialogs"
import {
  addClassroom,
  deleteClassroom,
  getClassrooms,
  subscribeToClassrooms,
  updateClassroom,
} from "../../moduls/classroom-service"
import { UserContext } from "./contexUser"

export function Sidebar() {
  const [openClasses, setOpenClasses] = useState(false)
  const user = useContext(UserContext)
  const [classrooms, setClassrooms] = useState(getClassrooms())
  const { state } = user || {}

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newClassName, setNewClassName] = useState("")
  const [editClassId, setEditClassId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [classToDelete, setClassToDelete] = useState<number | null>(null)
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToClassrooms(setClassrooms)
    return () => unsubscribe()
  }, [])

  const handleClassToggle = () => {
    setOpenClasses(!openClasses)
  }

  const handleAddClass = () => {
    const newId = Date.now()
    addClassroom({ id: newId, name: newClassName })
    setNewClassName("")
    setShowAddDialog(false)
  }

  const handleEditClass = (id: number, name: string) => {
    updateClassroom({ id, name })
  }

  const handleDeleteClass = () => {
    if (classToDelete !== null) {
      deleteClassroom(classToDelete)
    }
    setClassToDelete(null)
    setShowDeleteDialog(false)
  }

  const handleStartEdit = (id: number) => {
    setEditClassId(id)
  }

  const handleStopEdit = () => {
    setEditClassId(null)
  }

  const handleDeleteClick = (id: number) => {
    setClassToDelete(id)
    setShowDeleteDialog(true)
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: "80px",
        right: 0,
        width: 240,
        height: "calc(100vh - 80px)",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderLeft: "1px solid rgba(59, 130, 246, 0.1)",
        boxShadow: "-4px 0 15px -3px rgba(59, 130, 246, 0.1)",
        display: "flex",
        flexDirection: "column",
        direction: "rtl",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "0px", // הסרת הגלילה האפורה
        },
      }}
    >
      <List sx={{ color: "primary.main", p: 1.5 }}>
        {/* Add Student Button */}
        <Box sx={{ mb: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setShowAddStudentDialog(true)}
            startIcon={<PersonAddIcon />}
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              borderRadius: 2,
              py: 1,
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              fontWeight: 600,
              fontSize: "0.875rem",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #5b21b6 100%)",
              },
              "& .MuiButton-startIcon": {
                "& svg": {
                  fontSize: "1.1rem",
                },
              },
            }}
          >
            הוספת תלמיד
          </Button>
        </Box>

        <Divider sx={{ mb: 1.5, borderColor: "rgba(59, 130, 246, 0.1)" }} />

        {/* Navigation Items */}
        <NavigationItem to="/main/students" icon={<PeopleIcon />} text="רשומים" />

        <NavigationItem to="/main/students/status/true" icon={<SchoolIcon />} text="תלמידים" />

        <Divider sx={{ my: 1.5, borderColor: "rgba(59, 130, 246, 0.1)" }} />

        {/* Classes Section - Custom layout */}
        <Box
          sx={{
            mb: 0.5,
            mx: 0.5,
            borderRadius: 2,
            background: openClasses ? "rgba(59, 130, 246, 0.08)" : "transparent",
            border: openClasses ? "1px solid rgba(59, 130, 246, 0.15)" : "1px solid transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              background: openClasses ? "rgba(59, 130, 246, 0.12)" : "rgba(248, 250, 252, 0.8)",
              border: openClasses ? "1px solid rgba(59, 130, 246, 0.15)" : "1px solid rgba(148, 163, 184, 0.15)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 0.75,
              px: 1.5,
              cursor: "pointer",
            }}
            onClick={handleClassToggle}
          >
            {/* Right side - Icon and text (like other navigation items) */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <ClassIcon
                sx={{
                  color: openClasses ? "#3b82f6" : "#64748b",
                  fontSize: "1.1rem",
                  transition: "color 0.2s ease",
                }}
              />
              <Typography
                sx={{
                  fontWeight: openClasses ? 600 : 500,
                  color: openClasses ? "#1e40af" : "#374151",
                  fontSize: "0.875rem",
                  transition: "color 0.2s ease",
                }}
              >
                כיתות ושיעורים
              </Typography>
            </Box>

            {/* Left side - Plus button */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setShowAddDialog(true)
              }}
              sx={{
                color: "#64748b",
                width: 28,
                height: 28,
                "&:hover": {
                  color: "#3b82f6",
                  background: "rgba(59, 130, 246, 0.1)",
                },
                "& svg": {
                  fontSize: "1.1rem",
                },
                transition: "all 0.2s ease",
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Classroom List */}
        {openClasses && (
          <List sx={{ pr: 1.5, mt: 0.5 }}>
            {classrooms.map((classroom) => (
              <ClassroomItem
                key={classroom.id}
                classroom={classroom}
                isEditing={editClassId === classroom.id}
                onEdit={handleEditClass}
                onStartEdit={handleStartEdit}
                onStopEdit={handleStopEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </List>
        )}

        <Divider sx={{ my: 1.5, borderColor: "rgba(59, 130, 246, 0.1)" }} />

        {/* Admin Section */}
        {state?.role === "Admin" && (
          <NavigationItem to="/main/users" icon={<ManageAccountsIcon />} text="ניהול משתמשים" />
        )}
      </List>

      {/* Dialogs */}
      <AddStudentDialog open={showAddStudentDialog} onClose={() => setShowAddStudentDialog(false)} />

      <ClassroomDialogs
        showAddDialog={showAddDialog}
        showDeleteDialog={showDeleteDialog}
        newClassName={newClassName}
        onAddDialogClose={() => setShowAddDialog(false)}
        onDeleteDialogClose={() => setShowDeleteDialog(false)}
        onNewClassNameChange={setNewClassName}
        onAddClass={handleAddClass}
        onDeleteClass={handleDeleteClass}
      />
    </Box>
  )
}
