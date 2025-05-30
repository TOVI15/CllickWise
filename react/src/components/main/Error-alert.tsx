"use client"

import type * as React from "react"
import { Alert, Stack, IconButton, type AlertColor, Slide, Fade } from "@mui/material"
import { Close as CloseIcon, CheckCircle, Error, Warning, Info } from "@mui/icons-material"

const ErrorAlert = ({
  alertState,
  setAlertState,
}: {
  alertState: { open: boolean; message: string; severity: AlertColor }
  setAlertState: React.Dispatch<React.SetStateAction<{ open: boolean; message: string; severity: AlertColor }>>
}) => {
  const getIcon = (severity: AlertColor) => {
    switch (severity) {
      case "success":
        return <CheckCircle sx={{ fontSize: 20 }} />
      case "error":
        return <Error sx={{ fontSize: 20 }} />
      case "warning":
        return <Warning sx={{ fontSize: 20 }} />
      case "info":
        return <Info sx={{ fontSize: 20 }} />
      default:
        return null
    }
  }

  const getColors = (severity: AlertColor) => {
    switch (severity) {
      case "success":
        return {
          bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          border: "#10b981",
          shadow: "rgba(16, 185, 129, 0.25)",
        }
      case "error":
        return {
          bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          border: "#ef4444",
          shadow: "rgba(239, 68, 68, 0.25)",
        }
      case "warning":
        return {
          bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          border: "#f59e0b",
          shadow: "rgba(245, 158, 11, 0.25)",
        }
      case "info":
        return {
          bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          border: "#3b82f6",
          shadow: "rgba(59, 130, 246, 0.25)",
        }
      default:
        return {
          bg: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
          border: "#6b7280",
          shadow: "rgba(107, 114, 128, 0.25)",
        }
    }
  }

  const colors = getColors(alertState.severity)

  if (!alertState.open) return null

  return (
    <Fade in={alertState.open} timeout={300}>
      <Stack
        sx={{
          width: "100%",
          position: "fixed",
          top: 20,
          left: 0,
          right: 0,
          zIndex: 9999,
          px: 2,
          direction: "rtl",
        }}
        spacing={2}
      >
        <Slide direction="down" in={alertState.open} timeout={400}>
          <Alert
            severity={alertState.severity}
            icon={getIcon(alertState.severity)}
            action={
              <IconButton
                aria-label="סגור"
                color="inherit"
                size="small"
                onClick={() => setAlertState((prev) => ({ ...prev, open: false }))}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                  borderRadius: "50%",
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{
              maxWidth: 600,
              mx: "auto",
              background: colors.bg,
              color: "white",
              border: `1px solid ${colors.border}`,
              borderRadius: 3,
              boxShadow: `0 10px 25px -5px ${colors.shadow}, 0 10px 10px -5px ${colors.shadow}`,
              backdropFilter: "blur(10px)",
              direction: "rtl",
              "& .MuiAlert-message": {
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: 1.5,
                fontFamily: '"Segoe UI", Tahoma, Arial, Helvetica, sans-serif',
              },
              "& .MuiAlert-icon": {
                color: "white",
                opacity: 0.9,
                marginLeft: 1,
                marginRight: 0,
              },
              "& .MuiAlert-action": {
                marginLeft: 0,
                marginRight: "auto",
                paddingLeft: 0,
                paddingRight: 8,
              },
              transform: "translateY(0)",
              animation: "slideInDown 0.4s ease-out",
              "@keyframes slideInDown": {
                "0%": {
                  transform: "translateY(-100%)",
                  opacity: 0,
                },
                "100%": {
                  transform: "translateY(0)",
                  opacity: 1,
                },
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                borderRadius: "inherit",
                pointerEvents: "none",
              },
              position: "relative",
              overflow: "hidden",
            }}
          >
            {alertState.message}
          </Alert>
        </Slide>
      </Stack>
    </Fade>
  )
}

export default ErrorAlert
