import {Box, Divider, ThemeProvider} from "@mui/material";
import React, {useEffect, useState} from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CancelIcon from '@mui/icons-material/Cancel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import {useNavigate} from "react-router-dom";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {DatePicker} from "@mui/x-date-pickers";
import {createTheme} from "@mui/material/styles";

export const TITLE = 'title';
export const MEDICINE = 'medicine';
export const TIMES_ARRAY = 'timesArray';
export const RETURNS_TYPE = 'returnType';
export const WEEK_DAYS_SELECTED = 'weekDays';
export const WEEKS_NUMBER = 'weeksNumber';
export const UNTIL_DATE = 'untilDate'
export const returnsTypeOptions = [
    'לא חוזר',
    'כל יום',
    'כל כמה ימים',
    'כל שבוע',
    'כל כמה שבועות',
];
export const daysWeekOptions = [
    'ראשון',
    'שני',
    'שלישי',
    'רביעי',
    'חמישי',
    'שישי',
    'שבת'
];
export const untilTypeOptions = [
    'תאריך',
    'כמות תזכורת'
]

const initilizeWeekDaysSelected = () => {
    const today = new Date().getDay();
    return [daysWeekOptions[today]];
}
const getTomorow = () => {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
}

function RemindersCreateForm(props) {
    const maxTimes = 15;
    const ltrTheme = createTheme({direction: 'ltr'});


    const [stopStream, setStopStream] = useState(false);
    const [timesArray, setTimesArray] = useState(props.timesArray);
    const [name, setName] = React.useState(props.name);
    const [value, setValue] = React.useState(null);
    const [hasErrorArr, setHasErrorArr] = React.useState(new Array(15).fill(false));
    const [triedSubmit, setTriedSubmitted] = React.useState(false);
    const [reachedMaxTimes, setReachedMaxTimes] = React.useState(false);
    const [eachManyDays, setEachManyDays] = React.useState(props.eachManyDays);
    const [eachManyWeeks, setEachManyWeeks] = React.useState(props.eachManyWeeks);
    const [returnsType, setReturnsType] = useState(props.returnsType);
    const [weekDaysSelected, setWeekDaysSelected] = React.useState(props.weekDays);
    const [medicene, setMedicene] = React.useState();
    const [untilType, setUntilType] = React.useState(untilTypeOptions[0]);
    const [remindersRemain, setRemindersRemain] = React.useState(2);
    const [untilDate, setUntilDate] = React.useState(props.untilDate);


    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
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

    }

    const handleRemoveTime = (index) => {
        const next = [...timesArray];
        next.splice(index, 1);
        setTimesArray(next);
    }
    const handleSelectUserType = (event) => {
        setReturnsType(event.target.value);
    };

    const myHandleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const value = Object.fromEntries(data.entries());
        value[TIMES_ARRAY] = timesArray;
        value[WEEK_DAYS_SELECTED] = weekDaysSelected;
        props.handleSubmit(value);
        console.log(value);

    };

    useEffect(() => {
        if (timesArray.length == maxTimes) {
            setReachedMaxTimes(true);
        } else {
            setReachedMaxTimes(false);
        }
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
                    <Box component="form" noValidate onSubmit={myHandleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id={TITLE}
                                    name={TITLE}
                                    label="כותרת"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    id={MEDICINE}
                                    label="תרופה"
                                    name={MEDICINE}
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
                            <Grid item xs={12}><Divider/></Grid>
                            <Grid item xs={8}>
                                <TextField
                                    select
                                    fullWidth
                                    id={RETURNS_TYPE}
                                    label="חזרה"
                                    name={RETURNS_TYPE}
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
                                        id={WEEKS_NUMBER}
                                        label="מספר שבועות"
                                        name={WEEKS_NUMBER}
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
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
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
                                            fullWidth
                                        >
                                            {daysWeekOptions.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox checked={weekDaysSelected.indexOf(name) > -1}/>
                                                    <ListItemText primary={name}/>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
                            {returnsType != returnsTypeOptions[0] &&
                                <Grid item xs={12}><Divider/></Grid>}
                            {/*        <Grid item xs={5}>*/}
                            {/*            <TextField*/}
                            {/*                select*/}
                            {/*                fullWidth*/}
                            {/*                id="until"*/}
                            {/*                label="חזור עד"*/}
                            {/*                name="returns"*/}
                            {/*                value={untilType}*/}
                            {/*                onChange={handleUntilTypeChange}*/}
                            {/*            >*/}
                            {/*                {untilTypeOptions.map((type) => (*/}
                            {/*                    <MenuItem key={type} value={type}>*/}
                            {/*                        {type}*/}
                            {/*                    </MenuItem>*/}
                            {/*                ))}*/}
                            {/*            </TextField>*/}
                            {/*        </Grid>*/}
                            {/*    </>}*/}
                            {returnsType != returnsTypeOptions[0] && untilType == untilTypeOptions[0] &&
                                <Grid item xs={7}>

                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <ThemeProvider theme={ltrTheme}>
                                            <DatePicker
                                                label="חזור עד"
                                                id={UNTIL_DATE}
                                                name={UNTIL_DATE}
                                                value={untilDate}
                                                onChange={handleUntilDateChange}
                                                views={["year", "month", "day"]}
                                                inputFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                renderInput={(params) => <TextField {...params}
                                                />}

                                            />
                                        </ThemeProvider>

                                    </LocalizationProvider>
                                </Grid>

                            }
                            {/*{returnsType != returnsTypeOptions[0] && untilType == untilTypeOptions[1] &&*/}
                            {/*    <Grid item xs={7}>*/}
                            {/*        <TextField*/}
                            {/*            id="reminders num"*/}
                            {/*            label="כמות תזכורת (שנותרו)"*/}
                            {/*            type="number"*/}
                            {/*            InputLabelProps={{*/}
                            {/*                shrink: true,*/}
                            {/*            }}*/}
                            {/*            value={remindersRemain}*/}
                            {/*            onChange={handleRemindersRemainChange}*/}
                            {/*            fullWidth*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*}*/}

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

RemindersCreateForm.defaultProps = {
    timesArray: [null],
    name: "",
    returnsType: returnsTypeOptions[0],
    eachManyDays: 2,
    eachManyWeeks: 2,
    weekDays: initilizeWeekDaysSelected(),
    untilDate: getTomorow(),
    handleSubmit: (res) => {
        return true;
    }

}
export default RemindersCreateForm;