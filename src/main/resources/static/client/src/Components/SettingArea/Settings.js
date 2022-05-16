import * as React from 'react';
import Box from '@mui/material/Box';

import {createTheme} from "@mui/material/styles";
import {CacheProvider, ThemeProvider} from "@emotion/react";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Grid from "@mui/material/Grid";
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import {Button, Dialog} from "@mui/material";
import EditableTextWithButtons from "../UI/EditableTextWithButtons";
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import Typography from "@mui/material/Typography";
import SettingsCheckBox from "../UI/SettingsCheckBox";
import {isMobile} from "react-device-detect";
import {prefixer} from 'stylis';
import {useEffect, useReducer, useRef, useState} from "react";
import * as STATE_PATHS from "../../Consts/StatePaths";
import {Image, Password} from "@mui/icons-material";
import ProfilePicturePicker from "./ProfilePicturePicker";
import Divider from "@mui/material/Divider";
import PasswordShower from "../UI/PaswordShower";
import {useNavigate} from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';



// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props) {
    return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export default function Settings() {
    const phoneNum = "1111";//TODO:
    const mail = "a@gmail.com";//TODO:
    const password = "123456";//TODO
    const firstName = "abc"//TODO
    const lastName = "def"//TODO


    const profilePictureRef = useRef();
    const secondPasswordRef = useRef();
    const goBackButtonRef = useRef();
    const navigate = useNavigate();

    const theme = createTheme({direction: 'rtl'});
    const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
    const [keyToRerenderPass2, forceUpdatePass2] = useReducer(x => x + 1, 0);
    const [keyToRerenderShowPass, forceUpdateShowPass] = useReducer(x => x + 1, 0);

    const [editPasswordMode, setEditPasswordMode] = React.useState(false);
    const [firstNewPassword, setFirstNewPassword] = React.useState("");
    const [secondPasswordFocus, setSecondPasswordFocus] = React.useState(false);
    const [somthingEdited, setSomthingEdited] = React.useState(false);
    const [fieldsOnEditMode, setFieldsOnEditMode] = React.useState([]);
    const [goBackDialogOpen,setGoBackDialogOpen] = React.useState(false);
    const [curPassword, setCurPassword] = React.useState(password);


    const startEditPasswordMode = () => {
        setEditPasswordMode(true);
    }
    const closeEditPasswordMode = () => {
        setEditPasswordMode(false);
        setSecondPasswordFocus(false);
    }
    const handleFirstNameSubmit = (s) => {
        //TODO
        return true;
    }
    const handleLastNameSubmit = (s) => {
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
    const handleFirstPasswordSubmit = (s) => {
        forceUpdatePass2();
        setSecondPasswordFocus(true);
        setFirstNewPassword(s);
        return true;
    }
    const validateName = (s) => {
        //TODO
        return true;

    }
    const onFieldEnterEditMode = (id) => {
        setFieldsOnEditMode(prevState => {
            if (!prevState.includes(id)) {
                return [...prevState, id];
            }
            return prevState;
        })
    }
    const onFieldExitEditMode = (id) => {
        setFieldsOnEditMode(prevState => {
            if (prevState.includes(id)) {
                const next = [...prevState];
                next.splice(next.indexOf(id), 1);
                return next;
            }
            return prevState;
        })
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
    const validateSecondPassword = (s) => {
        return firstNewPassword === s;
    }

    const handleSecondPasswordSubmit = (s) => {
        //TODO
        setCurPassword(s);
        closeEditPasswordMode();
        forceUpdateShowPass();
        return true;
    }
    const validateLastName = (s) => {

        return true;
    }
    const handleNewProfPic = (src) => {
        console.log(fieldsOnEditMode);
        setSecondPasswordFocus(prevState => !prevState);
        return true;
    }
    const handleGoBackPress = () => {
        if (fieldsOnEditMode.length=== 0) {
            console.log(fieldsOnEditMode);
            console.log(fieldsOnEditMode.length)
            navigateBack();
        }else{
            setGoBackDialogOpen(true);
        }
    }
    const handleCloseGoBackDialog= ()=>{
        setGoBackDialogOpen(false);
    }
    const navigateBack = () => {
        navigate("/");
    }
    const marginY = 2;
    const m = 3;
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Box sx={{flexGrow: 1}}>

                    <Grid container columnSpacing={5} rowSpacing={2}
                          sx={isMobile ? {padding: "2%", paddingLeft: "4%"} : {paddingX: "15%", paddingY: "40px"}}>

                        <Grid item xs={12}>
                            <ProfilePicturePicker onUpdateProfilePic={handleNewProfPic}/>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} sx={{textAlign: "left"}}>
                            <Typography component="h1" variant="h6" marginBottom={'5px'}> פרטי משתמש</Typography>
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="שם פרטי" initVal={firstName}
                                                     validate={validateFirstName}
                                                     onSubmit={handleFirstNameSubmit}
                                                     notOutsideRef={goBackButtonRef}
                                                     beforeEditModeStart = {onFieldEnterEditMode}
                                                     beforeEditModeFinish = {onFieldExitEditMode}
                                                     id="firstName"
                            />
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="שם משפחה" initVal={lastName} validate={validateLastName}
                                                     onSubmit={handleLastNameSubmit}
                                                     notOutsideRef={goBackButtonRef}
                                                     beforeEditModeStart = {onFieldEnterEditMode}
                                                     beforeEditModeFinish = {onFieldExitEditMode}
                                                     id="secondName"
                            />
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="כתובת מייל" initVal={mail} validate={validateMail}
                                                     onSubmit={handleMailSubmit}
                                                     notOutsideRef={goBackButtonRef}
                                                     beforeEditModeStart = {onFieldEnterEditMode}
                                                     beforeEditModeFinish = {onFieldExitEditMode}
                                                     id="mailAdrres"
                            />

                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="מס' טלפון" initVal={phoneNum} validate={validatePhoneNum}
                                                     onSubmit={handlePhoneNumSubmit}
                                                     notOutsideRef={goBackButtonRef}
                                                     beforeEditModeStart = {onFieldEnterEditMode}
                                                     beforeEditModeFinish = {onFieldExitEditMode}
                                                     id="phoneNum"/>
                        </Grid>

                        <Grid item xs={12} sx={{textAlign: "left", marginTop: "30px"}}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} sx={{textAlign: "left"}}>
                            <Typography component="h1" variant="h6" marginBottom={'5px'}> שינוי סיסמא</Typography>
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                            <PasswordShower key={keyToRerenderShowPass} label="הקלד סיסמא נוכחית" val={curPassword}
                                            validate={validatePassword} beforeEditModeStarts={startEditPasswordMode}
                                            onCancel={closeEditPasswordMode}
                            />
                        </Grid>
                        {editPasswordMode &&
                            <>
                                <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                                    <EditableTextWithButtons label="סיסמא חדשה" val={password}
                                                             validate={validatePassword}
                                                             onSubmit={handleFirstPasswordSubmit}
                                                             password
                                                             startsOnEdit
                                                             clearOnOutsideClick={false}
                                                             notOutsideRef={goBackButtonRef}


                                    />

                                </Grid>
                                <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                                    <EditableTextWithButtons key={keyToRerenderPass2}
                                                             label="ודא סיסמא חדשה" val={password}
                                                             validate={validateSecondPassword}
                                                             onSubmit={handleSecondPasswordSubmit}
                                                             password
                                                             saveButton
                                                             startsOnEdit={secondPasswordFocus}
                                                             clearOnOutsideClick={false}
                                                             notOutsideRef={goBackButtonRef}

                                    />

                                </Grid>
                            </>
                        }

                        <Grid item xs={12} sx={{textAlign: "left", marginTop: "30px"}}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={4} sx={{textAlign: "left"}}>
                            <Typography component="h1" variant="h6" marginBottom={'5px'}>אופן קבלת התראות</Typography>
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
                        </Grid>
                        <Grid item xs={12} sx={{textAlign: "left", marginTop: "30px"}}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={4} sx={{textAlign: "left"}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography component="h1" variant="h6" marginBottom={'5px'}>סוגי התראות שברצוני
                                    לקבל</Typography>
                                <Grid container>
                                    <Grid item md={6} sx={{textAlign: "center"}}>
                                        <SettingsCheckBox label="תזכורת נטילת תרופה"/>
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
                                <Grid container>
                                    <Grid item md={6} sx={{textAlign: "center"}} ref={goBackButtonRef}>
                                        <Button variant={"outlined"} onClick={handleGoBackPress} startIcon={<ArrowForwardIcon/>}>חזור לחיפוש</Button>
                                    </Grid>

                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Dialog
                    open={goBackDialogOpen}
                    onClose={handleCloseGoBackDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"ישנם שינויים שלא נשמרו, האם אתה בטוח שברצונך לחזור?"}
                    </DialogTitle>

                    <DialogActions>
                        <Button onClick={handleCloseGoBackDialog}>בטל חזרה</Button>
                        <Button onClick={navigateBack} autoFocus>
                            חזור לחיפוש
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </CacheProvider>


    );
}
