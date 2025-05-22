import { useState, useContext, useEffect, FormEvent } from 'react';
import { Button, Box, Modal, Fade, Typography, TextField, Backdrop, AlertColor } from '@mui/material';
import { Save, Upload } from '@mui/icons-material';
import axios from 'axios';
import { UserContext } from ;
import ErrorAlert from '../main/ErrorAlart';

const style = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4
};

export default function TransitionsModal() {
  const actionContext = useContext(UserContext);
  if (!actionContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { dispatch } = actionContext
  const user = actionContext.state;
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(user);
  const [messages, setMessages] = useState({ email: 'Enter Your Email.', password: 'Enter Your Password' });
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" as "success" | "error" as AlertColor })
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validate = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email || '');
    const passwordValid = /^[1-9]+$/.test(userData.password || '');
    setMessages({
      email: emailValid ? 'Your Email.' : 'Email Not Valid',
      password: passwordValid ? 'Your Password.' : 'Password Not Valid'
    });
    return emailValid && passwordValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axios.put('http://localhost:3000/api/user/', userData, {
          headers: { 'user-id': user.id }
        });
        dispatch({ type: 'UpDate_User', data: res.data });
        handleClose();
        setAlertState({ open: true, message: "Update pass successful", severity: "success" });
      } catch (error: any) {
        if (error.status === 404)
          setAlertState({ open: true, message: "User not found", severity: "error" });

      }
    }
  };
  useEffect(() => {
    validate();
  }, [userData.email, userData.password]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Button sx={{ position: 'fixed', top: 15, left: 150, zIndex: 2, '&:hover': { transform: 'scale(1.1)' } }}
        variant="contained" endIcon={<Upload />} onClick={handleOpen}>
        Update
      </Button>
      <Modal open={open} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6">Update Your Details:</Typography>
            {alertState.open && (
              <ErrorAlert alertState={alertState} setAlertState={setAlertState} />)}
            <form onSubmit={handleSubmit}>
              <TextField label="Email" name="email" value={userData.email} margin="normal"
                onChange={handleInputChange} helperText={messages.email} />
              <TextField label="Password" name="password" type="password" value={userData.password} margin="normal"
                onChange={handleInputChange} helperText={messages.password} />
              <TextField label="First Name" name="firstName" value={userData.firstName} margin="normal"
                onChange={handleInputChange} />
              <TextField label="Last Name" name="lastName" value={userData.lastName} margin="normal"
                onChange={handleInputChange} />
              <TextField label="Address" name="address" value={userData.address} margin="normal"
                onChange={handleInputChange} />
              <TextField label="Phone" name="phone" value={userData.phone} margin="normal"
                onChange={handleInputChange} />
              <div>
                <Button type="submit" variant="outlined" endIcon={<Save />}>Save</Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}