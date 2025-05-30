"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import axios from "axios"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Paper,
  Fade,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Lock, Visibility, VisibilityOff, CheckCircle, Security, VpnKey } from "@mui/icons-material"

const backgroundStyle = {
  background: `
    linear-gradient(135deg, #667eea 0%, #764ba2 100%),
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.15) 0%, transparent 50%)
  `,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  backdropFilter: "blur(15px)",
  padding: "20px 0",
}

const cardStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  borderRadius: 4,
  overflow: "hidden",
  position: "relative",
  direction: "rtl",
  p: 5,
}

const headerStyle = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  p: 4,
  textAlign: "center",
  position: "relative",
  borderRadius: "16px 16px 0 0",
  mb: 4,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
  },
}

const CreatePasswordPage = () => {
  const [searchParams] = useSearchParams()
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  useEffect(() => {
    if (!token || !email) {
      setError("הקישור שברשותך אינו תקין או שחסר מידע")
    }
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPassword || newPassword.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים")
      return
    }

    try {
      await axios.post("https://click-wisw-server.onrender.com/api/Users/reset-password", {
        email,
        token,
        newPassword,
      })
      setMessage("הסיסמה נוצרה בהצלחה! אנא שמור אותה לכניסות הבאות לאתר.")
    } catch (err: any) {
      setError(err?.response?.data || "אירעה שגיאה. נסה שוב.")
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box sx={backgroundStyle}>
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper elevation={0} sx={cardStyle}>
            {/* Header Section */}
            <Box sx={headerStyle}>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <VpnKey sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "1.75rem", md: "2rem" },
                  }}
                >
                  יצירת סיסמה
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    opacity: 0.9,
                    fontSize: "1rem",
                    fontWeight: 400,
                  }}
                >
                  צור סיסמה חדשה ומאובטחת
                </Typography>
              </Box>
            </Box>

            {/* Content Section */}
            <Box sx={{ direction: "rtl" }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    "& .MuiAlert-message": {
                      textAlign: "right",
                      width: "100%",
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              {message ? (
                <Fade in={true} timeout={600}>
                  <Box>
                    <Alert
                      severity="success"
                      icon={<CheckCircle />}
                      sx={{
                        mb: 4,
                        borderRadius: 3,
                        "& .MuiAlert-message": {
                          textAlign: "right",
                          width: "100%",
                        },
                      }}
                    >
                      {message}
                    </Alert>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "rgba(102, 126, 234, 0.05)",
                        border: "1px solid rgba(102, 126, 234, 0.1)",
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                        מוכן להתחיל?
                      </Typography>
                      <Link
                        href="https://cllickwise-maneger.onrender.com"
                        underline="none"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          fontWeight: 600,
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                          },
                        }}
                      >
                        <Security fontSize="small" />
                        לעבור לאתר
                      </Link>
                    </Box>
                  </Box>
                </Fade>
              ) : (
                <Fade in={true} timeout={600}>
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 4 }}>
                      <TextField
                        label="סיסמה חדשה"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                                sx={{
                                  color: "#667eea",
                                  "&:hover": {
                                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                                  },
                                }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(102, 126, 234, 0.02)",
                            border: "2px solid transparent",
                            backgroundClip: "padding-box",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "rgba(102, 126, 234, 0.05)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.15)",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "white",
                              border: "2px solid #667eea",
                              boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 600,
                            color: "#4a5568",
                            "&.Mui-focused": {
                              color: "#667eea",
                            },
                          },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "rgba(255, 193, 7, 0.1)",
                        border: "1px solid rgba(255, 193, 7, 0.2)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#856404",
                          textAlign: "right",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Security fontSize="small" />
                        אנא זכור את הסיסמה לצורך התחברות עתידית לאתר.
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      type="submit"
                      startIcon={<VpnKey />}
                      sx={{
                        py: 2,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 10px 25px -5px rgba(102, 126, 234, 0.4)",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        gap: 1.5, // הוספת רווח בין האייקון לטקסט
                        "&:hover": {
                          background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                          boxShadow: "0 15px 35px -5px rgba(102, 126, 234, 0.5)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      צור סיסמה
                    </Button>
                  </form>
                </Fade>
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default CreatePasswordPage
