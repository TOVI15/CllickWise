"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
  CircularProgress,
  Fade,
  Alert,
  Snackbar,
} from "@mui/material"
import { Tune as TuneIcon, Clear as ClearIcon, Analytics as AnalyticsIcon } from "@mui/icons-material"
import axios from "axios"
import { useSearch } from "../main/contexSearch"

export default function SmartSearch() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "error" as const })
  const {
    setFilterCriteria,
    setSearchTerm,
    setManualFilterOverride,
    triggerResetView,
    previousFilterState,
    setPreviousFilterState,
    searchTerm,
    filterCriteria,
  } = useSearch()

  const handleSmartSearch = async () => {
    if (!query.trim()) {
      if (previousFilterState) {
        setSearchTerm(previousFilterState.searchTerm)
        setFilterCriteria(previousFilterState.filterCriteria)
        setPreviousFilterState(null)
      } else {
        setSearchTerm("")
        setFilterCriteria("")
      }
      setManualFilterOverride(false)
      triggerResetView()
      return
    }

    if (!previousFilterState) {
      setPreviousFilterState({
        searchTerm: searchTerm,
        filterCriteria: filterCriteria,
      })
    }

    setLoading(true)
    try {
      const response = await axios.post("https://click-wisw-server.onrender.com/api/SmartSearch", { query })
      const result = response.data?.result
      if (typeof result === "string") {
        setFilterCriteria(result)
        setSearchTerm("")
        setManualFilterOverride(true)
      } else {
        console.warn("תוצאה לא תקינה מהחיפוש החכם", response.data)
        setAlertState({
          open: true,
          message: "התקבלה תוצאה לא תקינה מהשרת. אנא נסה שוב.",
          severity: "error",
        })
      }
    } catch (err) {
      console.error("שגיאה בחיפוש החכם:", err)
      let errorMessage = "אירעה שגיאה בחיפוש החכם. אנא נסה שוב."

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 500) {
          errorMessage = "שגיאה בשרת. אנא נסה שוב מאוחר יותר."
        } else if (err.response?.status === 404) {
          errorMessage = "שירות החיפוש החכם אינו זמין כרגע."
        } else if (err.code === "NETWORK_ERROR") {
          errorMessage = "בעיית חיבור לאינטרנט. אנא בדוק את החיבור שלך."
        }
      }

      setAlertState({
        open: true,
        message: errorMessage,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
  }

  const handleClear = () => {
    setQuery("")
    if (previousFilterState) {
      setSearchTerm(previousFilterState.searchTerm)
      setFilterCriteria(previousFilterState.filterCriteria)
      setPreviousFilterState(null)
    } else {
      setSearchTerm("")
      setFilterCriteria("")
    }
    setManualFilterOverride(false)
    triggerResetView()
  }

  const handleCloseAlert = () => {
    setAlertState({ ...alertState, open: false })
  }

  return (
    <>
      <Fade in={true} timeout={300}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            minWidth: 500,
            direction: "rtl",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
            },
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2, position: "relative", zIndex: 1 }}>
            <AnalyticsIcon
              sx={{
                color: "#6b7280",
                fontSize: 28,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#374151",
                fontWeight: 600,
                fontSize: "1.25rem",
              }}
            >
              סינון מתקדם
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mb: 3,
              fontSize: "1rem",
              lineHeight: 1.5,
              position: "relative",
              zIndex: 1,
            }}
          >
            תאר במילים מה אתה מחפש והמערכת תמצא עבורך את התלמידים המתאימים
          </Typography>

          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
            <TextField
              fullWidth
              placeholder="לדוגמה: תלמידים בקבוצה מספר 2"
              value={query}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSmartSearch()
                }
              }}
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5, mr: 2 }}>
                    <TuneIcon sx={{ color: "#6b7280", fontSize: 22 }} />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end" sx={{ alignSelf: "flex-start", mt: 1.5, ml: 2 }}>
                    <Button
                      size="small"
                      onClick={handleClear}
                      sx={{
                        minWidth: "auto",
                        p: 1,
                        color: "#6b7280",
                        "&:hover": {
                          color: "#ef4444",
                          background: "rgba(239, 68, 68, 0.1)",
                        },
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </Button>
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
                    boxShadow: "0 0 0 3px rgba(107, 114, 128, 0.1)",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleSmartSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                color: "white",
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1.1rem",
                boxShadow: "0 10px 25px -5px rgba(107, 114, 128, 0.4)",
                minWidth: 140,
                height: "fit-content",
                "&:hover": {
                  background: "linear-gradient(135deg, #4b5563 0%, #374151 100%)",
                  boxShadow: "0 15px 35px -5px rgba(107, 114, 128, 0.5)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "מחפש..." : "חפש"}
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* Error Alert Only */}
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 2 }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            fontWeight: 500,
            fontSize: "0.95rem",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </>
  )
}
