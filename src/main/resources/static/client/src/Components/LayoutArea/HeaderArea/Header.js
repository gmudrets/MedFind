import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import logo from '../../../Assets/Images/logo.png'
import { getSafe } from '../../../Utils/Utils'
import * as STATE_PATHS from '../../../Consts/StatePaths'
import {Actions} from "../../../Redux/UI";

function Header() {
//   const navigate = useNavigate();
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUser = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
  const isMenuOpen = useSelector((state) => getSafe(STATE_PATHS.SIDE_MENU_OPEN, state));
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  useEffect(() => {
    if (currentUser === ''){
        setAuth(false);
    }
    else {
        setAuth(true);
    }
  
  }, [currentUser])

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
    // navigate("/logout");
  };

  const toggleMenu = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (!isMenuOpen) {
      dispatch(Actions.openMenu());
    }
    else {
      dispatch(Actions.closeMenu())
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="grey">
        <Toolbar>
          {auth && <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={toggleMenu()}
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>}
          <Typography component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} className="Logo" alt="logo" style={{ maxWidth: '115px' }} />
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
