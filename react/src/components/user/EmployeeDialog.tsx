import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Box, Typography, Divider,
} from "@mui/material"
import { Person, Save, Cancel } from "@mui/icons-material"
import type { typeUser } from "../../moduls/User"

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (formData: Omit<typeUser, "id" | "status">) => void
  initialData?: Omit<typeUser, "id" | "status" | "token" | "password">
}

const defaultForm = {
  name: "",
  email: "",
  identity: "",
  password: "",
  phone: "",
  address: "",
  token: "",
  isActive: true,
  role: "",
}

const EmployeeDialog: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          name: initialData.name || "",
          email: initialData.email || "",
          identity: initialData.identity || "",
          role: initialData.role || "",
          phone: initialData.phone || "",
          address: initialData.address || "",
          password: "",
          token: "",
          isActive: initialData.isActive,
        })
      } else {
        setForm(defaultForm)
      }
    }
  }, [open, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleClose = () => {
    setForm(defaultForm)
    onClose()
  }

  const handleSubmit = () => {
    onSubmit(form)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          <Person sx={{ color: "#1976d2", fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", flex: 1 }}>
            {initialData ? "עריכת עובד" : "הוספת עובד חדש"}
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "#666", fontWeight: 500 }}>
              פרטים אישיים
            </Typography>
            <Stack spacing={2}>
              <TextField
                name="name"
                label="שם מלא"
                value={form.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="יוסי כהן"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                name="identity"
                label="תעודת זהות"
                value={form.identity}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="123456789"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "#666", fontWeight: 500 }}>
              פרטי קשר
            </Typography>
            <Stack spacing={2}>
              <TextField
                name="email"
                label="כתובת אימייל"
                value={form.email}
                onChange={handleChange}
                fullWidth
                type="email"
                variant="outlined"
                placeholder="example@email.com"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                name="phone"
                label="מספר טלפון"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="050-1234567"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                name="address"
                label="כתובת מגורים"
                value={form.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="רחוב הרצל 123, תל אביב"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "#666", fontWeight: 500 }}>
              פרטי עבודה
            </Typography>
            <TextField
              name="role"
              label="תפקיד"
              value={form.role}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="מורה, מנהל, מזכיר..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, justifyContent: "flex-start", gap: 2 }}>
        <Button
          onClick={handleClose}
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
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
            borderRadius: 2,
            px: 3,
            py: 1,
            gap: 1,
          }}
        >
          <Save fontSize="small" />
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmployeeDialog
