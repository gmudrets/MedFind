import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { getSafe } from '../../Utils/Utils'
import * as STATE_PATHS from '../../Consts/StatePaths'

function Home() {
  const theme = createTheme();
  const navigate = useNavigate();
  const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
  
  useEffect(() => {
    if (username == ''){
        navigate("/login");
    }
  
  }, [username])
  

  return (
    <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="חיפוש תרופה"
                    inputProps={{ 'aria-label': 'חיפוש תרופה' }}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="barcode">
                    <QrCode2Icon />
                </IconButton>
                </Paper>
            </Box>
        </Container>
    </ThemeProvider>
  );
}

export default Home;