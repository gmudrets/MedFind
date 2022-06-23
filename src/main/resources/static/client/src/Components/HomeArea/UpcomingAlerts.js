import React, {useEffect, useState} from "react";
import DetailedCard from "../UI/DetailedCard/DetailedCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {getRequest} from "../../Utils/AxiosRequests";
import {getAuth} from "firebase/auth";
import {ServerConsts} from "../../Consts/apiPaths";
import {FIXED, FIXED_DATE, REM_TYPE} from "../../Consts/RemindersFields";


function UpcomingAlerts() {

    const [alerts, setAlerts] = useState(null);
    const showAlertNum = 5;
    const findClosestAlerts = (alerts) => {
        if (alerts !== null) {
            const arr = [];
            for (let i = 0; i < alerts.length; i++) {
                if (alerts[i][REM_TYPE] === FIXED) {
                    const timeDiff = new Date(alerts[i][FIXED_DATE]).getTime() - new Date().getTime();
                    const inner = [timeDiff, alerts[i]];
                    arr.push(inner);
                }
            }
        } else {
            return null;
        }

    }
    useEffect(async () => {
        if (getAuth().currentUser !== null) {
            const token = await getAuth().currentUser.getIdToken(true);
            const list = await getRequest(token, ServerConsts.GET_USER_ALERT_LIST);
            setAlerts(list);


        } else {
            setTimeout(async () => {
                if (getAuth().currentUser !== null) {
                    const token = await getAuth().currentUser.getIdToken(true);
                    const list = await getRequest(token, ServerConsts.GET_USER_ALERT_LIST);
                    setAlerts(list);
                }
            }, 1000)
        }
        ;
    }, []);

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
                    <DetailedCard type={"alert"} title={item.title} subheader={item.subheader} body={item.body}/>
                </Box>
            )))}
            {alerts === null &&
                <Typography variant="subtitle1" component="h2" align='center' key={alerts === null ? "0" : "1"}>
                    טוען התראות...
                </Typography>
            }
            {alerts.length === 0 &&
                <Typography variant="subtitle1" component="h2" align='center'>
                    אין התראות להצגה
                </Typography>
            }
        </>
    );

}

export default UpcomingAlerts;