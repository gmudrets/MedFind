import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import Grid from "@mui/material/Grid";
//rtl stuff https://mui.com/material-ui/guides/right-to-left/
import rtlPlugin from 'stylis-plugin-rtl';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {prefixer} from 'stylis';
import {Button, Checkbox, Dialog, Fab, FormControlLabel, FormGroup, Paper, Stack} from "@mui/material";
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import * as STATE_PATHS from "../../Consts/StatePaths";
import Typography from "@mui/material/Typography";
import {CheckBox} from "@mui/icons-material";
import {isMobile} from "react-device-detect";
import BarcodeScanner from "../BarcodeScanner/BarcodeScanner";
import TransitionsModal from "../UI/Modal/Modal";
import {useEffect, useState} from "react";
import RemindersCreateForm, {
    daysWeekOptions,
    EACH_MANY_DAYS, EACH_MANY_WEEKS, fakeExpiration,
    getTomorow, MEDICINE, REMINDERS_NUM,
    RETURNS_TYPE,
    returnsTypeOptions,
    TIMES_ARRAY, TITLE,
    UNTIL_DATE, UNTIL_TYPE, untilTypeOptions, WEEK_DAYS_SELECTED
} from "./RemindersCreateForm";
import {useNavigate} from "react-router-dom";
import {getRequest} from "../../Utils/AxiosRequests";
import {getAuth} from "firebase/auth";
import {ServerConsts} from "../../Consts/apiPaths";
import RecipeReviewCard from "./BasicCard";
import * as RemindersFields from "../../Consts/RemindersFields";
import ReminderCard from "./ReminderCard";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";


// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props) {
    return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export default function Reminders() {
    const theme = createTheme({direction: 'rtl'});
    const navigate = useNavigate();
    const [RemindersList, setRemindersList] = React.useState(null);
    const [medicineList, setMedicineList] = React.useState(null);
    const [deletedID, setDeletedID] = React.useState(null);
    const [loadingNew, setLoadingNew] = React.useState(false);

    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));
    useEffect(() => {
        if (currentUser === '') {
            navigate("/login");

        }

    }, [currentUser]);
    useEffect(() => {
        console.log(RemindersList);
    }, [RemindersList]);
    // useEffect(() => {
    //     console.log(medicineList);
    // }, [medicineList]);

    useEffect(async () => {
        if (getAuth() != null) {
            const token = await getAuth().currentUser.getIdToken(true);
            setMedicineList(await getRequest(token, ServerConsts.GET_ALL_MEDICINE));
            const list = await getRequest(token, ServerConsts.GET_USER_ALERT_LIST);
            setRemindersList(list.reverse());
        }
    }, []);
    const [onReminderCreation, setOnReminderCreation] = useState(false);
    const toggleOnReminderCreation = () => {
        setOnReminderCreation((prevState => !prevState));
    }

    const handleAddClick = () => {
        setOnReminderCreation(true);
        console.log(dateToString(new Date()));
    }
    const convertNotReturn = (newData) => {
        newData[RETURNS_TYPE] = returnsTypeOptions.EACH_FEW_DAYS;
        newData[EACH_MANY_DAYS] = 1;
        newData[UNTIL_TYPE] = untilTypeOptions.NUM;
        newData[REMINDERS_NUM] = 1;
        newData[UNTIL_DATE] = fakeExpiration;
        console.log(fakeExpiration);
        return newData;
    }
    const convertEachDay = (newData) => {
        newData[RETURNS_TYPE] = returnsTypeOptions.EACH_FEW_DAYS;
        newData[EACH_MANY_DAYS] = 1;
        return newData;
    }
    const changeEndDate = (newData) => {
        let newEndDate = new Date(newData[UNTIL_DATE]);
        newEndDate.setDate(newEndDate.getDate());
        newEndDate.setHours(23);
        newEndDate.setMinutes(59);
        newEndDate.setSeconds(59);
        newData[UNTIL_DATE] = newEndDate;
        return newData;
    }
    const convertToUntilNum = (newData) => {
        newData[untilTypeOptions] = untilTypeOptions.NUM;
        let end = new Date(newData[UNTIL_DATE]);
        let start = new Date(newData[TIMES_ARRAY][0]);
        let difference = end.getTime() - start.getTime();
        let daysDiff = Math.ceil(difference / (1000 * 3600 * 24));
        newData[REMINDERS_NUM] = Math.floor(daysDiff / newData[EACH_MANY_DAYS]);
        return newData;

    }
    const convertEachWeek = (newData) => {
        newData[RETURNS_TYPE] = returnsTypeOptions.EACH_FEW_DAYS;
        newData[EACH_MANY_WEEKS] = 1;
    }
    const handleSubmit = async (originalData) => {
        setLoadingNew(true);
        toggleOnReminderCreation();
        const newData = JSON.parse(JSON.stringify(originalData));
        changeEndDate(newData);
        if (originalData[RETURNS_TYPE] === returnsTypeOptions.NOT_RETURN) {
            convertNotReturn(newData);
        }
        if (originalData[RETURNS_TYPE] === returnsTypeOptions.EACH_DAY) {
            console.log(newData);
            convertEachDay(newData);

        }
        console.log(newData);
        if (newData[RETURNS_TYPE] === returnsTypeOptions.EACH_FEW_DAYS) {
            if (newData[UNTIL_TYPE] !== untilTypeOptions.DATE) {
                newData[UNTIL_DATE] = fakeExpiration;

            }
            // convertToUntilNum(newData);
            // } else {
            // }
            await sendEachFewDays(newData, originalData);
            const data = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.GET_USER_ALERT_LIST);
            setRemindersList(data.reverse());
            setLoadingNew(false);
            return true;

        }
        if (newData[RETURNS_TYPE] === returnsTypeOptions.EACH_WEEK) {
            convertEachWeek(newData);
        }
        await sendEachFewWeeks(newData, originalData);
        const data = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.GET_USER_ALERT_LIST);
        setRemindersList(data.reverse());
        setLoadingNew(false);
        return true;


    }
    const rtl = (str) => {
        return '\u202B' + str + '\u202C';
    }
    const dateToString = (date, d = date.getDate(), m = (date.getMonth() + 1), y = date.getFullYear(), h = date.getHours(), min = date.getMinutes()) => {
        const days = Math.floor(d / 10) === 0 ? '0' + d : d;
        const months = Math.floor((m) / 10) === 0 ? '0' + (m) : m;
        const years = y;//assuming all after 10000
        const hours = Math.floor(h / 10) === 0 ? '0' + h : h;
        const minutes = Math.floor(min / 10) === 0 ? '0' + min : min;
        return days + '.' + months + '.' + years + "-" + hours + ':' + minutes;

    }


    const sendEachFewWeeks = async (data, originalData) => {
        console.log("hello")
        let hours = [];
        let minutes = [];
        let days = [];
        let weeks = [];
        for (let i = 0; i < data[TIMES_ARRAY].length; i++) {
            for (let j = 0; j < data[WEEK_DAYS_SELECTED].length; j++) {
                console.log(new Date(data[TIMES_ARRAY][i]).getHours());
                hours.push(new Date(data[TIMES_ARRAY][i]).getHours());
                minutes.push(new Date(data[TIMES_ARRAY][i]).getMinutes());
                days.push(daysWeekOptions.indexOf(data[WEEK_DAYS_SELECTED][j]) + 1);
                weeks.push(data[EACH_MANY_WEEKS]);
            }

        }
        const requastParams = {
            'alertName': data[TITLE],
            "regNum": data[MEDICINE]['regNum'],
            'alertExpiration': dateToString(new Date(data[UNTIL_DATE])),
            'days': days.join("&days="),
            'hours': hours.join("&hours="),
            "minutes": minutes.join("&minutes="),
            "weeks": weeks.join("&weeks=")
        }
        console.log(requastParams);
        await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.ADD_SCHEDULE_ALERT, requastParams);
    }
    const sendEachFewDays = async (data, originalData, skipBefore) => {
        const dates = [];
        console.log(data);
        const now = new Date();

        for (let i = 0; i < data[TIMES_ARRAY].length; i++) {
            let curDate = new Date(data[TIMES_ARRAY][i]);
            if (originalData[UNTIL_TYPE] === untilTypeOptions.NUM) {
                for (let j = 0; j < data[REMINDERS_NUM]; j++) {
                    // console.log(curDate.getTime() > now.getTime());
                    // console.log(dateToString(curDate));
                    if (curDate.getTime() > now.getTime()) {
                        console.log(curDate);
                        console.log(data[EACH_MANY_DAYS]);
                        dates.push(dateToString(curDate));
                    } else {
                        j--;
                    }
                    curDate.setDate(curDate.getDate() + parseInt(data[EACH_MANY_DAYS]));

                }
            } else {
                while (curDate.getTime() < data[UNTIL_DATE].getTime()) {
                    // console.log(curDate.getTime() > now.getTime());
                    // console.log(dateToString(curDate));
                    if (curDate.getTime() > now.getTime()) {
                        console.log(curDate);
                        console.log(data[EACH_MANY_DAYS]);
                        dates.push(dateToString(curDate));
                    }
                    curDate.setDate(curDate.getDate() + parseInt(data[EACH_MANY_DAYS]));
                }

            }

        }
        const requastParams = {
            // 'alertName': JSON.stringify(originalData).toString(),//TODO:
            'alertName': data[TITLE],
            "regNum": data[MEDICINE]['regNum'],
            'alertExpiration': dateToString(new Date(data[UNTIL_DATE])), 'fixedDateList': dates.join("&fixedDateList=")
        }
        console.log(requastParams);
        const curData = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.ADD_FIXED_ALERT, requastParams);
    }

    const createPropsFromItem = (data) => {
        let result = {};

        result['title'] = data[RemindersFields.REM_TITLE];
        let medicineName = null;
        let medicineImage = null;
        let regNum = data['regNum'];
        for (let i = 0; i < medicineList.length; i++) {
            if (medicineList[i]['regNum'] == regNum) {
                medicineName = medicineList[i]['hebName'];
                medicineImage = medicineList[i]['image'];
                break;
            }

        }
        result['image'] = medicineImage;
        result["medicineName"] = medicineName;
        let info = "";
        if (data[RemindersFields.REM_TYPE] == RemindersFields.FIXED) {
            const fixedDate = new Date(data[RemindersFields.FIXED_DATE]);
            const newDateString = dateToString(fixedDate);
            const alertExperation = new Date(data[RemindersFields.REM_EXPERATION]);
            const alretExperationString = dateToString(alertExperation);
            info += "תאריך: ";
            info += toOnlyDateString(newDateString)
            info += "\n"
            info += "שעה: "
            info += toOnlyTimeString(newDateString);
        } else {
            let timeString = dateToString(new Date(), 18, 6, 2022, data[RemindersFields.HOUR], data[RemindersFields.MINUTE]);
            console.log(data[RemindersFields.WEEK]);
            let expeartionDateString = dateToString(new Date(data[RemindersFields.REM_EXPERATION]));
            expeartionDateString = toOnlyDateString(expeartionDateString);
            timeString = toOnlyTimeString(timeString);
            info += "שעה: "
            info += timeString;
            info += "\n";
            info += "ביום: ";
            info += daysWeekOptions[data[RemindersFields.DAY_IN_WEEK] - 1];
            info += "\n";
            if (data[RemindersFields.WEEK] === 1) {
                info += "כל שבוע"
            } else {
                info += "כל "
                info += data[RemindersFields.WEEK];
                info += " שבועות"
            }
            info += "\n";
            if (data[RemindersFields.REM_EXPERATION] != fakeExpiration) {
                info += "תאריך סיום: "
                info += expeartionDateString;
                info += "\n";
            }
        }
        result['info'] = info;
        result['id'] = data[RemindersFields.REM_ID];
        result['handleDelete'] = handleDelete;
        return result;

    }
    const toOnlyDateString = (s) => {
        return s.slice(0, 10);
    }
    const toOnlyTimeString = (s) => {
        return s.slice(11, 16);
    }
    const handleDelete = (id) => {
        setDeletedID(id);
    }
    const handleDeleteDialogFinished = (event) => {
        setDeletedID(null);
    }
    const handleFinalDelete = async () => {
        for (let i = 0; i < RemindersList.length; i++) {
            if (RemindersList[i][RemindersFields.REM_ID] === deletedID) {
                const newRem = [...RemindersList];
                newRem.splice(i, 1);
                setRemindersList(newRem);
                break;
            }
        }
        setDeletedID(null);

        await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.DELETE_ALRET_BY_ID, {"id": deletedID});

        ;
    }
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <React.Fragment>

                    <Box sx={{flexGrow: 1}}>
                        <Grid container columnSpacing={2} rowSpacing={2}
                              sx={isMobile ? {padding: "2%", paddingLeft: "4%"} : {padding: "40px"}}>
                            <Grid item md={12} sx={{textAlign: "center"}}>
                                <Fab onClick={handleAddClick} color="primary" aria-label="add">
                                    <AddIcon/>
                                </Fab>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box style={{maxHeight: '50vh', overflow: 'auto'}} margin={'27px'}>
                        <Grid container columnSpacing={5} rowSpacing={2.8} style={{overflowY: 'auto'}}>
                            {loadingNew &&
                                <Grid item xs={12} sx={{textAlign: "left"}}>
                                    <Typography component="h1" variant="h6" marginBottom={'5px'}>טוען התראות חדשות....
                                    </Typography>
                                </Grid>}
                            {RemindersList != null ? (RemindersList).map((item) => (
                                <Grid item md={3}>
                                    <ReminderCard  {...createPropsFromItem(item)}/>
                                </Grid>
                            )) : <Grid item xs={12} sx={{textAlign: "left"}}>
                                <Typography component="h1" variant="h6" marginBottom={'5px'}>טוען התראות....
                                </Typography>
                            </Grid>
                            }


                        </Grid>
                    </Box>

                    <TransitionsModal open={onReminderCreation} toggleModal={toggleOnReminderCreation}>
                        <RemindersCreateForm handleSubmit={handleSubmit} medicineList={medicineList}/>
                    </TransitionsModal>
                    <Dialog
                        open={deletedID != null}
                        onClose={handleDeleteDialogFinished}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"האם אתה בטוח שברצונך למחוק את ההתראה?"}
                        </DialogTitle>

                        <DialogActions>
                            <Button onClick={handleDeleteDialogFinished}>בטל מחיקה</Button>
                            <Button onClick={handleFinalDelete} autoFocus>
                                מחק
                            </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            </ThemeProvider>
        </CacheProvider>
    )
        ;
}
