"use client"

import { Dialog, DialogTitle, DialogActions, DialogContent, TextField, Button } from "@mui/material"

interface ClassroomDialogsProps {
  showAddDialog: boolean
  showDeleteDialog: boolean
  newClassName: string
  onAddDialogClose: () => void
  onDeleteDialogClose: () => void
  onNewClassNameChange: (name: string) => void
  onAddClass: () => void
  onDeleteClass: () => void
}

export function ClassroomDialogs({
  showAddDialog,
  showDeleteDialog,
  newClassName,
  onAddDialogClose,
  onDeleteDialogClose,
  onNewClassNameChange,
  onAddClass,
  onDeleteClass,
}: ClassroomDialogsProps) {
  return (
    <>
      <Dialog
        open={showAddDialog}
        onClose={onAddDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "right",
            fontWeight: 600,
            color: "#1e40af",
            borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        >
          הוספת קבוצה
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="שם הקבוצה"
            fullWidth
            value={newClassName}
            onChange={(e) => onNewClassNameChange(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused": {
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={onAddDialogClose}
            sx={{
              borderRadius: 3,
              px: 3,
              color: "#64748b",
              "&:hover": {
                background: "rgba(148, 163, 184, 0.1)",
              },
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={onAddClass}
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 3,
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 4px 15px -3px rgba(59, 130, 246, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #5b21b6 100%)",
                boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.5)",
              },
            }}
          >
            הוספה
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteDialog}
        onClose={onDeleteDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "right",
            fontWeight: 600,
            color: "#dc2626",
            borderBottom: "1px solid rgba(239, 68, 68, 0.1)",
          }}
        >
          מחיקת קבוצה
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <div style={{ textAlign: "right", color: "#374151" }}>האם את בטוחה שברצונך למחוק את הקבוצה?</div>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={onDeleteDialogClose}
            sx={{
              borderRadius: 3,
              px: 3,
              color: "#64748b",
              "&:hover": {
                background: "rgba(148, 163, 184, 0.1)",
              },
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={onDeleteClass}
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 3,
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              boxShadow: "0 4px 15px -3px rgba(239, 68, 68, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                boxShadow: "0 8px 25px -5px rgba(239, 68, 68, 0.5)",
              },
            }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
