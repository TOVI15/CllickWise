import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack,
} from "@mui/material";
import { typeUser } from "../../moduls/User";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<typeUser, "id" | "status">) => void;
  initialData?: Omit<typeUser, "id" | "status" | "token" | "password">;
};

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
};

const EmployeeDialog: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(defaultForm);

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
          isActive: initialData.isActive
        });
      } else {
        setForm(defaultForm); 
      }
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setForm(defaultForm);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} dir="rtl">
      <DialogTitle>{initialData ? "עריכת עובד" : "הוספת עובד"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="name" label="שם מלא" value={form.name} onChange={handleChange} fullWidth />
          <TextField name="email" label="אימייל" value={form.email} onChange={handleChange} fullWidth type="email" />
          <TextField name="identity" label="ת.ז." value={form.identity} onChange={handleChange} fullWidth />
          <TextField name="phone" label="טלפון" value={form.phone} onChange={handleChange} fullWidth />
          <TextField name="address" label="כתובת" value={form.address} onChange={handleChange} fullWidth />
          <TextField name="role" label="תפקיד" value={form.role} onChange={handleChange} fullWidth />       
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ביטול</Button>
        <Button onClick={() => onSubmit(form)} variant="contained">שמור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDialog;