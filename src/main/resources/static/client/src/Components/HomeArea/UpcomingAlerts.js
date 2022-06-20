import React, {useEffect, useState} from "react";
import DetailedCard from "../UI/DetailedCard/DetailedCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {getRequest} from "../../Utils/AxiosRequests";
import {getAuth} from "firebase/auth";
import {ServerConsts} from "../../Consts/apiPaths";

function UpcomingAlerts() {

    const [ alerts, setAlerts ] = useState([]);

    useEffect(async () => {
        let alertsList = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.GET_USER_ALERT_LIST);
        setAlerts(alertsList);
    }, []);

    return (
        <>
            <Typography variant="h6" component="h2" align='center' marginTop={4}>
                התראות קרובות
            </Typography>
            {alerts.length > 0 ? (alerts.map((item,index) => (
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
            ))) : (
                <Typography variant="subtitle1" component="h2" align='center'>
                     אין התראות להצגה
                </Typography>
            )}
        </>
    );

}

export default UpcomingAlerts;