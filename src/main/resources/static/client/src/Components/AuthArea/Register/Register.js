import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import * as validations from "../Validators/Validators";
import {Alert, Snackbar} from "@mui/material";
import {useSelector} from "react-redux";
import {getSafe} from "../../../Utils/Utils";
import * as STATE_PATHS from "../../../Consts/StatePaths";
import createCache from "@emotion/cache";
import {prefixer} from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import {CacheProvider} from "@emotion/react";
import {auth, db} from "../../../Configs/FirebaseConfig";
import {createUserWithEmailAndPassword, signOut} from "firebase/auth";
import {collection, doc, setDoc} from "firebase/firestore";
import * as ProfileFields from '../../../Consts/ProfileFields.js'

const theme = createTheme({direction: 'rtl'});

function Register() {

    const navigate = useNavigate();

    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));

    useEffect(() => {
        if (currentUser !== '') {
            navigate("/");
        }
    }, [currentUser]);

    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    const types = [
        'משתמש רגיל',
        'רופא',
        'צוות רפואי',
    ];

    const [userType, setUserType] = useState(types[0]);

    // states of fields errors
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [telephoneError, setTelephoneError] = useState("");
    const [cityError, setCityError] = useState("");

    const [registerSuccessMessage, setRegisterSuccessMessage] = useState(false);
    const [registerErrorMessage, setRegisterErrorMessage] = useState(false);

    const handleSelectUserType = (event) => {
        setUserType(event.target.value);
    };

    // checks if the user email is not in use and password meets requirements.
    // if not, raise an error. else, register the user to firebase + saving user info in "users" collection firestore.
    const registerNewUser = async (data) => {
        await createUserWithEmailAndPassword(auth,
            data.get("email").toString(),
            data.get("password").toString())
            .then(async (userCredential) => {
                try {
                    await setDoc(doc(collection(db, "users"), userCredential.user.uid), JSON.parse(JSON.stringify({
                        uid: userCredential.user.uid,
                        email: data.get("email").toString(),
                        firstName: data.get("firstName").toString(),
                        lastName: data.get("lastName").toString(),
                        userType: data.get("userType").toString(),
                        telephone: data.get("telephone").toString(),
                        city: data.get("city").toString(),
                        allowExtraEmails: true
                    }))).then();
                } catch (error) {
                    console.log(error);
                }
                signOut(auth).then();
                setRegisterSuccessMessage(true);
            }).catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setEmailError("כתובת המייל שבחרת כבר קיימת במערכת. אנא הזן כתובת אחרת או עבור להתחברות.");
                    setRegisterErrorMessage(true);
                }
                if (error.code === 'auth/weak-password') {
                    setPasswordError("הסיסמא שבחרת חלשה מידי. אנא בחר סיסמא חזקה יותר.");
                    setRegisterErrorMessage(true);
                }
            })

    }

    const handleRegisterSuccess = () => {
        navigate("/login");
    }

    const handleRegisterError = () => {
        setRegisterErrorMessage(false);
    }

    const handleSubmit = async (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let formValidationsPassed = true;

        // setting all errors as false before validations.
        setEmailError("");
        setPasswordError("");
        setFirstNameError("");
        setLastNameError("");
        setTelephoneError("");
        setCityError("");

        // pass through all validations, setting the errors if exists.
        const firstNameValidated = validations.firstNameFullValidate(data.get(ProfileFields.FIRST_NAME), setFirstNameError)
        const lastNameValidated = validations.lastNameFullValidate(data.get(ProfileFields.LAST_NAME), setLastNameError);
        const mailValidated = validations.mailFullValidate(data.get(ProfileFields.MAIL_ADDRESS), setEmailError);
        const passwordValidated = validations.passwordFullValidate(data.get('password'), setPasswordError);
        const secondPasswordValidated = validations.confirmPasswordFullValidate(data.get('password'), data.get('confirmPassword'), setPasswordError);
        const phoneNumValidated = validations.phoneNumFullValidate(data.get(ProfileFields.PHONE_NUM), setTelephoneError);
        const cityValidated = validations.cityFullValidate(data.get(ProfileFields.CITY), setCityError);


        if ((cityValidated && phoneNumValidated && firstNameValidated && lastNameValidated && mailValidated && passwordValidated && secondPasswordValidated)) {
            await registerNewUser(data);
        } else {
            setRegisterErrorMessage(true);
        }
    };
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Snackbar open={registerSuccessMessage}
                          autoHideDuration={1500}
                          onClose={handleRegisterSuccess}
                          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert severity="success">
                        נרשמת בהצלחה! מיד תועבר/י להתחברות
                    </Alert>
                </Snackbar>

                <Snackbar open={registerErrorMessage}
                          autoHideDuration={1500}
                          onClose={handleRegisterError}
                          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert severity="error">
                        אחד (או יותר) מהפרטים שהזנת שגויים. אנא בדוק ונסה שנית.
                    </Alert>
                </Snackbar>

                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            הרשמה
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        required
                                        fullWidth
                                        id="userType"
                                        label="סוג משתמש"
                                        name="userType"
                                        autoFocus
                                        value={userType}
                                        onChange={handleSelectUserType}
                                    >
                                        {types.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="כתובת אימייל"
                                        name="email"
                                        autoComplete="email"
                                        error={emailError.length !== 0}
                                        helperText={emailError.length !== 0 ? emailError : null}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="on"
                                        name={ProfileFields.FIRST_NAME}
                                        required
                                        fullWidth
                                        id={ProfileFields.FIRST_NAME}
                                        label="שם פרטי"
                                        error={firstNameError.length !== 0}
                                        helperText={firstNameError.length !== 0 ? firstNameError : null}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id={ProfileFields.LAST_NAME}
                                        label="שם משפחה"
                                        name={ProfileFields.LAST_NAME}
                                        autoComplete="family-name"
                                        error={lastNameError.length !== 0}
                                        helperText={lastNameError.length !== 0 ? lastNameError : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id={ProfileFields.CITY}
                                        label="עיר מגורים"
                                        name={ProfileFields.CITY}
                                        autoComplete="city"
                                        error={cityError.length !== 0}
                                        helperText={cityError.length === 0 ? "אין חובה למלא פרט זה, שימושו לצורך שיתוף תרופות" : cityError}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id={ProfileFields.PHONE_NUM}
                                        label="טלפון"
                                        name={ProfileFields.PHONE_NUM}
                                        autoComplete="telephone"
                                        error={telephoneError.length !== 0}
                                        helperText={telephoneError.length === 0 ? "אין חובה למלא פרט זה, שימושו לצורך שיתוף תרופות" : telephoneError}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="בחר סיסמה"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        error={passwordError.length !== 0}
                                        helperText={passwordError.length !== 0 ? passwordError : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="וודא סיסמה"
                                        type="password"
                                        id="confirmPassword"
                                        autoComplete="confirm-new-password"
                                        error={passwordError.length !== 0}
                                        helperText={passwordError.length !== 0 ? passwordError : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox id="allowExtraEmails" value="allowExtraEmails"
                                                           color="primary"/>}
                                        label="אני מעוניין לקבל התראות לכתובת האימייל שלי"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                הרשמה
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="#/login" variant="body2" onClick={() => {
                                        navigate("/login");
                                    }}>
                                        משתמש רשום? התחבר
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default Register;
