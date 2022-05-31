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
import {Button, Checkbox, Fab, FormControlLabel, FormGroup, Paper, Stack} from "@mui/material";
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

    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));
    useEffect(() => {
        if (currentUser === '') {
            navigate("/login");

        }

    }, [currentUser]);
    const [onReminderCreation, setOnReminderCreation] = useState(false);
    const toggleOnReminderCreation = () => {
        setOnReminderCreation((prevState => !prevState));
    }
    const loadReminders = () => {
        //TODO: load data, currently will create fake data

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
        newData[UNTIL_DATE]= fakeExpiration;
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
        newEndDate.setDate(newEndDate.getDate() + 1);
        newEndDate.setHours(0);
        newEndDate.setMinutes(0);
        newEndDate.setSeconds(0);
        newData[UNTIL_DATE] = newEndDate;
        return newData;
    }
    const convertToUntilNum = (newData) => {
        newData[untilTypeOptions] = untilTypeOptions.NUM;
        let end = new Date(newData[UNTIL_DATE]);
        let start = new Date(newData[TIMES_ARRAY][0]);
        let difference = end.getTime() - start.getTime();
        let daysDiff = Math.ceil(difference / (1000 * 3600 * 24));
        newData[REMINDERS_NUM] = daysDiff;
        return newData;

    }
    const convertEachWeek = (newData) => {
        newData[RETURNS_TYPE] = returnsTypeOptions.EACH_FEW_DAYS;
        newData[EACH_MANY_WEEKS] = 1;
    }
    const handleSubmit = async (originalData) => {
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
            if (newData[UNTIL_TYPE] === untilTypeOptions.DATE) {
                convertToUntilNum(newData);
            } else {
                newData[UNTIL_DATE] = fakeExpiration;
            }
            await sendEachFewDays(newData, originalData);
            const data = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.GET_USER_ALERT_LIST);
            console.log(data);
            return true;

        }
        if (newData[RETURNS_TYPE] === returnsTypeOptions.EACH_WEEK) {
            convertEachWeek();
        }
        await sendEachFewWeeks(newData, originalData);
        const data = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.GET_USER_ALERT_LIST);


    }
    const dateToString = (date) => {
        const days = Math.floor(date.getDate() / 10) === 0 ? '0' + date.getDate() : date.getDate();
        const months = Math.floor((date.getMonth() + 1) / 10) === 0 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        const years = date.getFullYear();//assuming all after 10000
        const hours = Math.floor(date.getHours() / 10) === 0 ? '0' + date.getHours() : date.getHours();
        const minutes = Math.floor(date.getMinutes()) / 10 === 0 ? '0' + date.getMinutes() : date.getMinutes();
        return days + '.' + months + '.' + years + "-" + hours + ':' + minutes;

    }
    const sendEachFewWeeks = async (data, originalData) => {
        let hours = [];
        let minutes = [];
        let days = [];
        let weeks = [];
        for (let i = 0; i < data[TIMES_ARRAY].length; i++) {
            for (let j = 0; j < data[WEEK_DAYS_SELECTED]; j++) {
                hours.push(new Date(data[TIMES_ARRAY[i]]).getHours());
                minutes.push(new Date(data[TIMES_ARRAY][i]).getMinutes());
                days.push(daysWeekOptions.indexOf(data[TIMES_ARRAY][j]) + 1);
                weeks.push(data[EACH_MANY_WEEKS]);
            }

        }

        const requastParams = {
            'alertName': data[TITLE],
            "regNum": data[MEDICINE]['regNum'],
            'alertExpiration': dateToString(new Date(data[UNTIL_DATE])),
            'days': days.join("&"),
            'hours': hours.join("&"),
            "minutes" : minutes.join("&"),
            "weeks": weeks.join("&")
        }
        await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.ADD_SCHEDULE_ALERT, requastParams);
    }
    const sendEachFewDays = async (data, originalData) => {
        const dates = [];
        console.log(data);
        const now = new Date();

        for (let i = 0; i < data[TIMES_ARRAY].length; i++) {
            let curDate = new Date(data[TIMES_ARRAY][i]);
            for (let j = 0; j < data[REMINDERS_NUM]; j++) {
                // console.log(curDate.getTime() > now.getTime());
                // console.log(dateToString(curDate));
                if (curDate.getTime() > now.getTime()) {
                    dates.push(dateToString(curDate));
                } else if (originalData[UNTIL_TYPE] === untilTypeOptions.NUM) {
                    j--;
                }
                curDate.setDate(curDate.getDate() + data[EACH_MANY_DAYS]);
            }
        }
        const requastParams = {
            // 'alertName': JSON.stringify(originalData).toString(),//TODO:
            'alertName': data[TITLE],
            "regNum": data[MEDICINE]['regNum'],
            'alertExpiration': dateToString(new Date(data[UNTIL_DATE])), 'fixedDateList': dates.join("&")
        }
        console.log(requastParams);
        const curData = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.ADD_FIXED_ALERT, requastParams);
    }
    // const createStringFromReminder  = (data){
    //
    // }
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
                    <Box style={{maxHeight: '50vh', overflow: 'auto'}} margin={'27px'}> <Grid container
                                                                                              columnSpacing={5}
                                                                                              rowSpacing={2.8}
                                                                                              style={{overflowY: 'scroll'}}>

                        <Grid item md={3}>
                            <RecipeReviewCard/>
                        </Grid>
                        <Grid item md={3}>
                            <RecipeReviewCard/>
                        </Grid>
                        <Grid item md={3}>
                            <RecipeReviewCard/>
                        </Grid>
                        <Grid item md={3}>
                            <RecipeReviewCard/>
                        </Grid>
                        <Grid item md={3}>
                            <RecipeReviewCard/>
                        </Grid>
                        <Grid item md={3}>
                            <RecipeReviewCard/>
                        </Grid>
                        <Grid item md={3}>
                            <RecipeReviewCard/>
                        </Grid>
                        <Grid item md={3}>
                            <RecipeReviewCard/>
                        </Grid>
                    </Grid>
                    </Box>

                    <TransitionsModal open={onReminderCreation} toggleModal={toggleOnReminderCreation}>
                        <RemindersCreateForm handleSubmit={handleSubmit}/>
                    </TransitionsModal>
                </React.Fragment>
            </ThemeProvider>
        </CacheProvider>
    )
        ;
}
