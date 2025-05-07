import {
  Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogActions, DialogContent, TextField, Button, IconButton
} from "@mui/material";
import { Link, useLocation } from "react-router";
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from "react";
import emailjs from 'emailjs-com';

export function Sidebar() {
  const location = useLocation();
  const [openClasses, setOpenClasses] = useState(false);
  const [selectedClass, setSelectedClass] = useState({ id: 0, name: '' });
  const [classrooms, setClassrooms] = useState([
    { id: 1, name: 'כיתה א' },
    { id: 2, name: 'כיתה ב' },
    { id: 3, name: 'כיתה ג' },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [editClassId, setEditClassId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState<number | null>(null);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleClassToggle = () => {
    setOpenClasses(!openClasses);
  };

  const handleAddClass = () => {
    const newId = Date.now(); // מזהה ייחודי
    setClassrooms(prev => [...prev, { id: newId, name: newClassName }]);
    setNewClassName('');
    setShowAddDialog(false);
  };

  const handleEditClass = (id: number, name: string) => {
    setClassrooms(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleDeleteClass = () => {
    setClassrooms(prev => prev.filter(c => c.id !== classToDelete));
    setClassToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleSendStudentInvite = () => {
    const templateParams = {
      email: studentEmail,
      link: " http://localhost:5173/"  // הקישור שתשלח (אתה יכול לשנות את הקישור הזה למשהו אחר)
    };
    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(studentEmail);
    if (!studentEmail || !isValidEmail) {
      setEmailError(true);
      return;
    }

    setEmailError(false);

    emailjs.send('service_xzn15cu', 'template_sdtikhj', templateParams, 'bz6VLetnSM5d0aUpJ')
      .then((response) => {
        alert('המייל נשלח בהצלחה!');
      }, (error) => {
        alert('שגיאה בשליחת המייל: ' + error.text);
      });
    setStudentEmail('');
    setShowAddStudentDialog(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '75px',
        right: 0,
        width: 270,
        height: 'calc(100vh - 75px)',
        bgcolor: 'grey.100',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
        overflow: 'auto',
      }}
    >
      <List sx={{ color: 'primary.main' }}>
        {/* כפתור הוספת תלמיד */}
        <Box sx={{ px: 2, py: 1 }}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={() => setShowAddStudentDialog(true)}
            startIcon={<PersonAddIcon />}
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse', // מאפשר שהטקסט יהיה קודם             
            }}
          >
            הוספת תלמיד
          </Button>
        </Box>

        <Divider />

        {/* תלמידים רשומים */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/main/students"
            selected={location.pathname === "/main/students"}
          >
            <ListItemIcon sx={{ minWidth: 0, ml: 1, color: 'primary.main' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="רשומים" sx={{ textAlign: 'right' }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/main/students/status/true"
            selected={location.pathname === "/main/students/status/true"}
          >
            <ListItemIcon sx={{ minWidth: 0, ml: 1, color: 'primary.main' }}>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="תלמידים" sx={{ textAlign: 'right' }} />
          </ListItemButton>
        </ListItem>

        <Divider />
        {/* כיתות ושיעורים */}
        <ListItem disablePadding
          secondaryAction={
            <IconButton edge="start" onClick={() => setShowAddDialog(true)}>
              <AddIcon />
            </IconButton>
          }
        >
          <ListItemButton onClick={handleClassToggle}>
            <ListItemIcon sx={{ minWidth: 0, ml: 1, color: 'primary.main' }}>
              <ClassIcon />
            </ListItemIcon>
            <ListItemText
              primary="כיתות ושיעורים"
              sx={{ textAlign: 'right' }}
            />
          </ListItemButton>
        </ListItem>

        {openClasses && (
          <List sx={{ pr: 3 }}>
            {classrooms.map(classroom => (
              <ListItem key={classroom.id} disablePadding
                secondaryAction={
                  <>
                    <IconButton size="small" onClick={() => setEditClassId(classroom.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => { setClassToDelete(classroom.id); setShowDeleteDialog(true); }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                }
              >
                {editClassId === classroom.id ? (
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <TextField
                      value={classroom.name}
                      onChange={(e) => handleEditClass(classroom.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditClassId(null); 
                        }
                      }}
                      size="small"
                      fullWidth
                      autoFocus
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderColor: 'transparent', // הסרת המסגרת השחורה אחרי הפוקוס
                        },
                        '& .MuiOutlinedInput-root.Mui-focused': {
                          borderColor: 'transparent', // הסרת המסגרת גם כשיש פוקוס
                        }
                      }}
                    />
                  </Box>
                ) : (
                  <ListItemButton
                    onClick={() => setSelectedClass(classroom)}
                    component={Link}
                    to={`/main/students/course/${classroom.id}`}
                  >
                    <ListItemText primary={classroom.name} sx={{ textAlign: 'right' }} />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
        )}


        <Divider sx={{ my: 2 }} />

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/users"
            selected={location.pathname === "/users"}
          >
            <ListItemIcon sx={{ minWidth: 0, ml: 1, color: 'primary.main' }}>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="ניהול משתמשים" sx={{ textAlign: 'right' }} />
          </ListItemButton>
        </ListItem>
      </List>

      {/* דיאלוגים */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>הוספת קבוצה</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם הקבוצה"
            fullWidth
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>ביטול</Button>
          <Button onClick={handleAddClass} variant="contained">הוספה</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>מחיקת קבוצה</DialogTitle>
        <DialogContent>
          האם את בטוחה שברצונך למחוק את הקבוצה?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>ביטול</Button>
          <Button onClick={handleDeleteClass} variant="contained" color="error">מחק</Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג הוספת תלמיד */}
      <Dialog open={showAddStudentDialog} onClose={() => setShowAddStudentDialog(false)}>
        <DialogTitle>הוספת תלמיד</DialogTitle>
        <DialogContent>
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
            helperText={emailError ? 'אנא הזן כתובת מייל תקינה' : ' '}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowAddStudentDialog(false); setStudentEmail(''); setEmailError(false); }}>ביטול</Button>
          <Button onClick={handleSendStudentInvite} variant="contained">שלח קישור</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
