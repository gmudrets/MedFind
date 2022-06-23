import React, {useEffect, useState} from "react";
import DetailedCard from "../UI/DetailedCard/DetailedCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {getRequest} from "../../Utils/AxiosRequests";
import {getAuth} from "firebase/auth";
import {ServerConsts} from "../../Consts/apiPaths";
import {
    DAY_IN_WEEK,
    FIXED,
    FIXED_DATE,
    HOUR,
    MINUTE,
    REM_DES,
    REM_EXPERATION, REM_TITLE,
    REM_TYPE
} from "../../Consts/RemindersFields";
import {MEDICINE} from "../RemindersArea/RemindersCreateForm";
import {dateToString, toOnlyDateString, toOnlyTimeString} from "../RemindersArea/Reminders";
import SingleReminderCard from "./SingleReminderCard";


function UpcomingAlerts() {
    useEffect(async () => {
        if (getAuth().currentUser !== null) {
            const token = await getAuth().currentUser.getIdToken(true);
            const list = await getRequest(token, ServerConsts.GET_USER_ALERT_LIST);
            setAlerts(findClosestAlerts(list));


        } else {
            setTimeout(async () => {
                if (getAuth().currentUser !== null) {
                    const token = await getAuth().currentUser.getIdToken(true);
                    const list = await getRequest(token, ServerConsts.GET_USER_ALERT_LIST);
                    setAlerts(findClosestAlerts(list));
                }
            }, 1000)
        }
        ;
    }, []);

    const createPropsFromRem = (data)=>{
        console.log(data);
        let result = {};
        result['title'] = data[REM_TITLE];
        result["medicineName"] = data[REM_DES][MEDICINE];
        const time = data[REM_TYPE] === FIXED?new Date(alert[FIXED_DATE]):getDateFromScheduald(data);
        let info = "";
        const newDateString = dateToString(time);
        info += "תאריך: ";
        info += toOnlyDateString(newDateString)
        info += "\n"
        info += "שעה: "
        info += toOnlyTimeString(newDateString);
        result['info'] = info;
        return result;
    }
    const getDateFromScheduald = (al) => {
        let alertDate = new Date();
        alertDate.setHours(al[HOUR]);
        alertDate.setMinutes(al[MINUTE]);
        for (let i = 0; i < 7; i++) {
            if (alertDate.getTime() < new Date(al[REM_EXPERATION]).getTime()) {
                return null;
            }
            if (alertDate.getDay() + 1 === al[DAY_IN_WEEK]) {
                return alertDate;
            }
            alertDate.setDate(alertDate.getDate() + 1);
        }
        return null;
    }
    const [alerts, setAlerts] = useState(null);
    const showAlertNum = 5;
    const findClosestAlerts = (alerts) => {
        if (alerts === null) {
            return null;
        }
        const arr = [];
        for (let i = 0; i < alerts.length; i++) {
            if (alerts[i][REM_TYPE] === FIXED) {
                const timeDiff = new Date(alerts[i][FIXED_DATE]).getTime() - new Date().getTime();
                const inner = [timeDiff, alerts[i]];
                arr.push(inner);
            } else {
                const date = getDateFromScheduald((alerts[i]));
                if (date !== null) {
                    const timeDiff = date.getTime() - new Date().getTime();
                    const inner = [timeDiff, alerts[i]];
                    arr.push(inner);
                }
            }
        }
        arr.sort((a,b)=>a[0]-b[0]);
        const res = []
        for (let i = 0; i < showAlertNum && i< arr.length; i++) {
            res.push(arr[i][1]);
        }
        return res;
    }

    useEffect( () => {
        console.log(alerts);
    },[alerts]);



    return (
        <>
            <Typography variant="h6" component="h2" align='center' marginTop={4}>
                התראות קרובות
            </Typography>
            {alerts !== null && alerts.length > 0 && (alerts.map((item, index) => (
                <Box
                    key={index}
                    marginTop='65px'
                    marginBottom='45px'
                    display='flex'
                    flexDirection='column'
                    justifyContent="center"
                    alignItems='center'
                >
                    <SingleReminderCard {...createPropsFromRem(item)}/>
                </Box>
            )))}
            {alerts === null &&
                <Typography variant="subtitle1" component="h2" align='center' key={alerts === null ? "0" : "1"}>
                    טוען התראות...
                </Typography>
            }
            {alerts !== null && alerts.length === 0 &&
                <Typography variant="subtitle1" component="h2" align='center'>
                    אין התראות להצגה
                </Typography>
            }
        </>
    );

}

export default UpcomingAlerts;