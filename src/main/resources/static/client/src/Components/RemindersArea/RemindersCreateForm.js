import {Box} from "@mui/material";
import {getThemeProps} from "@mui/system";
import React, {useEffect, useState} from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import Link from "@mui/material/Link";
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import {useNavigate} from "react-router-dom";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";

function RemindersCreateForm(props) {
    const maxTimes = 15;
    const [stopStream, setStopStream] = useState(false);
    const [timesArray, setTimesArray] = useState([null]);
    const [value, setValue] = React.useState(null);
    const [hasErrorArr, setHasErrorArr] = React.useState(new Array(15).fill(false));
    const [triedSubmit, setTriedSubmitted] = React.useState(false);
    const [reachedMaxTimes, setReachedMaxTimes] = React.useState(false);
    const navigate = useNavigate();

    const types = [
        'משתמש רגיל',
        'רופא',
        'צוות רפואי',
    ];


    const [userType, setUserType] = useState(types[0]);

    const handleSelectUserType = (event) => {
        setUserType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };
    const showError = (time, index) => {
        let hasError = !validateTime(time, index);

        if (!triedSubmit && time == null) {
            return false;
        } else {
            return hasError;
        }


    }
    const validateTime = (time, index) => {
        if ((new Date(time) == "Invalid Date") || isNaN(new Date(time)) || Date.parse(new Date(time)) === 0) {
            return false;
        }

        for (let i = 0; i < timesArray.length; i++) {
            if (index != i) {
                if (timesArray[index] == timesArray[i]) {
                    return false;
                }
            }
        }
        return true;
    }
    const checkIfHasError = (time,index) =>{
        let hasError = !validateTime(time, index);
        let nextHasError = [...hasErrorArr];
        nextHasError[index] = hasError;
        setHasErrorArr(nextHasError);
    }
    useEffect(() => {
        if (timesArray.length == maxTimes) {
            setReachedMaxTimes(true);
        } else {
            setReachedMaxTimes(false);
        }
    });
    const handleTimeChange = (time, index) => {
        const next = [...timesArray];
        next[index] = time;
        setTimesArray(next);
    }
    const handleAddTimeClick = () => {
        const next = [...timesArray, null];
        setTimesArray(next);

        console.log(next);
    }
    const dismissBarcodeReader = () => {
        setStopStream(true)
        setTimeout(() => props.closeModal(), 50)
    }

    return (
        <Paper style={{maxHeight: "80vh", overflow: 'auto'}}
               sx={{
                   marginTop: 1,
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
               }}
               overflow={'auto'}>
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
                        <DateRangeIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        צור תזכורת
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="title"
                                    label="כותרת"
                                />
                            </Grid>
                            {timesArray.map((time, index) =>
                                <Grid item xs={12} key={"test123" + index}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <TimePicker
                                            label="Basic example"
                                            value={timesArray[index]}
                                            onChange={(newValue) => {
                                                handleTimeChange(newValue, index);
                                            }}
                                            renderInput={(params) => <TextField {...params} fullWidth
                                                                                error={showError(time, index)}
                                                                                />}

                                        />
                                    </LocalizationProvider>
                                </Grid>)
                            }

                            <Grid item xs={12}>
                                <IconButton onClick={handleAddTimeClick}
                                            disabled={reachedMaxTimes}><AddAlarmIcon/></IconButton>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="שם פרטי"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    required
                                    fullWidth
                                    id="user-type"
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
                                    name="password"
                                    label="סיסמה"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary"/>}
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


        </Paper>
    );
}

export default RemindersCreateForm;