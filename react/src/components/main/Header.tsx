import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useLocation, useNavigate } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import  Search  from '../students/Search';
import { useSearch } from './contexSearch';
import SmartSearch from '../students/SmartSearch';
import { Box } from '@mui/material';

const Navbar: React.FC= () => {
  const { searchTerm, setSearchTerm, filterCriteria, setFilterCriteria } = useSearch();
  const handleSearch = (term: string) => {
    setSearchTerm(term); 
    setFilterCriteria("")
  };
  console.log(filterCriteria); 
  const location = useLocation();
  const isStudentPage = location.pathname.includes('/users');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    navigate("/");
  };
  return (
    <AppBar color="secondary" sx={{ mb: 4, right: 0, top: 0, direction: 'rtl', zIndex: 1, bgcolor: '#bdbdbd', height: '11%' }}>
      <Toolbar variant="regular">
        <Button color="inherit" component={Link} to="/" sx={{ marginTop: 2 }}>
          Home
        </Button>
        <Box>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            התנתקות
          </Button>
        </Box>
        <div>
        <Search searchTerm={searchTerm} onSearch={handleSearch} />
        {!isStudentPage && <SmartSearch/>}
  </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;