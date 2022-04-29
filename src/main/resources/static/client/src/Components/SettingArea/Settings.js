import * as React from 'react';
import Box from '@mui/material/Box';

import {createTheme} from "@mui/material/styles";
import {CacheProvider, ThemeProvider} from "@emotion/react";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Grid from "@mui/material/Grid";
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import {Button} from "@mui/material";
import EditableTextWithButtons from "../UI/EditableTextWithButtons";
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import Typography from "@mui/material/Typography";
import SettingsCheckBox from "../UI/SettingsCheckBox";
import {isMobile} from "react-device-detect";
import {prefixer} from 'stylis';
import * as STATE_PATHS from "../../Consts/StatePaths";

// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props) {
    return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export default function Settings() {
    const theme = createTheme({direction: 'rtl'});
    const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
    const phoneNum = "1111";//TODO:
    const mail = "a@gmail.com";//TODO:
    const password = "123456";//TODO
    const handleUserNameSubmit = (s) => {
        //TODO
        return true;
    }
    const handleMailSubmit = (s) => {
        //TODO
        return true;

    }
    const handlePhoneNumSubmit = (s) => {
        //TODO
        return true;

    }
    const handlePasswordSubmit = (s) => {
        //TODO
        return true;
    }
    const validateName = (s) => {
        //TODO
        return true;

    }

    const validateMail = (s) => {
        //TODO
        return true;

    }
    const validatePhoneNum = (s) => {
        //TODO
        return true;

    }
    const validatePassword = (s) => {
        //TODO
        return true;
    }
    const marginY = 2;
    const m = 3;
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <React.Fragment>
                    <Box sx={{flexGrow: 1}}>
                        <Grid container columnSpacing={5} rowSpacing={2}
                              sx={isMobile ? {padding: "2%", paddingLeft: "4%"} : {padding: "40px"}}>
                            <Grid item xs={12} sx={{textAlign: "left"}}>
                                <Typography component="h1" variant="subtitle1"> פרטי משתמש
                                </Typography> </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons label="שם משתמש" initVal={username} validate={validateName}
                                                         onSubmit={handleUserNameSubmit}/>
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons label="שם פרטי" initVal={firstName} validate={validateFirstName}
                                                         onSubmit={handleFir}/>
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons label="שם משפחה" initVal={username} validate={validateName}
                                                         onSubmit={handleUserNameSubmit}/>
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons label="מייל" initVal={mail} validate={validateMail}
                                                         onSubmit={handleMailSubmit}/>

                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons label="טלפון" initVal={phoneNum} validate={validatePhoneNum}
                                                         onSubmit={handlePhoneNumSubmit}/>
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons password={true} label="ססמא" initVal={password}
                                                         validate={validatePassword} onSubmit={handlePasswordSubmit}/>

                            </Grid>
                            <Box width="100%"/>
                            <Grid item xs={4} sx={{textAlign: "left", marginTop: "30px"}}>
                                <Box sx={{flexGrow: 1}} xs={6} sx={{textAlign: "left"}}>
                                    <Typography component="h1" variant="subtitle1">קבלת התראות</Typography>
                                    <Grid container columnSpacing={2}>
                                        <Grid item md={3} sx={{textAlign: "center"}}>
                                            <SettingsCheckBox label="מייל"/>
                                        </Grid>
                                        <Grid item md={3} sx={{textAlign: "center"}}>
                                            <SettingsCheckBox label="טלפון"/>
                                        </Grid>
                                        <Grid item md={3} sx={{textAlign: "center"}}>
                                            <SettingsCheckBox label="דפדפן"/>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{textAlign: "left", marginTop: "30px"}}>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography component="h1" variant="subtitle1">סוג התראות</Typography>
                                    <Grid container>
                                        <Grid item md={5} sx={{textAlign: "center"}}>
                                            <SettingsCheckBox label="לקיחת תרופה"/>
                                        </Grid>
                                        <Grid item md={5} sx={{textAlign: "center"}}>
                                            <SettingsCheckBox label="סיום תוקף"/>
                                        </Grid>

                                    </Grid>
                                </Box>
                            </Grid>
                            <Box width="100%"/>
                            <Grid item md={4} xs={12} sx={{textAlign: "left", marginTop: "30px"}}>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography component="h1" variant="subtitle1">ניווט</Typography>
                                    <Grid container>
                                        <Grid item md={6} sx={{textAlign: "center"}}>
                                            <Button variant={"outlined"} startIcon={<ArrowForwardIcon/>}>חזור
                                                לחיפוש</Button>
                                        </Grid>

                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </React.Fragment>

            </ThemeProvider>
        </CacheProvider>


    )
        ;
}
