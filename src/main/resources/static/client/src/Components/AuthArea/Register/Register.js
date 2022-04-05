import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
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
import { createTheme, ThemeProvider} from '@mui/material/styles';
import {postRequest} from "../../../Utils/AxiosRequests";
import {ServerConsts} from "../../../Consts/apiPaths";
import * as validations from "../Validators/Validators";

// TO-DO client-side:
// 1. get the usertype + the allowExtraEmails info.
// 2. add additional field of doctor's number when usertype == doctor.

const theme = createTheme({direction: 'rtl'});

function Register() {

  const navigate = useNavigate();

  const types = [
    'משתמש רגיל',
    'רופא',
    'צוות רפואי',
  ];

  const [userType, setUserType] = useState(types[0]);

  // states of fields errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");


  const handleSelectUserType = (event) => {
    setUserType(event.target.value);
  };

  // performs POST request - adding a new user.
  const registerNewUser = async (data) => {
    let res = await postRequest(ServerConsts.REGISTER, {
      "usertype" : data.get("userType"),
      "username" : data.get("userName"),
      "firstname" : data.get("firstName"),
      "lastname" : data.get("lastName"),
      "email" : data.get("email"),
      "password" : data.get("password")
    });
    console.log("response from server is: \n" + res);
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let allValidationsPassed = true;

    // setting all errors as false before validations.
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setFirstNameError("");
    setLastNameError("");


    // pass through all validations, setting the errors if exists.
    if(validations.usernameEmpty(data.get("userName"))){
      setUsernameError("נא הזן שם משתמש");
      allValidationsPassed = false;
    }
    else if(!validations.usernameMinChars(data.get("userName"))){
      setUsernameError("שם המשתמש חייב להיות באורך 8 תווים לפחות")
      allValidationsPassed = false;
    }
    else if(!validations.usernameValid(data.get("userName"))){
      setUsernameError("אנא הזן תווים באנגלית וספרות בלבד");
      allValidationsPassed = false;
    }

    if(validations.firstnameEmpty(data.get("firstName"))){
      setFirstNameError("נא הזן שם פרטי");
      allValidationsPassed = false;
    }

    if(validations.lastnameEmpty(data.get("lastName"))){
      setLastNameError("נא הזן שם משפחה");
      allValidationsPassed = false;
    }

    if(validations.emailEmpty(data.get("email"))){
      setEmailError("נא הזן כתובת אימייל");
      allValidationsPassed = false;
    }

    else if(!validations.emailValid(data.get("email"))){
      setEmailError("כתובת אימייל לא תקינה");
      allValidationsPassed = false;
    }

    if(validations.passwordEmpty(data.get("password"))){
      setPasswordError("נא הזן סיסמה");
      allValidationsPassed = false;
    }
    else if(!validations.passwordMinChars(data.get("password"))){
      setPasswordError("סיסמה צריכה להכיל לפחות 8 תווים");
      allValidationsPassed = false;
    }
    else if(!validations.passwordValid(data.get("password"))){
      setPasswordError("סיסמה יכולה להכיל תווים, ספרות וסמלים מיוחדים בלבד");
      allValidationsPassed = false;
    }
    else if(!validations.passwordsMatches(data.get("password"), data.get("confirmPassword"))){
      setPasswordError("הסיסמאות לא זהות, אנא הזן שוב");
      allValidationsPassed = false;
    }

    if(allValidationsPassed){
      registerNewUser(data).then( () => {
        alert("נרשמת בהצלחה, עבור להתחברות !")
        navigate("/login");
      });
    }

    else{
      alert("אחד (או יותר) מהפרטים שהזנת לא תקין, אנא תקן ובצע שוב !")
    }

    // Logging all form entries
    for (let pair of data.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
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
            הרשמה
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                    id="userName"
                    label="שם משתמש"
                    name="userName"
                    autoComplete="userName"
                    error={usernameError.length !== 0}
                    helperText={usernameError.length !== 0 ? usernameError : null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="on"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="שם פרטי"
                  error={firstNameError.length !== 0}
                  helperText={firstNameError.length !== 0 ? firstNameError : null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="שם משפחה"
                  name="lastName"
                  autoComplete="family-name"
                  error={lastNameError.length !== 0}
                  helperText={lastNameError.length !== 0 ? lastNameError : null}
                />
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="סיסמה"
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
                  control={<Checkbox id="allowExtraEmails" value="allowExtraEmails" color="primary" />}
                  label="אני מעוניין לקבל התראות לכתובת האימייל שלי"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              הרשמה
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#/login" variant="body2" onClick={() => {navigate("/login");}}>
                  משתמש רשום? התחבר
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Register;