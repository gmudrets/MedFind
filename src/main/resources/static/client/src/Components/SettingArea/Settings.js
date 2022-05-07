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
import {useRef} from "react";
import * as STATE_PATHS from "../../Consts/StatePaths";
import {Image} from "@mui/icons-material";


// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props) {
    return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export default function Settings() {
    const profilePictureRef = useRef();
    const theme = createTheme({direction: 'rtl'});
    const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
    const phoneNum = "1111";//TODO:
    const mail = "a@gmail.com";//TODO:
    const password = "123456";//TODO
    const firstName = "abc"//TODO
    const lastName = "def"//TODO
    const handleFirstNameSubmit = (s) => {
        //TODO
        return true;
    }
    const handleLastNameSubmit = (s) => {
        //TODO
        return true;
    }
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
    const validateFirstName = (s) => {
        //TODO
        return true;
    }
    const validateLastName = (s) => {
        //TODO
        return true;
    }
    const marginY = 2;
    const m = 3;
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Box sx={{flexGrow: 1}}>
                    <Grid container columnSpacing={5} rowSpacing={2}
                          sx={isMobile ? {padding: "2%", paddingLeft: "4%"} : {paddingX: "15%", paddingY: "40px"}}>
                        <Grid item xs={12} sx={{textAlign: "left"}}>
                            <Typography component="h1" variant="subtitle1"> פרטי משתמש
                            </Typography> </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={3} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="שם משתמש" initVal={username} validate={validateName}
                                                     onSubmit={handleUserNameSubmit}/>
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={3} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="שם פרטי" initVal={firstName}
                                                     validate={validateFirstName}
                                                     onSubmit={handleFirstNameSubmit}/>
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={3} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="שם משפחה" initVal={lastName} validate={validateLastName}
                                                     onSubmit={handleLastNameSubmit}/>
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={3} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="כתובת מייל" initVal={mail} validate={validateMail}
                                                     onSubmit={handleMailSubmit}/>

                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={3} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="מס' טלפון" initVal={phoneNum} validate={validatePhoneNum}
                                                     onSubmit={handlePhoneNumSubmit}/>
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={3} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons password={true} label="ססמא" initVal={password}
                                                     validate={validatePassword} onSubmit={handlePasswordSubmit}/>

                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={3} sx={{textAlign: "center"}}>
                            <Image
                                src="data:image/jpeg;base64,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"
                            />
                            {/*<Button*/}
                            {/*    variant="contained"*/}
                            {/*    component="label"*/}
                            {/*>*/}
                            {/*    Upload File*/}
                            {/*    <input*/}
                            {/*        type="file"*/}
                            {/*        hidden*/}
                            {/*    />*/}
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

            </ThemeProvider>
        </CacheProvider>


    )
        ;
}
