import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Alert, Link
} from '@mui/material';

const CreatePasswordPage = () => {
  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('הקישור שברשותך אינו תקין או שחסר מידע');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    try {
      await axios.post('https://localhost:7278/api/Users/reset-password', {
        email,
        token,
        newPassword
      });
      setMessage('הסיסמה נוצרה בהצלחה! אנא שמור אותה לכניסות הבאות לאתר.');
    } catch (err: any) {
      setError(err?.response?.data || 'אירעה שגיאה. נסה שוב.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h5" fontWeight="bold" mb={3} align="center">
          יצירת סיסמה
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message ? (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>
            <Box textAlign="center">
              <Link href="http://localhost:5173" underline="hover">
                לעבור לאתר
              </Link>
            </Box>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="סיסמה חדשה"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography variant="body2" color="text.secondary" mb={2}>
              אנא זכור את הסיסמה לצורך התחברות עתידית לאתר.
            </Typography>

            <Button variant="contained" color="primary" fullWidth type="submit">
              צור סיסמה
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default CreatePasswordPage;