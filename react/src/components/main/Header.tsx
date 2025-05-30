import type React from "react"
import { AppBar, Toolbar, Button, Box, Typography, IconButton, Fade, Slide, Avatar } from "@mui/material"
import { Logout as LogoutIcon, Home as HomeIcon, FilterAlt as FilterAltIcon } from "@mui/icons-material"
import { Link, useLocation, useNavigate } from "react-router"
import Search from "../students/Search"
import { useSearch } from "./contexSearch"
import SmartSearch from "../students/SmartSearch"
import { useContext, useState } from "react"
import { UserContext } from "./contexUser"

const Header: React.FC = () => {
  const { searchTerm, setSearchTerm, setFilterCriteria } = useSearch()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showSmartSearch, setShowSmartSearch] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setFilterCriteria("")
  }

  const location = useLocation()
  const actionContext = useContext(UserContext)
  const isStudentPage = location.pathname.includes("/users")
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    if (actionContext) {
      actionContext.dispatch({ type: "Delete_User", id: 0 })
    }
    navigate("/")
  }

  const currentUser = actionContext?.state

  return (
    <Slide direction="down" in={true} timeout={800}>
      <AppBar
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)",
          backdropFilter: "blur(25px)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
          color: "#374151",
          direction: "rtl",
          zIndex: 1300,
          height: "80px",
          boxShadow: "0 8px 32px -8px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 197, 253, 0.05) 100%)",
            zIndex: -1,
          },
        }}
      >
        <Toolbar
          sx={{
            height: "100%",
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Fade in={true} timeout={1000}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Button
                component={Link}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  boxShadow: "0 8px 25px -5px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px -5px rgba(102, 126, 234, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)",
                  },
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <HomeIcon sx={{ fontSize: 28 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    letterSpacing: "-0.5px",
                  }}
                >
                  ClickWise
                </Typography>
              </Button>

              {!isStudentPage && (
                <Button
                  onClick={() => setShowSmartSearch(!showSmartSearch)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    background: showSmartSearch
                      ? "linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.95) 100%)"
                      : "linear-gradient(135deg, rgba(240, 249, 255, 0.8) 0%, rgba(224, 242, 254, 0.9) 100%)",
                    color: showSmartSearch ? "#0369a1" : "#0369a1",
                    border: `1px solid ${showSmartSearch ? "rgba(6, 182, 212, 0.3)" : "rgba(59, 130, 246, 0.2)"}`,
                    borderRadius: 4,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    boxShadow: showSmartSearch
                      ? "0 8px 25px -5px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.7)"
                      : "0 4px 15px -3px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)",
                    "&:hover": {
                      background: showSmartSearch
                        ? "linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.95) 100%)"
                        : "linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.95) 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: showSmartSearch
                        ? "0 12px 35px -5px rgba(8, 145, 178, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)"
                        : "0 8px 25px -5px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.7)",
                    },
                    "&:active": {
                      background: showSmartSearch
                        ? "linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.95) 100%)"
                        : "linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.95) 100%)",
                    },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <FilterAltIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>סינון מתקדם</Typography>
                </Button>
              )}
            </Box>
          </Fade>

          <Fade in={true} timeout={1400}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flex: 1,
                maxWidth: 500,
                mx: 3,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  background: isSearchFocused
                    ? "rgba(255, 255, 255, 1)"
                    : "linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)",
                  borderRadius: 5,
                  border: isSearchFocused ? "2px solid #3b82f6" : "1px solid rgba(148, 163, 184, 0.3)",
                  boxShadow: isSearchFocused
                    ? "0 12px 35px -5px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.8)"
                    : "0 4px 20px -4px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.6)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -1,
                    left: -1,
                    right: -1,
                    bottom: -1,
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    borderRadius: "inherit",
                    opacity: isSearchFocused ? 1 : 0,
                    zIndex: -1,
                    transition: "opacity 0.4s ease",
                  },
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Search searchTerm={searchTerm} onSearch={handleSearch} />
                </Box>
              </Box>
            </Box>
          </Fade>

          <Fade in={true} timeout={1600}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  background: "linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)",
                  borderRadius: 5,
                  p: 1,
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  boxShadow: "0 4px 15px -3px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.6)",
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 15px -3px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  {currentUser?.name?.charAt(0) || "U"}
                </Avatar>

                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      lineHeight: 1.2,
                    }}
                  >
                    {currentUser?.name || "משתמש"}
                  </Typography>
                </Box>
              </Box>

              <IconButton
                onClick={handleLogout}
                sx={{
                  background: "linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)",
                  color: "#64748b",
                  width: 44,
                  height: 44,
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  borderRadius: 4,
                  boxShadow: "0 4px 15px -3px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.6)",
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(254, 226, 226, 0.8) 100%)",
                    color: "#ef4444",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px -5px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.8)",
                  },
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <LogoutIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Fade>

          {showSmartSearch && !isStudentPage && (
            <Fade in={showSmartSearch} timeout={300}>
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  right: 20,
                  mt: 2,
                  borderRadius: 5,
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
                  backdropFilter: "blur(25px)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)",
                  zIndex: 1400,
                }}
              >
                <SmartSearch />
              </Box>
            </Fade>
          )}
        </Toolbar>
      </AppBar>
    </Slide>
  )
}

export default Header
