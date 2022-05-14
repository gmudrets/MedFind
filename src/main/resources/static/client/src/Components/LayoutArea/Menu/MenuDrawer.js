import {useSelector, useDispatch} from 'react-redux';
import {Actions} from "../../../Redux/UI"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ShareIcon from '@mui/icons-material/Share';
import MedicationIcon from '@mui/icons-material/Medication';
import SearchIcon from '@mui/icons-material/Search';
import {ListItemButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import * as STATE_PATHS from "../../../Consts/StatePaths";
import {getSafe} from "../../../Utils/Utils";

export default function MenuDrawer() {

  const isMenuOpen = useSelector((state) => getSafe(STATE_PATHS.SIDE_MENU_OPEN, state));

  const drawerWidth = 250;
  const anchor='right';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    if (!isMenuOpen) {
      dispatch(Actions.openMenu());
    }
    else {
      dispatch(Actions.closeMenu());
    }
  };

  const handleSettingClick = ()=>{
    navigate("/settings");
  }

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const list = () => (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      onClick={toggleMenu()}
      onKeyDown={toggleMenu()}
    >
      <List>
          <ListItemButton key='search'>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary='חיפוש תרופה' />
          </ListItemButton>
          <ListItemButton key='myMeds'>
            <ListItemIcon>
              <MedicationIcon/>
            </ListItemIcon>
            <ListItemText primary='התרופות שלי' />
          </ListItemButton>
          <ListItemButton key='myShares'>
            <ListItemIcon>
              <ShareIcon/>
            </ListItemIcon>
            <ListItemText primary='השיתופים שלי' />
          </ListItemButton>
      </List>
      <Divider />
      <List>
          <ListItemButton key='reminders'>
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>
            <ListItemText primary='תזכורות' />
          </ListItemButton>
          <ListItemButton onClick= {handleSettingClick} key='settings'>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='הגדרות' />
          </ListItemButton>
      </List>
    </Box>
  );

  return (
    <div>
        <>
          <Drawer
            anchor={anchor}
            open={isMenuOpen}
            onClose={toggleMenu()}
          >
            <DrawerHeader>
              <IconButton onClick={toggleMenu()}>
                {anchor === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            {list()}
          </Drawer>
        </>
    </div>
  );
}
