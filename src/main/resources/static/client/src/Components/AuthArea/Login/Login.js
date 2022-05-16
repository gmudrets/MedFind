import * as React from 'react';
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
import {useSelector, useDispatch} from 'react-redux';
import {Actions} from "../../../Redux/Auth";
import {getSafe} from '../../../Utils/Utils'
import * as STATE_PATHS from '../../../Consts/StatePaths'
import { auth } from "../../../Configs/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth"
import {Alert, Snackbar} from "@mui/material";
import {useState} from "react";


function Login() {
  const theme = createTheme({direction: 'rtl'});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signInSuccessMessage, setSignInSuccessMessage] = useState(false);
  const [signInErrorMessage, setSignInErrorMessage] = useState(false);

  const handleSignInSuccess = () => {
    navigate("/");
  }

  const handleSignInError = () => {
    setSignInErrorMessage(false);
  }

  const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email = data.get('email').toString();
    let password = data.get('password').toString();

    signInWithEmailAndPassword(auth,
        email,
        password)
        .then(userCredential => {
            dispatch(Actions.requestUserLogin(userCredential.user));
          setSignInSuccessMessage(true);
        }).catch(error => {
          console.log("error code: " + error.code + " and message: " + error.message);

          if(error.code === 'auth/user-not-found' ||
              error.code === 'auth/invalid-email' ||
              error.code === 'auth/user-disabled' ||
              error.code === 'auth/wrong-password'){
            setSignInErrorMessage(true);
          }
        });
  };

  return (
    <ThemeProvider theme={theme}>

      <Snackbar open={signInSuccessMessage}
                autoHideDuration={1500}
                onClose={handleSignInSuccess}
                anchorOrigin = {{vertical: 'top', horizontal: 'center'}}
      >
        <Alert severity="success">
          התחברת בהצלחה ! מיד תעבור לדף הבית !
        </Alert>
      </Snackbar>

      <Snackbar open={signInErrorMessage}
                autoHideDuration={1500}
                onClose={handleSignInError}
                anchorOrigin = {{vertical: 'top', horizontal: 'center'}}
      >
        <Alert severity="error">
        כתובת מייל או סיסמא שגויים. אנא נסה שנית.
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
					  navigate("/register");}}>
                  אינך משתמש רשום? הרשם
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
