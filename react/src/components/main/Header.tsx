import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router';
import  Search  from '../students/Search';
import { useSearch } from './contexSearch';
import SmartSearch from '../students/SmartSearch';



const Navbar: React.FC= () => {
  const { searchTerm, setSearchTerm, filterCriteria, setFilterCriteria } = useSearch();
  const handleSearch = (term: string) => {
    setSearchTerm(term); // זה החיפוש הרגיל
    setFilterCriteria("")
  };
  
  const handleSmartSearch = (criteria: { result: string }) => {
    setFilterCriteria(criteria.result);
    setSearchTerm("");
  };
  
  return (
    <AppBar color="secondary" sx={{ mb: 4, right: 0, top: 0, direction: 'rtl', zIndex: 1, bgcolor: '#bdbdbd', height: '11%' }}>
      <Toolbar variant="regular">
        <Button color="inherit" component={Link} to="/" sx={{ marginTop: 2 }}>
          Home
        </Button>
        <Button color="inherit" component={Link} to="/main/studentDatebase" sx={{ marginTop: 2 }}>
          Register
        </Button>
        <div>
        <Search searchTerm={searchTerm} onSearch={handleSearch} />
        <SmartSearch filterCriteria={filterCriteria} onSearch={handleSmartSearch} />
    {/* טבלה / תכנים אחרים */}
  </div>
        {/* {!loginStart && <Navigate to="/" /> && <Button color="inherit" component={Link} to="/addrecipes" sx={{ marginTop: 2 }}> */}
          {/* AddRecipe */}
        {/* </Button>} */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;