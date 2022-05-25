import * as React from 'react';
import {useContext, useEffect, useReducer, useRef} from 'react';
import Box from '@mui/material/Box';

import {createTheme} from "@mui/material/styles";
import {CacheProvider, ThemeProvider} from "@emotion/react";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Grid from "@mui/material/Grid";
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import {Button, Dialog} from "@mui/material";
import EditableTextWithButtons from "../UI/EditableTextWithButtons";
import {useDispatch, useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import Typography from "@mui/material/Typography";
import SettingsCheckBox from "../UI/SettingsCheckBox";
import {isMobile} from "react-device-detect";
import {prefixer} from 'stylis';
import * as STATE_PATHS from "../../Consts/StatePaths";
import ProfilePicturePicker from "./ProfilePicturePicker";
import Divider from "@mui/material/Divider";
import {useNavigate} from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import PasswordIcon from '@mui/icons-material/Password';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import {MenuItem} from '@mui/material';
import {db} from "../../Configs/FirebaseConfig.js"
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Actions} from "../../Redux/UserData";
import {USER_PROFILE} from "../../Consts/StatePaths";
import * as ProfileFields from "../../Consts/ProfileFields"
import configureReduxStore from "../../Redux/Store";
import { ReactReduxContext } from 'react-redux'

// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props) {
    return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export default function Settings() {

    const auth = getAuth();
    let uid = auth.currentUser.uid;
    // const { store } = useContext(ReactReduxContext);
    const profile = useSelector((state) => getSafe(USER_PROFILE, state));
    const setField = (field, setTo) => {
        const fieldRef = doc(db, 'users', uid);
        const data = {};
        data[field] = setTo;
        const res = setDoc(fieldRef, data, {merge: true});
        dispatch(Actions.changeField(field, setTo));

    }
    const getField = (field, defualt) => {
        if (profile[field]) {
            return profile[field];
        }
        return defualt;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            uid = user.uid;
            // ...
        } else {
            // User is signed out
            // ...
        }
    });

    const userTypeArr = [
        'משתמש רגיל',
        'חבר צוות רפואי',
        'רופא',]
    const phoneNum = getField(ProfileFields.PHONE_NUM, '');
    const mail = getField(ProfileFields.MAIL_ADDRESS, '');
    const password = "123456";//TODO
    const firstName = getField(ProfileFields.FIRST_NAME, '');
    const lastName = getField(ProfileFields.LAST_NAME, '');
    const city = getField(ProfileFields.CITY, '');
    const initUserType = getField(ProfileFields.USER_TYPE, userTypeArr[0]);
    const initialyValidatedtionList = ['משתמש רגיל'];//TODO List of all the validation for the use
    const mailNotifications = getField(ProfileFields.MAIL_NOTIFICATIONS, false);
    const browserNotifications = getField(ProfileFields.BROWSER_NOTIFICATIONS, false);
    const phoneNotifications = getField(ProfileFields.PHONE_NOTIFICATIONS, false);
    const takingReminder = getField(ProfileFields.TAKING_REMINDER, false);
    const expirationReminder = getField(ProfileFields.EXPIRATION_REMINDER, false);

    const profilePictureRef = useRef();
    const secondPasswordRef = useRef();
    const goBackButtonRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const theme = createTheme({direction: 'rtl'});
    const uID = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
    const [keyToRerenderPass2, forceUpdatePass2] = useReducer(x => x + 1, 0);
    const [keyToRerenderShowPass, forceUpdateShowPass] = useReducer(x => x + 1, 0);
    const [newPasswordEditMode, setNewPasswordEditMode] = React.useState(false);
    const [oldPasswordEditMode, setOldPasswordEditMode] = React.useState(false);
    const [firstNewPassword, setFirstNewPassword] = React.useState("");
    const [secondPasswordFocus, setSecondPasswordFocus] = React.useState(false);
    const [somthingEdited, setSomthingEdited] = React.useState(false);
    const [fieldsOnEditMode, setFieldsOnEditMode] = React.useState([]);
    const [goBackDialogOpen, setGoBackDialogOpen] = React.useState(false);
    const [curPassword, setCurPassword] = React.useState(password);
    const [userType, setUserType] = React.useState(userTypeArr[0]);
    const [userTypeValidationList, setUserTypeValidated] = React.useState(initialyValidatedtionList);


    const handleMailNotificationChange = (event) => {
        setField(ProfileFields.MAIL_NOTIFICATIONS, event.target.checked);
    }
    const handleBrowserNotificationChange = (event) => {
        setField(ProfileFields.BROWSER_NOTIFICATIONS, event.target.checked);
    }
    const handlePhoneNotificationChange = (event) => {
        setField(ProfileFields.PHONE_NOTIFICATIONS, event.target.checked);

    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
    useEffect(() => {
        if (currentUser === ''){
            navigate("/login");
        }
    }, [currentUser]);
    }
    const handleTakingReminderChange = (event) => {
        setField(ProfileFields.TAKING_REMINDER, event.target.checked);

    }
    const handleExpirationReminderChange = (event) => {
        setField(ProfileFields.EXPIRATION_REMINDER, event.target.checked);

    }
    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
        setField(ProfileFields.USER_TYPE, event.target.value);
        //TODO open change user type form in case that not normal user
    }
    const startEditPasswordMode = () => {
        onFieldEnterEditMode("password")
        setOldPasswordEditMode(true);
    }
    const closeEditPasswordMode = () => {
        onFieldExitEditMode("password")
        setNewPasswordEditMode(false);
        setOldPasswordEditMode(false);
        setSecondPasswordFocus(false);


    }

    const handleFirstNameSubmit = (s) => {
        setField(ProfileFields.FIRST_NAME, s)
        return true;
    }
    const handleLastNameSubmit = (s) => {
        setField(ProfileFields.LAST_NAME, s)
        return true;
    }
    const handleMailSubmit = (s) => {
        setField(ProfileFields.MAIL_ADDRESS, s)
        return true;

    }
    const handlePhoneNumSubmit = (s) => {
        setField(ProfileFields.PHONE_NUM, s)
        return true;
    }
    const handleCitySubmit = (s) => {
        setField(ProfileFields.CITY, s)
        return true;

    }
    const handleOldPasswordSubmit = (s) => {
        //TODO (load old password)
        if (curPassword === s) {
            setOldPasswordEditMode(false);
            setNewPasswordEditMode(true);
            return true;
        } else {
            return false;
        }
    }
    const isUserTypeValidated = () => {
        return userTypeValidationList.includes(userType);
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
    const validateCity = (s) => {
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
        console.log(uid);
        setSecondPasswordFocus(prevState => !prevState);
        return true;
    }
    const handleGoBackPress = () => {
        if (fieldsOnEditMode.length === 0) {
            console.log(fieldsOnEditMode);
            console.log(fieldsOnEditMode.length)
            navigateBack();
        } else {
            setGoBackDialogOpen(true);
        }
    }
    const handleCloseGoBackDialog = () => {
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

                    <Grid container columnSpacing={5} rowSpacing={2.8}
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
                                                     periodicValidate={validateFirstName}
                                                     onSubmit={handleFirstNameSubmit}
                                                     notOutsideRef={goBackButtonRef}
                                                     beforeEditModeStart={onFieldEnterEditMode}
                                                     beforeEditModeFinish={onFieldExitEditMode}
                                                     clearOnOutsideClick={!goBackDialogOpen}
                                                     id="firstName"

                            />
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="שם משפחה" initVal={lastName}
                                                     periodicValidate={validateLastName}
                                                     onSubmit={handleLastNameSubmit}
                                                     notOutsideRef={goBackButtonRef}
                                                     beforeEditModeStart={onFieldEnterEditMode}
                                                     beforeEditModeFinish={onFieldExitEditMode}
                                                     clearOnOutsideClick={!goBackDialogOpen}
                                                     id="secondName"
                            />
                        </Grid>
                        {/*<Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>*/}
                        {/*    <EditableTextWithButtons label="כתובת מייל להתראות" initVal={mail} periodicValidate={validateMail}*/}
                        {/*                             onSubmit={handleMailSubmit}*/}
                        {/*                             notOutsideRef={goBackButtonRef}*/}
                        {/*                             beforeEditModeStart={onFieldEnterEditMode}*/}
                        {/*                             beforeEditModeFinish={onFieldExitEditMode}*/}
                        {/*                             clearOnOutsideClick={!goBackDialogOpen}*/}
                        {/*                             id="mailAdrres"*/}
                        {/*    />*/}
                        {/*</Grid>*/}

                        <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="מס' טלפון" initVal={phoneNum}
                                                     periodicValidate={validatePhoneNum}
                                                     onSubmit={handlePhoneNumSubmit}
                                                     notOutsideRef={goBackButtonRef}
                                                     beforeEditModeStart={onFieldEnterEditMode}
                                                     beforeEditModeFinish={onFieldExitEditMode}
                                                     clearOnOutsideClick={!goBackDialogOpen}
                                                     id="phoneNum"/>
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                            <EditableTextWithButtons label="עיר מגורים" initVal={city}
                                                     periodicValidate={validateCity}
                                                     onSubmit={handleCitySubmit}
                                                     notOutsideRef={goBackButtonRef}
                                                     beforeEditModeStart={onFieldEnterEditMode}
                                                     beforeEditModeFinish={onFieldExitEditMode}
                                                     clearOnOutsideClick={!goBackDialogOpen}
                                                     id="city"
                            />
                        </Grid>
                        <Grid item xs={isMobile ? "" : 6} md={3} sx={{textAlign: "left"}}>
                            <TextField
                                select
                                fullWidth
                                id="until"
                                label="סוג משתמש"
                                name="returns"
                                value={userType}
                                onChange={handleUserTypeChange}
                                helperText={isUserTypeValidated() ? " " : "מחכה לאישור מנהל"}
                            >
                                {userTypeArr.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>


                        </Grid>
                        <Grid item xs={12} sx={{textAlign: "left", marginTop: "5px"}}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} sx={{textAlign: "left"}}>
                            <Typography component="h1" variant="h6" marginBottom={'5px'}> שינוי סיסמא</Typography>
                        </Grid>
                        <Grid item md={2.2} sx={{textAlign: "left"}}>
                            {!(newPasswordEditMode || oldPasswordEditMode) ?
                                <Button variant={"outlined"} onClick={startEditPasswordMode}
                                        endIcon={<PasswordIcon/>}>שנה ססמא</Button>
                                :
                                <Button variant={"outlined"} onClick={closeEditPasswordMode}
                                        endIcon={<ClearIcon/>}>בטל שינוי</Button>
                            }

                        </Grid>
                        {oldPasswordEditMode &&
                            <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "right"}}>
                                <EditableTextWithButtons label="הקלד ססמא נוכחית"
                                                         onSubmit={handleOldPasswordSubmit}
                                                         password
                                                         startsOnEdit
                                                         clearOnOutsideClick={false}
                                                         notOutsideRef={goBackButtonRef}
                                                         periodicValidateOnlyOnSubmit
                                                         errorHint="טעות בססמא"


                                />

                            </Grid>}
                        {newPasswordEditMode &&
                            <>
                                <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                                    <EditableTextWithButtons label="סיסמא חדשה"
                                                             periodicValidate={validatePassword}
                                                             onSubmit={handleFirstPasswordSubmit}
                                                             password
                                                             startsOnEdit
                                                             clearOnOutsideClick={false}
                                                             notOutsideRef={goBackButtonRef}


                                    />

                                </Grid>
                                <Grid item xs={isMobile ? "" : 6} md={4} sx={{textAlign: "center"}}>
                                    <EditableTextWithButtons key={keyToRerenderPass2}
                                                             label="ודא סיסמא חדשה"
                                                             periodicValidate={validateSecondPassword}
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

                        <Grid item xs={12} sx={{textAlign: "left", marginTop: "15px"}}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} sx={{textAlign: "left"}}>
                            <Typography component="h1" variant="h6" marginBottom={'5px'}>אופן קבלת התראות</Typography>
                        </Grid>
                        <Grid item container xs={12} sx={{textAlign: "left"}}>

                            <Grid item sx={{textAlign: "center"}}>
                                <SettingsCheckBox label="מייל" onChange={handleMailNotificationChange} initialyChecked = {mailNotifications}/>
                            </Grid>

                            <Grid item sx={{textAlign: "center"}}>
                                <SettingsCheckBox label="טלפון" onChange={handlePhoneNotificationChange} initialyChecked = {phoneNotifications}/>
                            </Grid>
                            <Grid item sx={{textAlign: "center"}}>
                                <SettingsCheckBox label="דפדפן" onChange={handleBrowserNotificationChange} initialyChecked = {browserNotifications}/>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} sx={{textAlign: "left", marginTop: "15px"}}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} sx={{textAlign: "left"}}>
                            <Typography component="h1" variant="h6" marginBottom={'5px'}>סוגי התראות שברצוני
                                לקבל</Typography>
                        </Grid>
                        <Grid item container xs={12} sx={{textAlign: "left"}}>

                            <Grid item sx={{textAlign: "center"}}>
                                <SettingsCheckBox label="תזכורת נטילת תרופה" onChange={handleTakingReminderChange} initialyChecked = {takingReminder}
                                />
                            </Grid>
                            <Grid item sx={{textAlign: "center"}}>
                                <SettingsCheckBox label="סיום תוקף" onChange={handleExpirationReminderChange} initialyChecked = {expirationReminder}/>
                            </Grid>

                        </Grid>
                        <Box width="100%"/>
                        <Grid item md={4} xs={12} sx={{textAlign: "left", marginTop: "15px"}}>
                            <Box sx={{flexGrow: 1}}>
                                <Grid container>
                                    <Grid item md={6} sx={{textAlign: "center"}} ref={goBackButtonRef}>
                                        <Button variant={"outlined"} onClick={handleGoBackPress}
                                                startIcon={<ArrowForwardIcon/>}>חזור לחיפוש</Button>
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


    )
        ;
}
