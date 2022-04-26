import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
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

export default function MenuDrawer(props) {

  const drawerWidth = 250;
  const anchor='right';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsMenuOpen(props.isMenuOpen);

  }, [props.isMenuOpen])
  const handleSettingPress = ()=>{
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
      onClick={props.toggleMenu()}
      onKeyDown={props.toggleMenu()}
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
          <ListItemButton onClick= {handleSettingPress} key='settings'>
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
            onClose={props.toggleMenu()}
          >
            <DrawerHeader>
              <IconButton onClick={props.toggleMenu()}>
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
