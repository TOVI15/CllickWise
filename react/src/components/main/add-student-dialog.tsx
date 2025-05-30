"use client"

import { Dialog, DialogTitle, DialogActions, DialogContent, TextField, Button } from "@mui/material"
import { useState } from "react"
import emailjs from "emailjs-com"

interface AddStudentDialogProps {
  open: boolean
  onClose: () => void
}

export function AddStudentDialog({ open, onClose }: AddStudentDialogProps) {
  const [studentEmail, setStudentEmail] = useState("")
  const [emailError, setEmailError] = useState(false)

  const handleSendStudentInvite = () => {
    const templateParams = {
      email: studentEmail,
      link: "https://cllickwise.onrender.com",
    }
    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(studentEmail)
    if (!studentEmail || !isValidEmail) {
      setEmailError(true)
      return
    }

    setEmailError(false)

    emailjs.send("service_xzn15cu", "template_sdtikhj", templateParams, "bz6VLetnSM5d0aUpJ").then(
      (response) => {
        alert("המייל נשלח בהצלחה!")
        console.log(response)
      },
      (error) => {
        alert("שגיאה בשליחת המייל: " + error.text)
      },
    )

    setStudentEmail("")
    onClose()
  }

  const handleClose = () => {
    setStudentEmail("")
    setEmailError(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        הוספת תלמיד
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="מייל התלמיד"
          type="email"
          required
          fullWidth
          onBlur={() => setEmailError(false)}
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          error={emailError}
          helperText={emailError ? "אנא הזן כתובת מייל תקינה" : " "}
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
          onClick={handleClose}
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
          onClick={handleSendStudentInvite}
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
          שלח קישור
        </Button>
      </DialogActions>
    </Dialog>
  )
}
