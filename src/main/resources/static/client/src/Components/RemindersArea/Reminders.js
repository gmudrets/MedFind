import * as React from 'react';
import Box from '@mui/material/Box';

import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import AddIcon from '@mui/icons-material/Add';

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
import {isMobile} from "react-device-detect";
import TransitionsModal from "../UI/Modal/Modal";
import {useEffect, useReducer, useState} from "react";
import RemindersCreateForm, {
    daysWeekOptions, defualtFormData,
    EACH_MANY_DAYS, EACH_MANY_WEEKS, fakeExpiration,
    getTomorow, IN_WHICH_DATE, MEDICINE, REG_NUM, REMINDERS_NUM,
    RETURNS_TYPE,
    returnsTypeOptions, shortDaysWeekOptions,
    TIMES_ARRAY, TITLE,
    UNTIL_DATE, UNTIL_TYPE, untilTypeOptions, WEEK_DAYS_SELECTED
} from "./RemindersCreateForm";
import {useNavigate} from "react-router-dom";
import {getRequest} from "../../Utils/AxiosRequests";
import {getAuth} from "firebase/auth";
import {ServerConsts} from "../../Consts/apiPaths";
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
export const dateToString = (date, d = date.getDate(), m = date.getMonth(), y = date.getFullYear(), h = date.getHours(), min = date.getMinutes()) => {
    const days = Math.floor(d / 10) === 0 ? '0' + d : d;
    const months = Math.floor((m + 1) / 10) === 0 ? '0' + (m + 1) : (m + 1);
    const years = y;//assuming all after 10000
    const hours = Math.floor(h / 10) === 0 ? '0' + h : h;
    const minutes = Math.floor(min / 10) === 0 ? '0' + min : min;
    return days + '.' + months + '.' + years + "-" + hours + ':' + minutes;

}
export const toOnlyDateString = (s) => {
    return s.slice(0, 10);
}
export const toOnlyTimeString = (s) => {
    return s.slice(11, 16);
}
export default function Reminders() {
    const theme = createTheme({direction: 'rtl'});
    const navigate = useNavigate();
    const [RemindersList, setRemindersList] = React.useState(null);
    const [RemindersFilterdList, setRemindersFilterdList] = React.useState(null);
    const [medicineList, setMedicineList] = React.useState(null);
    const [deletedID, setDeletedID] = React.useState(null);
    const [loadingNew, setLoadingNew] = React.useState(false);
    const [editedID, setEditedID] = React.useState(null);
    const [editedFormData, setEditedFormData] = React.useState(null);
    const [onReminderCreation, setOnReminderCreation] = useState(false);
    const [keyToRerender, reRenderForm] = useReducer(x => x + 1, 0);


    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));
    useEffect(() => {
        if (currentUser === '') {
            navigate("/login");

        }

    }, [currentUser]);
    useEffect(() => {
        if (RemindersList !== null) {
            console.log(RemindersList);
            setRemindersFilterdList(filterList(RemindersList));
        }
    }, [RemindersList]);
    useEffect(() => {
        if (RemindersFilterdList !== null) {
            console.log(RemindersFilterdList);
        }
    }, [RemindersFilterdList]);
    useEffect(() => {
        console.log(onReminderCreation)
        if (!onReminderCreation) {
            setEditedID(null);
            setEditedID(null);
        }
    }, [onReminderCreation])
    // useEffect(() => {
    //     console.log(medicineList);
    // }, [medicineList]);

    useEffect(async () => {
        if (getAuth().currentUser !== null) {
            const token = await getAuth().currentUser.getIdToken(true);
            setMedicineList(await getRequest(token, ServerConsts.GET_ALL_MEDICINE));
            reRenderForm()
            const list = await getRequest(token, ServerConsts.GET_USER_ALERT_LIST);
            setRemindersList(list.reverse());

            if (RemindersList !== null) {
                setRemindersFilterdList(filterList(RemindersList));
            }
        } else {
            setTimeout(async () => {
                if (getAuth().currentUser !== null) {
                    const token = await getAuth().currentUser.getIdToken(true);
                    setMedicineList(await getRequest(token, ServerConsts.GET_ALL_MEDICINE));
                    reRenderForm();
                    const list = await getRequest(token, ServerConsts.GET_USER_ALERT_LIST);
                    setRemindersList(list.reverse());
                }
                if (RemindersList !== null) {
                    setRemindersFilterdList(filterList(RemindersList));
                }

            }, 1000)
        }
        ;

    }, []);


    const toggleOnReminderCreation = () => {
        setOnReminderCreation((prevState => !prevState));
    }

    const handleAddClick = () => {
        setOnReminderCreation(true);
    }
    const convertNotReturn = (newData) => {
        newData[RETURNS_TYPE] = returnsTypeOptions.EACH_FEW_DAYS;
        newData[EACH_MANY_DAYS] = 1;
        newData[UNTIL_TYPE] = untilTypeOptions.NUM;
        newData[REMINDERS_NUM] = 1;
        newData[UNTIL_DATE] = fakeExpiration;
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
        const id = editedID;
        console.log(id);
        toggleOnReminderCreation();
        const newList = null;
        if (editedID !== null) {
            const newList = await handleFinalDelete(id,false);
        }
        const newData = JSON.parse(JSON.stringify(originalData));
        changeEndDate(newData);
        if (originalData[RETURNS_TYPE] === returnsTypeOptions.NOT_RETURN) {
            convertNotReturn(newData);
        } else {
            newData[IN_WHICH_DATE] = fakeExpiration;
        }
        if (originalData[RETURNS_TYPE] === returnsTypeOptions.EACH_DAY) {
            convertEachDay(newData);

        }
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



    const sendEachFewWeeks = async (data, originalData) => {
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
        console.log(encodeURIComponent(JSON.stringify(originalData)));
        const requastParams = {
            'alertDescription': encodeURIComponent(JSON.stringify(originalData)),
            'alertName': data[TITLE],
            "regNum": data[REG_NUM],
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
        const now = new Date();
        if (originalData[RETURNS_TYPE] === returnsTypeOptions.NOT_RETURN) {
            const date = new Date(data[IN_WHICH_DATE]);
            dates.push(dateToString(new Date(data[TIMES_ARRAY][0]), date.getDate(), date.getMonth(), date.getFullYear()));
        } else {
            for (let i = 0; i < data[TIMES_ARRAY].length; i++) {
                let curDate = new Date(data[TIMES_ARRAY][i]);
                if (originalData[UNTIL_TYPE] === untilTypeOptions.NUM) {
                    for (let j = 0; j < data[REMINDERS_NUM]; j++) {
                        // console.log(curDate.getTime() > now.getTime());
                        // console.log(dateToString(curDate));
                        if (curDate.getTime() > now.getTime()) {
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
                            dates.push(dateToString(curDate));

                        }
                        curDate.setDate(curDate.getDate() + parseInt(data[EACH_MANY_DAYS]));
                    }

                }

            }
        }

        console.log(encodeURIComponent(JSON.stringify(originalData)));
        const requastParams = {
            'alertName': data[TITLE],
            'alertDescription': encodeURIComponent(JSON.stringify(originalData)),
            "regNum": data[REG_NUM],
            'alertExpiration': dateToString(new Date(data[UNTIL_DATE])), 'fixedDateList': dates.join("&fixedDateList=")
        }
        console.log(requastParams);
        const curData = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.ADD_FIXED_ALERT, requastParams);
    }
    const filterList = (remindersList) => {
        const filtList = [];
        for (let i = 0; i < remindersList.length - 1; i++) {
            if (remindersList[i]['alertUuid'] !== remindersList[i + 1]['alertUuid']) {
                filtList.push(remindersList[i]);
            }
        }
        if (remindersList.length !== 0) {
            filtList.push(remindersList[remindersList.length - 1]);
        }
        return filtList;
    }
    const createPropsFromItem = (data2) => {
        let result = {};

        let data = JSON.parse(decodeURIComponent(data2['alertDescription']));

        result['title'] = data[TITLE];
        let medicineName = null;
        let medicineImage = null;
        let regNum = data['regNum'];
        result["medicineName"] = data[MEDICINE];
        let info = "";
        const alertExperation = new Date(data[RemindersFields.REM_EXPERATION]);
        const alretExperationString = dateToString(alertExperation);
        if (data[RETURNS_TYPE] === returnsTypeOptions.NOT_RETURN) {
            const fixedDate = new Date(data[IN_WHICH_DATE]);
            const newDateString = dateToString(fixedDate);

            info += "בתאריך: ";
            info += toOnlyDateString(newDateString)
        }
        if (data[RETURNS_TYPE] === returnsTypeOptions.EACH_DAY) {
            info += "חוזר כל יום";
        }
        if (data[RETURNS_TYPE] === returnsTypeOptions.EACH_FEW_DAYS) {
            info += "חוזר כל ";
            info += data[EACH_MANY_DAYS];
            info += " ימים"

        }
        if (data[RETURNS_TYPE] === returnsTypeOptions.EACH_WEEK) {
            info += "חוזר כל שבוע"
            info += "\n"
            info += 'בימים: '
        }
        if (data[RETURNS_TYPE] === returnsTypeOptions.EACH_FEW_WEEKS) {
            info += "חוזר כל "
            info += data[EACH_MANY_WEEKS];
            info += " שבועות"
            info += "\n"
            info += "בימים: "
        }
        if (data[RETURNS_TYPE] === returnsTypeOptions.EACH_FEW_WEEKS || data[RETURNS_TYPE] === returnsTypeOptions.EACH_WEEK) {

            let shorWeek = [];
            for (let i = 0; i < data[WEEK_DAYS_SELECTED].length; i++) {
                shorWeek.push(shortDaysWeekOptions[daysWeekOptions.indexOf(data[WEEK_DAYS_SELECTED][i])]);
            }
            shorWeek.sort();
            for (let i = 0; i < shorWeek.length; i++) {
                info += shorWeek[i] + ", "
            }
            info = info.slice(0, info.length - 2);
        }
        info += "\n"
        info += "בשעות: "
        for (let i = 0; i < data[TIMES_ARRAY].length; i++) {
            const time = new Date(data[TIMES_ARRAY][i])
            const timeStr = dateToString(time)
            info += toOnlyTimeString(timeStr) + " ,";
        }
        info = info.slice(0, info.length - 2);
        if (data[RETURNS_TYPE] !== returnsTypeOptions.NOT_RETURN) {
            info += "\n"
            info += "חזור עד "
            if (data[UNTIL_TYPE] === untilTypeOptions.DATE) {
                info += "התאריך "
                const exdate = toOnlyDateString(dateToString(new Date(data[UNTIL_DATE])))
                info += exdate
            } else if (data[UNTIL_TYPE] === untilTypeOptions.NUM) {
                info += data[REMINDERS_NUM];
                info += " תזכורת "
            }
        }
        result['infoStr'] = info;
        result['uuid'] = data2[RemindersFields.REM_UUID];
        result['formData'] = data;
        result['handleDelete'] = handleDelete;
        result['handleEdit'] = handleEdit;
        return result;

    }

    const handleDelete = (id) => {
        setDeletedID(id);
    }
    const handleDeleteDialogFinished = (event) => {
        setDeletedID(null);
    }
    const handleFinalDelete = async (uuid, deleteFromList = true) => {
        if(!uuid){
            uuid = deletedID;
        }
        setLoadingNew(true);
        const newRem = [];
        setDeletedID(null);
        for (let i = 0; i < RemindersList.length; i++) {

            if (RemindersList[i][RemindersFields.REM_UUID] !== uuid) {
                newRem.push(RemindersList[i]);
            }
        }
        await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.DELETE_ALRET_BY_UID, {"uuid": uuid});
        if(deleteFromList){
            setRemindersList(newRem);
        }else{
            return newRem;
        }
    }

    const handleEdit = (id, formData) => {
        setEditedID(id);
        setEditedFormData(formData);
        setOnReminderCreation(true);
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
                                    <Typography component="h1" variant="h6" marginBottom={'5px'} textAlign={'center'}>
                                        טוען שינויים....
                                    </Typography>
                                </Grid>}
                            {RemindersFilterdList !== null && RemindersFilterdList.length !== 0 && RemindersFilterdList.map((item) => (
                                <Grid item md={3} key={item[RemindersFields.REM_ID]}>
                                    <ReminderCard  {...createPropsFromItem(item)}/>
                                </Grid>
                            ))}
                            {RemindersFilterdList === null && <Grid item xs={12} sx={{textAlign: "left"}}>
                                <Typography component="h1" variant="h6" marginBottom={'5px'} textAlign={'center'}>טוען
                                    תזכורת....
                                </Typography>
                            </Grid>
                            }


                        </Grid>
                    </Box>

                    <TransitionsModal open={onReminderCreation} toggleModal={toggleOnReminderCreation}>
                        <RemindersCreateForm handleSubmit={handleSubmit} medicineList={medicineList}
                                             formData={editedID !== null ? editedFormData : defualtFormData()}
                                             key={"abd" + keyToRerender}/>
                    </TransitionsModal>
                    <Dialog
                        open={deletedID != null}
                        onClose={handleDeleteDialogFinished}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"האם אתה בטוח שברצונך למחוק את התזכורת?"}
                        </DialogTitle>

                        <DialogActions>
                            <Button onClick={handleDeleteDialogFinished}>בטל מחיקה</Button>
                            <Button onClick={() => handleFinalDelete(deletedID).then(setLoadingNew((false)))} autoFocus>
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
