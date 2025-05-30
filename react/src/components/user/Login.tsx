"use client"

import type React from "react"

import { useState, useContext } from "react"
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Fade,
  type AlertColor,
  Paper,
  Container,
  Stack,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Visibility, VisibilityOff, MenuBook, Login as LoginIcon } from "@mui/icons-material"
import axios from "axios"
import { useNavigate } from "react-router"
import { UserContext } from "../main/contexUser"
import { jwtDecode } from "jwt-decode"
import ErrorAlert from "../main/Error-alert"



const backgroundStyle = {
  background: `
    linear-gradient(135deg, #667eea 0%, #764ba2 100%),
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.15) 0%, transparent 50%)
  `,
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(15px)",
}

const cardStyle = {
  width: { xs: "90%", sm: 480, md: 520 },
  maxWidth: 520,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  borderRadius: 6,
  overflow: "hidden",
  position: "relative",
  direction: "rtl",
}

const headerStyle = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  p: 4,
  textAlign: "center",
  position: "relative",
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

export default function Login() {
  interface DecodedToken {
    nameid?: string
    NameIdentifier?: string
    sub?: string
    [key: string]: string | undefined
  }

  const [identity, setIdentity] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [messages, setMessages] = useState({ identity: "", password: "" })
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" as AlertColor,
  })
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const actionContext = useContext(UserContext)
  const navigate = useNavigate()

  if (!actionContext) {
    throw new Error("UserContext must be used within a UserProvider")
  }

  const handleLogin = async () => {
    setMessages({ identity: "", password: "" })
    setLoading(true)

    if (!identity || !password) {
      setMessages({
        identity: !identity ? "יש להזין תעודת זהות" : "",
        password: !password ? "יש להזין סיסמה" : "",
      })
      setAlertState({ open: true, message: "נא למלא את כל השדות", severity: "warning" })
      setLoading(false)
      return
    }

    try {
      const res = await axios.post("https://click-wisw-server.onrender.com/api/Auth/login", { identity, password })
      const token = res.data.token

      localStorage.setItem("token", token)
      const decodedToken = jwtDecode(token) as DecodedToken
      const userId = Number(decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"])
      const userRes = await axios.get(`https://click-wisw-server.onrender.com/api/Users/${userId}`)
      actionContext.dispatch({
        type: "Create_User",
        data: {
          ...userRes.data,
          token: token,
        },
      })

      setOpen(false)
      navigate("/main")
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessages({ identity: "תעודת זהות לא תקינה", password: "סיסמה לא תקינה" })
          setAlertState({ open: true, message: "פרטים שגויים, נסה שוב", severity: "error" })
        } else if (error.response.status === 500) {
          setAlertState({ open: true, message: "שגיאת שרת, נסה שוב מאוחר יותר", severity: "error" })
        } else {
          setAlertState({ open: true, message: "פרטים שגויים נסה שנית", severity: "error" })
        }
      } else {
        setAlertState({ open: true, message: "לא ניתן להתחבר לשרת", severity: "error" })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentity(e.target.value)
    if (e.target.value.length > 0) {
      setMessages((prevMessages) => ({ ...prevMessages, identity: "" }))
    }
    if (messages.identity === "" && messages.password === "") {
      setAlertState({ open: false, message: "", severity: "error" })
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (e.target.value.length > 0) {
      setMessages((prevMessages) => ({ ...prevMessages, password: "" }))
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <ErrorAlert alertState={alertState} setAlertState={setAlertState} />
      <Modal
        open={open}
        sx={backgroundStyle}
        onClose={(event, reason) => {
          console.log(event)
          if (reason === "backdropClick") return
          setOpen(false)
        }}
        closeAfterTransition
        BackdropProps={{ sx: { backgroundColor: "transparent" } }}
      >
        <Fade in={open} timeout={600}>
          <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
            <Paper elevation={0} sx={cardStyle} onClick={(e) => e.stopPropagation()}>
              {/* Header Section */}
              <Box sx={headerStyle}>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <MenuBook sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: "1.75rem", md: "2.125rem" },
                    }}
                  >
                    ClickWise
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      opacity: 0.9,
                      fontSize: "1.1rem",
                      fontWeight: 400,
                    }}
                  >
                    מערכת ניהול תלמידים
                  </Typography>
                </Box>
              </Box>

              {/* Content Section */}
              <Box sx={{ p: 4, direction: "rtl" }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  כניסה למערכת
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    textAlign: "center",
                    mb: 3,
                  }}
                >
                  הזן את פרטי הכניסה שלך כדי להמשיך
                </Typography>

                <Divider sx={{ mb: 3, opacity: 0.3 }} />

                <Stack spacing={3}>
                  <TextField
                    error={!!messages.identity}
                    fullWidth
                    label="תעודת זהות"
                    helperText={messages.identity || "הכנס מספר תעודת זהות"}
                    value={identity}
                    onChange={handleIdentityChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(249, 250, 251, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(249, 250, 251, 1)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "white",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontWeight: 500,
                      },
                      "& .MuiFormHelperText-root": {
                        textAlign: "right",
                        marginRight: 0,
                      },
                    }}
                  />

                  <TextField
                    error={!!messages.password}
                    fullWidth
                    label="סיסמה"
                    type={showPassword ? "text" : "password"}
                    helperText={messages.password || "הכנס סיסמה"}
                    value={password}
                    onChange={handlePasswordChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton onClick={handleTogglePasswordVisibility} edge="start" sx={{ color: "#6b7280" }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(249, 250, 251, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(249, 250, 251, 1)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "white",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontWeight: 500,
                      },
                      "& .MuiFormHelperText-root": {
                        textAlign: "right",
                        marginRight: 0,
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 10px 25px -5px rgba(102, 126, 234, 0.4)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        boxShadow: "0 15px 35px -5px rgba(102, 126, 234, 0.5)",
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        background: "linear-gradient(135deg, #9ca3af 0%, #9ca3af 100%)",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? "מתחבר..." : "כניסה למערכת"}
                  </Button>
                </Stack>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                    }}
                  >
                    מערכת מאובטחת לניהול תלמידים
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Fade>
      </Modal>
    </>
  )
}
