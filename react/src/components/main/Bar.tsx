import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router';
// import { useContext } from 'react';
// import { UserContext } from './contex';

const Navbar = () => {

  // const { loginStart } = useContext(UserContext) || {};
  return (
    <AppBar color="secondary" sx={{ mb: 4, right: 0, top: 0, direction: 'rtl', zIndex: 1, bgcolor: '#bdbdbd', height: '11%' }}>
      <Toolbar variant="regular">
        <Button color="inherit" component={Link} to="/" sx={{ marginTop: 2 }}>
          Home
        </Button>
        <Button color="inherit" component={Link} to="/recipes" sx={{ marginTop: 2 }}>
          ResipesList
        </Button>
        {/* {!loginStart && <Navigate to="/" /> && <Button color="inherit" component={Link} to="/addrecipes" sx={{ marginTop: 2 }}> */}
          {/* AddRecipe */}
        {/* </Button>} */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;