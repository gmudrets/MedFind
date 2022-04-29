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
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import CancelIcon from '@mui/icons-material/Cancel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Link from "@mui/material/Link";
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import {useNavigate} from "react-router-dom";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {DatePicker} from "@mui/x-date-pickers";

function RemindersCreateForm(props) {
    const maxTimes = 15;

    const returnsTypeOptions = [
        'לא חוזר',
        'כל יום',
        'כל כמה ימים',
        'כל שבוע',
        'כל כמה שבועות',
    ];
    const daysWeekOptions = [
        'ראשון',
        'שני',
        'שלישי',
        'רביעי',
        'חמישי',
        'שישי',
        'שבת'
    ];
    const untilTypeOptions = [
        'תאריך',
        'כמות תזכורת'
    ]
    const initilizeWeekDaysSelected = () => {
        const today = new Date().getDay();
        return [daysWeekOptions[today]];
    }
    const [stopStream, setStopStream] = useState(false);
    const [timesArray, setTimesArray] = useState([null]);
    const [name, setName] = React.useState("");
    const [value, setValue] = React.useState(null);
    const [hasErrorArr, setHasErrorArr] = React.useState(new Array(15).fill(false));
    const [triedSubmit, setTriedSubmitted] = React.useState(false);
    const [reachedMaxTimes, setReachedMaxTimes] = React.useState(false);
    const [eachManyDays, setEachManyDays] = React.useState(2);
    const [eachManyWeeks, setEachManyWeeks] = React.useState(2);
    const [returnsType, setReturnsType] = useState(returnsTypeOptions[0]);
    const [weekDaysSelected, setWeekDaysSelected] = React.useState(initilizeWeekDaysSelected());
    const [untilType, setUntilType] = React.useState(untilTypeOptions[0]);
    const [remindersRemain, setRemindersRemain] = React.useState(2);
    const [untilDate, setUntilDate] = React.useState(new Date());


    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const handleUntilDateChange = (date) => {
        setUntilDate(date);
    }
    const handleRemindersRemainChange = (event) => {
        setRemindersRemain(event.target.value);
    }
    const handleUntilTypeChange = (event) => {
        setUntilType(event.target.value);
    }
    const handleEachManyWeeksChange = (event) => {
        setEachManyWeeks(event.target.value);
    }
    const handleEachManyDaysChange = (event) => {
        setEachManyDays(event.target.value);
    }
    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleWeekDaysSelectedChange = (event) => {
        const {
            target: {value},
        } = event;
        setWeekDaysSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const navigate = useNavigate();


    const showError = (time, index) => {
        let hasError = !validateTime(time, index);
        console.log(hasError + "\n")
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
                if (new Date(time).getHours() == new Date(timesArray[i]).getHours() && new Date(time).getMinutes() == new Date(timesArray[i]).getMinutes()) {
                    if (index > i) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    const checkIfHasError = (time, index) => {
        let hasError = !validateTime(time, index);
        let nextHasError = [...hasErrorArr];
        nextHasError[index] = hasError;
        setHasErrorArr(nextHasError);
    }

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

    const handleRemoveTime = (index) => {
        const next = [...timesArray];
        next.splice(index, 1);
        setTimesArray(next);
    }
    const handleSelectUserType = (event) => {
        setReturnsType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    useEffect(() => {
        if (timesArray.length == maxTimes) {
            setReachedMaxTimes(true);
        } else {
            setReachedMaxTimes(false);
        }
        console.log(weekDaysSelected);
    });
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
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </Grid>
                            {timesArray.map((time, index) =>
                                <Grid item xs={12} key={"test123" + index}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <TimePicker
                                            label="בחר שעה"
                                            value={timesArray[index]}
                                            onChange={(newValue) => {
                                                handleTimeChange(newValue, index);
                                            }}
                                            renderInput={(params) => <TextField {...params} fullWidth
                                                                                error={showError(time, index)}
                                                                                InputLabelProps={{shrink: true}}

                                            />}
                                            InputProps={{
                                                startAdornment: (index !== 0) && (
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => handleRemoveTime(index)}
                                                    >
                                                        <CancelIcon/>
                                                    </IconButton>
                                                )
                                            }}


                                        />
                                    </LocalizationProvider>
                                </Grid>)
                            }

                            <Grid item xs={12}>
                                <IconButton onClick={handleAddTimeClick}
                                            disabled={reachedMaxTimes}><AddAlarmIcon/></IconButton>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    select
                                    fullWidth
                                    id="returns"
                                    label="חזרה"
                                    name="returns"
                                    value={returnsType}
                                    onChange={handleSelectUserType}
                                >
                                    {returnsTypeOptions.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {/*in case of repeat each few days*/}
                            {returnsType == returnsTypeOptions[2] &&
                                <Grid item xs={4}>
                                    <TextField
                                        id="day number"
                                        label="מספר ימים"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={eachManyDays}
                                        onChange={handleEachManyDaysChange}
                                        fullWidth
                                    />
                                </Grid>
                            }
                            {/*in case of repeat each few days*/}
                            {returnsType == returnsTypeOptions[4] &&
                                <Grid item xs={4}>
                                    <TextField
                                        id="'week number'"
                                        label="מספר שבועות"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={eachManyWeeks}
                                        onChange={handleEachManyWeeksChange}
                                        fullWidth
                                    />
                                </Grid>
                            }
                            {/*in case of repeat each few or each week weeks*/}
                            {(returnsType == returnsTypeOptions[3] || returnsType == returnsTypeOptions[4]) &&
                                <div>
                                    <FormControl sx={{m: 1, width: 300}}>
                                        <InputLabel id="demo-multiple-checkbox-label">בימים</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            value={weekDaysSelected}
                                            onChange={handleWeekDaysSelectedChange}
                                            input={<OutlinedInput label="ימים בשבוע"/>}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {daysWeekOptions.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox checked={weekDaysSelected.indexOf(name) > -1}/>
                                                    <ListItemText primary={name}/>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            }
                            {returnsType != returnsTypeOptions[0] &&
                                <Grid item xs={5}>
                                    <TextField
                                        select
                                        fullWidth
                                        id="until"
                                        label="חזור עד"
                                        name="returns"
                                        value={untilType}
                                        onChange={handleUntilTypeChange}
                                    >
                                        {untilTypeOptions.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>}
                            {returnsType != returnsTypeOptions[0] && untilType == untilTypeOptions[0] &&
                                <Grid item xs={7}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="תאריך"
                                            value={untilDate}
                                            onChange={handleUntilDateChange}
                                            renderInput={(params) => <TextField {...params} />}

                                        />
                                    </LocalizationProvider>
                                </Grid>

                            }
                            {returnsType != returnsTypeOptions[0] && untilType == untilTypeOptions[1] &&
                                <Grid item xs={7}>
                                    <TextField
                                        id="reminders num"
                                        label="כמות תזכורת (שנותרו)"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={remindersRemain}
                                        onChange={handleRemindersRemainChange}
                                        fullWidth
                                    />
                                </Grid>
                            }

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            צור תזכורת
                        </Button>

                    </Box>
                </Box>
            </Container>

        </Paper>
    )
        ;
}

export default RemindersCreateForm;