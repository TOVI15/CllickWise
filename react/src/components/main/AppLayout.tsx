import { Box, Paper, alpha } from "@mui/material"
import Header from "./Header"
import { Outlet } from "react-router"
import { SearchProvider } from "./contexSearch"
import { Sidebar } from "./sidebar"

const AppLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        direction: "rtl",
        overflow: "hidden",
        background: `linear-gradient(135deg, 
          ${alpha("#f8fafc", 0.8)} 0%, 
          ${alpha("#f1f5f9", 0.9)} 25%, 
          ${alpha("#e2e8f0", 0.7)} 50%, 
          ${alpha("#f8fafc", 0.8)} 75%, 
          ${alpha("#ffffff", 0.9)} 100%)`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha("#ddd6fe", 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha("#bfdbfe", 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, ${alpha("#fecaca", 0.05)} 0%, transparent 50%)`,
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      <SearchProvider>
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Header />
        </Box>

        {/* Content Area with Sidebar */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Sidebar - Fixed positioning handled by the component itself */}
          <Sidebar />

          {/* Main Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              marginRight: "240px",
              p: 2,
              pt: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.1)",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 12px 40px -8px rgba(0, 0, 0, 0.15)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "16px 16px 0 0",
                },
                // Completely removed any left border styling
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  overflow: "auto",
                  p: 3,
                  position: "relative",
                  zIndex: 1,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(0, 0, 0, 0.05)",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#9ca3af",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "#6b7280",
                    },
                  },
                }}
              >
                <Outlet />
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Floating Elements for Visual Interest */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${alpha("#667eea", 0.1)} 0%, ${alpha("#764ba2", 0.05)} 100%)`,
            filter: "blur(40px)",
            animation: "float 6s ease-in-out infinite",
            zIndex: 0,
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px) rotate(0deg)",
              },
              "50%": {
                transform: "translateY(-20px) rotate(180deg)",
              },
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "30%",
            left: "15%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${alpha("#f59e0b", 0.08)} 0%, ${alpha("#ef4444", 0.05)} 100%)`,
            filter: "blur(30px)",
            animation: "float 8s ease-in-out infinite reverse",
            zIndex: 0,
          }}
        />
      </SearchProvider>
    </Box>
  )
}

export default AppLayout
