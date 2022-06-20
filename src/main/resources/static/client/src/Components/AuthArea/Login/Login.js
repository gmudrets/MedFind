import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useDispatch, useSelector} from 'react-redux';
import * as AUTH from "../../../Redux/Auth";
import * as USER_DATA from "../../../Redux/UserData";
import {getSafe} from '../../../Utils/Utils'
import * as STATE_PATHS from '../../../Consts/StatePaths'
import {auth} from "../../../Configs/FirebaseConfig";
import {signInWithEmailAndPassword, signOut} from "firebase/auth"
import {Alert, Snackbar} from "@mui/material";
import createCache from "@emotion/cache";
import {prefixer} from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import {CacheProvider} from "@emotion/react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../../Configs/FirebaseConfig.js"
import OneSignal from "react-onesignal";
import * as ONE_SIGNAL from "../../../Consts/OneSignalInfo";

import {phoneNumLength} from "../Validators/Validators";

function Login() {
    const theme = createTheme({direction: 'rtl'});
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const [signInSuccessMessage, setSignInSuccessMessage] = useState(false);
    const [signInErrorMessage, setSignInErrorMessage] = useState(false);
    const [emailNotVerifiedError, setEmailNotVerifiedError] = useState(false);
    const [isSignedInAlready, setIsSignedInAlready] = useState(true);
    const [initialized, setInitialized] = useState(false);

    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));

    useEffect(() => {
        if (currentUser !== '' && isSignedInAlready) {
            navigate("/");
        }
    }, [currentUser]);


    const handleSignInSuccess = () => {
        navigate("/");
    }

    const handleSignInError = () => {
        setSignInErrorMessage(false);
    }

    const handleEmailNotVerifiedError = () => {
        setEmailNotVerifiedError(false);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email').toString();
        let password = data.get('password').toString();
        signInWithEmailAndPassword(auth,
            email,
            password)
            .then(async userCredential => {
                if (auth.currentUser.emailVerified) {
                    dispatch(AUTH.Actions.requestUserLogin(userCredential.user));
                    setSignInSuccessMessage(true);
                    const docSnap = await getDoc(doc(db, "users", userCredential.user.uid));
                    dispatch(USER_DATA.Actions.initializeUserData(docSnap.data()));
                    OneSignal.init({
                        appId: ONE_SIGNAL.APP_ID,
                        autoResubscribe: true,
                        allowLocalhostAsSecureOrigin: true
                    }).then(() => {
                        setInitialized(true);
                        console.log('worked');
                        const slidown =  OneSignal.showSlidedownPrompt().then(() => {
                            console.log('worked2')
                        });
                        OneSignal.setExternalUserId(userCredential.user.uid);
                        // OneSignal.removeExternalUserId(userCredential.user.uid);
                        // OneSignal.deleteTags();
                        //TODO: maybe phone notfications later
                        // OneSignal.setEmail(userCredential.user.email);
                        // OneSignal.s
                    });
                } else {
                    setEmailNotVerifiedError(true);
                    await signOut(auth).then();
                }
            }).catch(error => {
            console.log("error code: " + error.code + " and message: " + error.message);

            if (error.code === 'auth/user-not-found' ||
                error.code === 'auth/invalid-email' ||
                error.code === 'auth/user-disabled' ||
                error.code === 'auth/wrong-password') {
                setSignInErrorMessage(true);
            }
        });

    }
    return (
        <CacheProvider value={cacheRtl}>

            <ThemeProvider theme={theme}>

                <Snackbar open={signInSuccessMessage}
                          autoHideDuration={1500}
                          onClose={handleSignInSuccess}
                          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert severity="success">
                        התחברת בהצלחה, מיד תעבור לדף הבית!
                    </Alert>
                </Snackbar>

                <Snackbar open={signInErrorMessage}
                          autoHideDuration={1500}
                          onClose={handleSignInError}
                          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert severity="error">
                        כתובת מייל או סיסמא שגויים. אנא נסה שנית.
                    </Alert>
                </Snackbar>

                <Snackbar open={emailNotVerifiedError}
                          autoHideDuration={3000}
                          onClose={handleEmailNotVerifiedError}
                          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert severity="warning">
                        כתובת המייל של המשתמש לא אומתה. אנא בצע/י אימות ע"י לחיצה על הקישור שנשלח במייל.
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
                            התחברות
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="כתובת מייל"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="סיסמה"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary"/>}
                                label="זכור אותי"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                התחבר
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#/forgotpass" variant="body2" onClick={() => {
                                        navigate("/forgotpass");
                                    }}>
                                        שכחת סיסמה?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#/register" variant="body2" onClick={() => {
                                        navigate("/register");
                                    }}>
                                        אינך משתמש רשום? הרשם
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

export default Login;
