import * as React from 'react';
import { useNavigate } from "react-router-dom";
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { connect } from "react-redux";
import { useSelector, useDispatch } from 'react-redux';
import { Actions } from "../../../Redux/Auth";
import { getSafe } from '../../../Utils/Utils'
import * as STATE_PATHS from '../../../Consts/StatePaths'


function Login() {
	const theme = createTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));

  	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let user = data.get('username');
		let pass = data.get('password');
		console.log({
		username: user,
		password: pass,
		});
		dispatch(Actions.requestUserLogin(user, pass));
		navigate("/");
  	};


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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            התחברות
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="שם משתמש"
              name="username"
              autoComplete="username"
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
              control={<Checkbox value="remember" color="primary" />}
              label="זכור אותי"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              התחבר
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => {navigate("/forgotpass");}}>
                  ?שכחת סיסמה
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => {navigate("/register");}} >
                  {"אינך משתמש רשום? הרשם"}
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