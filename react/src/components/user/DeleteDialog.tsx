import type React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider } from "@mui/material"
import { Warning, Delete, Cancel } from "@mui/icons-material"

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DeleteDialog: React.FC<Props> = ({ open, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          zIndex: 1400,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, pt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Warning sx={{ color: "#f57c00", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", flex: 1 }}>
            אישור מחיקה
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.6 }}>
          האם את בטוחה שברצונך למחוק את העובד?
        </Typography>
        <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
          פעולה זו לא ניתנת לביטול
        </Typography>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, justifyContent: "flex-start", gap: 2 }}>
        <Button
          onClick={onCancel}
          sx={{
            color: "#666",
            borderColor: "#e0e0e0",
            "&:hover": {
              borderColor: "#bdbdbd",
              backgroundColor: "#f5f5f5",
            },
            borderRadius: 2,
            px: 3,
            py: 1,
            gap: 1,
          }}
          variant="outlined"
        >
          <Cancel fontSize="small" />
          ביטול
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#c62828",
            },
            borderRadius: 2,
            px: 3,
            py: 1,
            gap: 1,
          }}
        >
          <Delete fontSize="small" />
          מחק
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
