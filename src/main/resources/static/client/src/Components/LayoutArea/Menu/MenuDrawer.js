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
import {useNavigate} from "react-router-dom";

export default function MenuDrawer(props) {

  const drawerWidth = 250;
  const anchor='right';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate;
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
          <ListItem button key='search'>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary='חיפוש תרופה' />
          </ListItem>
          <ListItem button key='myMeds'>
            <ListItemIcon>
              <MedicationIcon/>
            </ListItemIcon>
            <ListItemText primary='התרופות שלי' />
          </ListItem>
          <ListItem button key='myShares'>
            <ListItemIcon>
              <ShareIcon/>
            </ListItemIcon>
            <ListItemText primary='השיתופים שלי' />
          </ListItem>
      </List>
      <Divider />
      <List>
          <ListItem button key='reminders'>
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>
            <ListItemText primary='תזכורות' />
          </ListItem>
          <ListItem button onClick= {handleSettingPress} key='settings'>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='הגדרות' />
          </ListItem>
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
