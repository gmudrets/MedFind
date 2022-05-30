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
import {Button, Checkbox, Fab, FormControlLabel, FormGroup, Stack} from "@mui/material";
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
    EACH_MANY_DAYS,
    getTomorow, MEDICINE, REMINDERS_NUM,
    RETURNS_TYPE,
    returnsTypeOptions,
    TIMES_ARRAY,
    UNTIL_DATE, UNTIL_TYPE, untilTypeOptions
} from "./RemindersCreateForm";
import {useNavigate} from "react-router-dom";
import {getRequest} from "../../Utils/AxiosRequests";
import {getAuth} from "firebase/auth";
import {ServerConsts} from "../../Consts/apiPaths";

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
        console.log("HIIIIIII")
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
    const handleSubmit = async (originalData) => {
        toggleOnReminderCreation();

        const newData = JSON.parse(JSON.stringify(originalData));
        // changeEndDate(newData);
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
            }
            await sendEachFewDays(newData, originalData);
            return true;

        }
    }
    const dateToString = (date) => {
        return (date.getDate()) + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + "-" + (date.getHours()) + ':' +
            (date.getMinutes())

    }
    const sendEachFewDays = async (data, originalData) => {
        const dates = [];
        console.log(data);
        const now = new Date();
        for (let i = 0; i < data[TIMES_ARRAY].length; i++) {
            let curDate = new Date(data[TIMES_ARRAY][i]);
            for (let j = 0; j < data[REMINDERS_NUM]; j++) {
                console.log(curDate.getTime() > now.getTime());
                console.log(dateToString(curDate));
                if (curDate.getTime() > now.getTime()) {
                    dates.push(dateToString(curDate));
                }
                curDate.setDate(curDate.getDate() + 1);
            }
        }
        const requastParams = {
            'alertName': 'abc',
            "regNum": data[MEDICINE]['regNum'],
            'alertExpiration': dateToString(new Date(data[UNTIL_DATE])), 'fixedDateList': dates,
        }
        console.log(requastParams);
        const curData = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.ADD_FIXED_ALERT, requastParams);
    }

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <React.Fragment>
                    <Box sx={{flexGrow: 1}}>
                        <Grid container columnSpacing={5} rowSpacing={2}
                              sx={isMobile ? {padding: "2%", paddingLeft: "4%"} : {padding: "40px"}}>
                            <Grid item md={12} sx={{textAlign: "center"}}>
                                <Fab onClick={handleAddClick} color="primary" aria-label="add">
                                    <AddIcon/>
                                </Fab>
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
