import { useState, FormEvent } from 'react';
import { Modal, Backdrop, Box, Fade, Button, TextField, Typography, AlertColor} from '@mui/material';
import { Edit, Send as SendIcon} from '@mui/icons-material';
import axios from 'axios';
import ErrorAlert from '../main/ErrorAlart';
import React from 'react';

const style = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
};

export default function TransitionsModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', identity: '', firstName: '', lastName: '', address: '', phone: '',
  });
  const [errors, setErrors] = useState({ email: '', password: '', identity: '' });
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" as "success" | "error" as AlertColor })
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await axios.post('http://localhost:3000/api/user/register', formData);
      handleClose();
      if (res.data.state === 201 || res.data.state === 400) {
        setAlertState({ open: true, message: res.data.message, severity: "success" });
      }
    } catch (error: any) {
      setAlertState({ open: true, message: "Something went wrong, Try again.", severity: "error" });
    }
  };

  const isValidIsraeliId = (id: string) => {
    id = id.trim().padStart(9, "0"); 
    if (!/^\d{9}$/.test(id)) return false; 

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let num = Number(id[i]) * ((i % 2) + 1);
      sum += num > 9 ? num - 9 : num;
    }
    return sum % 10 === 0;
  };

  const validateForm = () => {
    const { email, password, identity } = formData;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = /^[A-Za-z0-9]{8,}$/.test(password);
    const identityValid = isValidIsraeliId(identity);
    setErrors({
      email: emailValid ? '' : 'Email Not Valid',
      password: passwordValid ? '' : 'Password Not Valid',
      identity: identityValid ? '' : 'Identitey Not Valid',
    });
    return emailValid && passwordValid && identityValid;
  };

  return (
    <div>
      <Button
        sx={{ position: 'fixed', zIndex: 2 , top: 15, left: 150, '&:hover': { transform: 'scale(1.1)' } }}
        variant="contained" endIcon={<Edit />} onClick={handleOpen} >
        לרישום
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }} >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6">הכנס פרטים:</Typography>
            <form onSubmit={handleSubmit}>
              {alertState.open && (
                <ErrorAlert alertState={alertState} setAlertState={setAlertState} />)}
              <TextField
                label="אימייל" type="email" name="email"
                value={formData.email}
                onChange={handleChange}
                helperText={errors.email || 'הכנס אימייל.'}
              />
              <TextField
                label="סיסמא" type="password" name="password"
                value={formData.password}
                onChange={handleChange}
                helperText={errors.password || 'הכנס סיסמא.'}
                margin="normal"
              />
               <TextField
                label="תעודת זהות" type="text" name="identity"
                value={formData.identity}
                onChange={handleChange}
                helperText={errors.identity || 'הכנס ת.ז.'}
                margin="normal"
              />
              {/* <TextField
                label="Identity"
                type={showIdentity ? "text" : "password"}
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                helperText={errors.identity || "Enter your identity."}
                margin="normal"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showIdentity ? "Hide identity" : "Show identity"}
                        onClick={() => setShowIdentity(!showIdentity)}
                        edge="end"
                      >
                        {showIdentity ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              /> */}
              <TextField
                label="שם פרטי" name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                label="שם משפחה" name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                label="כתובת" name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                label="טלפון" name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
              />

              <div><Button type="submit" variant="outlined" endIcon={<SendIcon />}>
                כניסה </Button></div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}