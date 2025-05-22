import { Box } from "@mui/material";
import Header from "./Header";
import { Sidebar } from "../students/Sidebar";
import { Outlet } from "react-router";
import Main from "./Main";
import { SearchProvider } from "./contexSearch";

const AppLayout = () => {
  return (
    <Box sx={{ display: "flex", paddingTop: 8.5, flexDirection: "column", height: "100vh", direction: "rtl", overflow: "hidden" }}>
      <SearchProvider>
        <Header />
        <Main />
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Sidebar />
          </Box>
          <Box sx={{ flexGrow: 1, maxHeight: "calc(100% - 75px)", overflow: "hidden", pt: 3, bgcolor: "background.paper" }}>
            <Outlet />
          </Box>
        </Box>
      </SearchProvider>
    </Box>
  );
};

export default AppLayout;
