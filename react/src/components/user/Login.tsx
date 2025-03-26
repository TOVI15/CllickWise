import { useState, useContext } from 'react';
import { Button, Modal, Box, Typography, TextField, Fade, AlertColor } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../main/contex';
import ErrorAlert from '../main/ErrorAlart';
import { useNavigate } from 'react-router';


const backgroundStyle = {
  backgroundImage: "url('./images/2.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  width: 420,
  backgroundColor: "#ffffff",
  border: "3px solid #1565c0",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  textAlign: "center",
};


export default function Login() {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState({ identity: '', password: '' });
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" as "success" | "error" as AlertColor });
  const [open, setOpen] = useState(true);
  const actionContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!actionContext) {
    throw new Error('UserContext must be used within a UserProvider');
  }

  const { dispatch } = actionContext;

  const handleLogin = async () => {
    setMessages({ identity: '', password: '' }); // איפוס שגיאות קודמות

    if (!identity || !password) {
      setMessages({
        identity: !identity ? 'יש להזין תעודת זהות' : '',
        password: !password ? 'יש להזין סיסמה' : '',
      });
      setAlertState({ open: true, message: "נא למלא את כל השדות", severity: "warning" });
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/user/login', { identity, password });
      dispatch({ type: 'Create_User', data: res.data.user });
      setOpen(false);
      navigate('/main');
    } catch (error: any) {
      if (error.response) {
        // טיפול בשגיאות מהשרת
        if (error.response.status === 400) {
          setMessages({ identity: 'תעודת זהות לא תקינה', password: 'סיסמה לא תקינה' });
          setAlertState({ open: true, message: "פרטים שגויים, נסה שוב", severity: "error" });
        } else if (error.response.status === 500) {
          setAlertState({ open: true, message: "שגיאת שרת, נסה שוב מאוחר יותר", severity: "error" });
        } else {
          setAlertState({ open: true, message: "אירעה שגיאה בלתי צפויה", severity: "error" });
        }
      } else {
        setAlertState({ open: true, message: "לא ניתן להתחבר לשרת", severity: "error" });
      }
    }
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentity(e.target.value);
    if (e.target.value.length > 0) {
      setMessages((prevMessages) => ({ ...prevMessages, identity: '' })); // הסרת הודעת השגיאה ברגע שמשנים
    }
    if (messages.identity === '' && messages.password === '') {
      setAlertState({ open: false, message: "", severity: "error" });
    }
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length > 0) {
      setMessages((prevMessages) => ({ ...prevMessages, password: '' })); // הסרת הודעת השגיאה ברגע שמשנים
    }
  };

  return (
    <>
      <Modal
        open={open}
        sx={backgroundStyle}
        onClose={(event, reason) => {
          console.log(event);
          if (reason === "backdropClick") return;
          setOpen(false);
        }}
        closeAfterTransition
        BackdropProps={{ sx: { backgroundColor: "transparent" } }}
      >
        <Fade in={open}>
          <Box sx={cardStyle} onClick={(e) => e.stopPropagation()}>
            <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: "bold" }}>
              הכנס תעודת זהות וסיסמה
            </Typography>

            {alertState.open && (<ErrorAlert alertState={alertState} setAlertState={setAlertState} />)}

            <TextField
              error={!!messages.identity}
              margin="normal"
              fullWidth
              label="תעודת זהות"
              helperText={messages.identity || 'הכנס ת.ז.'}
              value={identity}
              onChange={handleIdentityChange}
            />

            <TextField
              error={!!messages.password}
              margin="normal"
              fullWidth
              label="סיסמא"
              type="password"
              helperText={messages.password || 'הכנס סיסמא.'}
              value={password}
              onChange={handlePasswordChange}
            />

            <div>
              <Button variant="outlined" onClick={handleLogin} >
                לכניסה למערכת
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
