"use client"

import { ListItem, ListItemButton, ListItemText, IconButton, TextField, Box } from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { Link, useLocation } from "react-router"
import { Classroom } from "../../moduls/classroom"

interface ClassroomItemProps {
  classroom: Classroom
  isEditing: boolean
  onEdit: (id: number, name: string) => void
  onStartEdit: (id: number) => void
  onStopEdit: () => void
  onDelete: (id: number) => void
}

export function ClassroomItem({ classroom, isEditing, onEdit, onStartEdit, onStopEdit, onDelete }: ClassroomItemProps) {
  const location = useLocation()
  const isSelected = location.pathname === `/main/students/course/${classroom.id}`

  return (
    <ListItem
      key={classroom.id}
      disablePadding
      sx={{
        mb: 0.25,
        mx: 0.5,
        borderRadius: 2,
        background: isSelected ? "rgba(59, 130, 246, 0.08)" : "transparent",
        border: isSelected ? "1px solid rgba(59, 130, 246, 0.15)" : "1px solid transparent",
        transition: "all 0.2s ease",
        "&:hover": {
          background: isSelected ? "rgba(59, 130, 246, 0.12)" : "rgba(248, 250, 252, 0.8)",
          border: isSelected ? "1px solid rgba(59, 130, 246, 0.15)" : "1px solid rgba(148, 163, 184, 0.15)",
        },
      }}
    >
      {isEditing ? (
        <Box sx={{ display: "flex", width: "100%", p: 0.5, alignItems: "center" }}>
          <TextField
            value={classroom.name}
            onChange={(e) => onEdit(classroom.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onStopEdit()
              }
            }}
            size="small"
            fullWidth
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                background: "rgba(255, 255, 255, 0.9)",
                fontSize: "0.875rem",
                "&:hover": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiOutlinedInput-input": {
                py: 0.5,
              },
            }}
          />
          {/* Icons on the left side during editing */}
          <Box sx={{ display: "flex", gap: 0.25, ml: 1 }}>
            <IconButton
              size="small"
              onClick={() => onStopEdit()}
              sx={{
                color: "#64748b",
                width: 24,
                height: 24,
                "&:hover": {
                  color: "#3b82f6",
                  background: "rgba(59, 130, 246, 0.1)",
                },
                "& svg": {
                  fontSize: "0.875rem",
                },
              }}
            >
              ✓
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <ListItemButton
            component={Link}
            to={`/main/students/course/${classroom.id}`}
            sx={{
              borderRadius: 2,
              py: 0.75,
              px: 1.5,
              minHeight: "auto",
              flex: 1,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <ListItemText
              primary={classroom.name}
              sx={{
                textAlign: "right",
                "& .MuiTypography-root": {
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? "#1e40af" : "#374151",
                  fontSize: "0.875rem",
                },
              }}
            />
          </ListItemButton>

          {/* Icons on the left side */}
          <Box sx={{ display: "flex", gap: 0.25, ml: 1 }}>
            <IconButton
              size="small"
              onClick={() => onStartEdit(classroom.id)}
              sx={{
                color: "#64748b",
                width: 24,
                height: 24,
                "&:hover": {
                  color: "#3b82f6",
                  background: "rgba(59, 130, 246, 0.1)",
                },
                "& svg": {
                  fontSize: "0.875rem",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(classroom.id)}
              sx={{
                color: "#64748b",
                width: 24,
                height: 24,
                "&:hover": {
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.1)",
                },
                "& svg": {
                  fontSize: "0.875rem",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </ListItem>
  )
}
