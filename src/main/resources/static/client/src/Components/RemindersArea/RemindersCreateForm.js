import {Alert, Box, Divider, Snackbar, ThemeProvider} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
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
import {getRequest} from "../../Utils/AxiosRequests";
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import {USER_PROFILE} from "../../Consts/StatePaths";
import {getAuth} from "firebase/auth";
import {ServerConsts} from "../../Consts/apiPaths";
import {current} from "@reduxjs/toolkit";

export const TITLE = 'title';
export const MEDICINE = 'medicine';
export const TIMES_ARRAY = 'timesArray';
export const RETURNS_TYPE = 'returnType';
export const WEEK_DAYS_SELECTED = 'weekDays';
export const EACH_MANY_WEEKS = 'weeksNumber';
export const UNTIL_DATE = 'untilDate';
export const UNTIL_TYPE = 'untilType';
export const REMINDERS_NUM = 'reminderNum';
export const EACH_MANY_DAYS = 'eachManyDAys';
export const IN_WHICH_DATE = "inDate";
export const REG_NUM = 'regNumber'
export const defualtFormData = () => {
    const data = {};
    data[TIMES_ARRAY] = [null];
    data[TITLE] = "";
    data[RETURNS_TYPE] = returnsTypeOptions.NOT_RETURN;
    data[EACH_MANY_DAYS] = 2;
    data[EACH_MANY_WEEKS] = 2;
    data[WEEK_DAYS_SELECTED] = initilizeWeekDaysSelected();
    data[UNTIL_DATE] = getAfterWeek();
    data[UNTIL_TYPE] = untilTypeOptions.DATE;
    data[MEDICINE] = loadingMed;
    data[IN_WHICH_DATE] = new Date();
    data[REMINDERS_NUM] = 2;
    return data;
}

export const returnsTypeOptions = {
    NOT_RETURN: 'לא חוזר',
    EACH_DAY: 'כל יום',
    EACH_FEW_DAYS: 'כל כמה ימים',
    EACH_WEEK: 'כל שבוע',
    EACH_FEW_WEEKS: 'כל כמה שבועות',
};
export const daysWeekOptions = [
    'ראשון',
    'שני',
    'שלישי',
    'רביעי',
    'חמישי',
    'שישי',
    'שבת'
];
export const shortDaysWeekOptions = [
    'א',
    'ב',
    'ג',
    'ד',
    'ה',
    'ו',
    'ש'
];
export const untilTypeOptions = {
    DATE: 'תאריך',
    NUM: 'כמות תזכורת'
};
export const fakeExpiration = new Date('2500-01-01')
export const defualtMed = "בחר תרופה";
export const loadingMed = "טוען תרופות..."
export const getTomorow = () => {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
}
export const getAfterWeek = () => {
    let date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
}
const initilizeWeekDaysSelected = () => {
    const today = new Date().getDay();
    return [daysWeekOptions[today]];
}

function RemindersCreateForm(props) {
    // const auth = getAuth().currentUser.uid;
    // const profile = useSelector((state) => getSafe(USER_PROFILE, state));
    //

    const maxTimes = 15;
    const ltrTheme = createTheme({direction: 'ltr'});
    const defualtErrorMessege = "חלק מהפרטים שגויים, נסה שוב";
    const [hasErrorOnSomeField, set] = React.useState(false);
    const [stopStream, setStopStream] = useState(false);
    const [timesArray, setTimesArray] = useState(props.formData[TIMES_ARRAY]);
    const [name, setName] = React.useState(props.formData[TITLE]);
    const [value, setValue] = React.useState(null);
    const [triedSubmit, setTriedSubmitted] = React.useState(false);
    const [reachedMaxTimes, setReachedMaxTimes] = React.useState(false);
    const [eachManyDays, setEachManyDays] = React.useState(props.formData[EACH_MANY_DAYS]);
    const [eachManyWeeks, setEachManyWeeks] = React.useState(props.formData[EACH_MANY_WEEKS]);
    const [returnsType, setReturnsType] = useState(props.formData[RETURNS_TYPE]);
    const [weekDaysSelected, setWeekDaysSelected] = React.useState(props.formData[WEEK_DAYS_SELECTED]);
    const [untilType, setUntilType] = React.useState(props.formData[UNTIL_TYPE]);
    const [remindersRemain, setRemindersRemain] = React.useState(props.formData[REMINDERS_NUM]);
    const [errorMessegeOpen, setErrorMessegeOpen] = React.useState(false);
    const [newFrom, setNewFrom] = React.useState(0);
    const [untilDate, setUntilDate] = React.useState(props.formData[UNTIL_DATE]);
    const [medicineFullList, setMedicineFullList] = React.useState(props.medicineList);
    const [medicineList, setMedicineList] = React.useState([props.formData[MEDICINE]]);
    const [medicine, setMedicine] = React.useState(props.formData[MEDICINE]);
    const [weekDaysError, setWeekDaysError] = React.useState(false);
    const [inDate, setInDate] = React.useState(props.formData[IN_WHICH_DATE]);
    const [errorMessege, setErrorMessege] = React.useState(defualtErrorMessege);


    useEffect(async () => {
        if (medicineFullList != []) {
            let medicenes = [defualtMed];
            for (let i = 0; i < medicineFullList.length; i++) {
                medicenes[i + 1] = medicineFullList[i]['hebName'];
            }
            console.log(props.formData[MEDICINE]);
            let med = props.medicineInd === -1 ? props.formData[MEDICINE] : medicenes[props.medicine + 1]
            if(med === loadingMed){
                med = defualtMed;
            }
            setMedicine(med);
            setMedicineList(medicenes);
            if (med !== defualtMed && med!== loadingMed) {
                handleMedicineChange2(med, medicenes);
            }
            setMedicineList([...new Set(medicenes)]);

        }

    }, []);
    useEffect(() => {
        if (timesArray.length == maxTimes) {
            setReachedMaxTimes(true);
        } else {
            setReachedMaxTimes(false);
        }
    }, [timesArray]);
    const handleMedicineChange = (event) => {
        handleMedicineChange2(event.target.value);
    }

    const handleMedicineChange2 = (value, medLis = medicineList) => {
        console.log(medLis);
        console.log(medLis[0]);
        if (medLis[0] === defualtMed) {
            const next = [...medLis];
            next.splice(0, 1);
            setMedicineList(next);
        }
        setMedicine(value);
    }


    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            },
        },
    };
    const handleInDateChange = (date) => {
        setInDate(date);
    }
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
        setEachManyWeeks(event.target.value < 1 ? 1 : event.target.value);
    }
    const handleEachManyDaysChange = (event) => {
        setEachManyDays(event.target.value < 1 ? 1 : event.target.value);
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
        setWeekDaysError(false);
    };
    const navigate = useNavigate();


    const showError = (time, index, triedSumit2 = false, newFrom2 = 0) => {
        let hasError = !validateTime(time, index);
        if (!triedSumit2 && ((newFrom2 == 0 ? index >= newFrom : index >= newFrom2) || (!triedSubmit && time == null))) {
            return false;
        } else {

            return hasError;
        }


    }
    const validateTime = (time, index) => {
        if ((new Date(time) == "Invalid Date") || isNaN(new Date(time)) || Date.parse(new Date(time)) === 0) {
            return false;
        }
        if (returnsType === returnsTypeOptions.NOT_RETURN && (new Date(inDate)).getDate() === new Date().getDate() && new Date(inDate).getMonth() === new Date().getMonth()) {

            if (new Date(time).getTime() < new Date().getTime()) {
                setErrorMessege("תזמנת התראה לעבר, שנה ונסה שוב")
                return false;
            }
        }
        for (let i = 0; i < timesArray.length; i++) {
            if (index != i) {
                if (new Date(time).getHours() == new Date(timesArray[i]).getHours() && new Date(time).getMinutes() == new Date(timesArray[i]).getMinutes()) {
                    if (index > i) {
                        setErrorMessege("יצרת שתי התראות באותו זמן, שנה ונסה שוב")
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // const checkIfHasError = (time, index) => {
    //     let hasError = !validateTime(time, index);
    //     let nextHasError = [...hasErrorArr];
    //     nextHasError[index] = hasError;
    //     setHasErrorArr(nextHasError);
    // }

    const handleTimeChange = (time, index) => {
        const next = [...timesArray];
        //for some reasons somtimes created previous year
        if(new Date(time).getFullYear()!= new Date().getFullYear()){
            time = new Date(new Date(time).setFullYear(new Date().getFullYear()))
        }
        console.log(time);
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
    const handleSelectReturnsType = (event) => {
        if (event.target.value !== returnsTypeOptions.EACH_FEW_WEEKS) {
            setUntilType(untilTypeOptions.DATE);
        }
        setWeekDaysError(false);
        setReturnsType(event.target.value);

    };
    const showMedicineError = (triedSubmitted2 = false) => {
        if (medicine === defualtMed && (triedSubmit || triedSubmitted2)) {
            return true;
        } else {
            return false;
        }
    }
    const closeError = () => {
        setErrorMessegeOpen(false);
        setErrorMessege(defualtErrorMessege);
    }
    const myHandleSubmit = (event) => {
        event.preventDefault();
        setTriedSubmitted(true);
        setNewFrom(timesArray.length);
        for (let i = 0; i < timesArray.length; i++) {
            if (timesArray[i] == null || showError(timesArray[i], i, true, timesArray.length)) {
                setErrorMessegeOpen(true);
                return false;
            }
        }
        if (showMedicineError(true)) {
            setErrorMessege("בעיה בבחירת התרופה, שנה ונסה שוב")
            setErrorMessegeOpen(true);
            return false;
        }
        if (returnsType === returnsTypeOptions.EACH_WEEK || returnsType === returnsTypeOptions.EACH_FEW_WEEKS) {
            if (weekDaysSelected == "") {
                setErrorMessegeOpen(true);
                setWeekDaysError(true);
                return false;
            }
        }
        console.log(weekDaysSelected);
        const data = new FormData(event.currentTarget);
        const value = Object.fromEntries(data.entries());
        value[TIMES_ARRAY] = timesArray;
        value[WEEK_DAYS_SELECTED] = weekDaysSelected;
        value[UNTIL_TYPE] = untilType;
        value[UNTIL_DATE] = untilDate;
        value[IN_WHICH_DATE] = inDate;
        value[MEDICINE] = medicine;
        value[EACH_MANY_WEEKS] = eachManyWeeks;
        value[EACH_MANY_DAYS] = eachManyDays;
        for (let i = 0; i < medicineFullList.length; i++) {
            if(medicineFullList[i]['hebName'] === medicine){
                value[REG_NUM] = medicineFullList[i]['regNum'];
                break;
            }
        }
        console.log(value);
        props.handleSubmit(value);
        return true;


    };


    return (
        <>
            <Snackbar open={errorMessegeOpen}
                      autoHideDuration={1500}
                      onClose={closeError}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity="error">
                    {errorMessege}
                </Alert>
            </Snackbar>
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
                                        label="כותרת (אופציונלי)"
                                        value={name}
                                        onChange={handleNameChange}
                                        autoComplete={"off"}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        id={MEDICINE}
                                        label="תרופה"
                                        name={MEDICINE}
                                        value={medicine}
                                        onChange={handleMedicineChange}
                                        error={showMedicineError()}
                                    >
                                        {medicineList.map((type) => (
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
                                        onChange={handleSelectReturnsType}
                                    >
                                        {Object.values(returnsTypeOptions).map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/*in case of repeat each few days*/}
                                {returnsType == returnsTypeOptions.EACH_FEW_DAYS &&
                                    <Grid item xs={4}>
                                        <TextField
                                            id={EACH_MANY_DAYS}
                                            label="מספר ימים"
                                            name={EACH_MANY_DAYS}
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
                                {returnsType == returnsTypeOptions.EACH_FEW_WEEKS &&
                                    <Grid item xs={4}>
                                        <TextField
                                            id={EACH_MANY_WEEKS}
                                            label="מספר שבועות"
                                            name={EACH_MANY_WEEKS}
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
                                {(returnsType == returnsTypeOptions.EACH_WEEK || returnsType == returnsTypeOptions.EACH_FEW_WEEKS) &&
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-multiple-checkbox-label">בימים</InputLabel>
                                            <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                multiple
                                                error={weekDaysError}
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
                                <Grid item xs={12}><Divider/></Grid>
                                {returnsType == returnsTypeOptions.NOT_RETURN &&
                                    <>
                                        <Grid item xs={12}><Divider/></Grid>
                                        <Grid item xs={12}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <ThemeProvider theme={ltrTheme}>
                                                    <DatePicker
                                                        label="בחר תאריך"
                                                        id={IN_WHICH_DATE}
                                                        name={IN_WHICH_DATE}
                                                        value={inDate}
                                                        onChange={handleInDateChange}
                                                        views={["year", "month", "day"]}
                                                        filel
                                                        inputFormat="dd/MM/yyyy"
                                                        minDate={new Date()}
                                                        renderInput={(params) => <TextField {...params}
                                                        />}

                                                    />
                                                </ThemeProvider>
                                            </LocalizationProvider>
                                        </Grid>
                                    </>}
                                {(returnsType == returnsTypeOptions.EACH_FEW_DAYS || returnsType == returnsTypeOptions.EACH_DAY) &&

                                    <Grid item xs={5}>
                                        <TextField
                                            select
                                            fullWidth
                                            id={UNTIL_TYPE}
                                            label="חזור עד"
                                            name={UNTIL_TYPE}
                                            value={untilType}
                                            onChange={handleUntilTypeChange}
                                        >
                                            {Object.values(untilTypeOptions).map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                }
                                {returnsType != returnsTypeOptions.NOT_RETURN && !((returnsType == returnsTypeOptions.EACH_FEW_DAYS || returnsType == returnsTypeOptions.EACH_DAY) && untilType != untilTypeOptions.DATE) &&
                                    <Grid item xs={7}>

                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <ThemeProvider theme={ltrTheme}>
                                                <DatePicker
                                                    label={(returnsType == returnsTypeOptions.EACH_FEW_DAYS || returnsType == returnsTypeOptions.EACH_DAY) ? "תאריך (כולל)" : "חזור עד (כולל)"}
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
                                {(returnsType == returnsTypeOptions.EACH_FEW_DAYS || returnsType == returnsTypeOptions.EACH_DAY) && untilType == untilTypeOptions.NUM &&
                                    <Grid item xs={7}>
                                        <TextField
                                            id={REMINDERS_NUM}
                                            label=" כמות תזכורת (מעתה והלאה)"
                                            name={REMINDERS_NUM}
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
        </>
    )
        ;
}

RemindersCreateForm.defaultProps = {
    formData: defualtFormData(),
    handleSubmit: (res) => {
        return true;
    },
    medicineList: [],
    medicineInd: -1,


}
export default RemindersCreateForm;