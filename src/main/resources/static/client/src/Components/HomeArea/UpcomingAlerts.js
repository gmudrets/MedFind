import React, {useEffect, useState} from "react";
import DetailedCard from "../UI/DetailedCard/DetailedCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function UpcomingAlerts() {

    const [ alerts, setAlerts ] = useState([]);

    let cards = []
    cards.push({"title":"אקמול", "subheader":"פעמיים ביום למשך 5 ימים", "body":"נטילה קרובה: היום בשעה 16:00"});
    cards.push({"title":"מוקסיפן", "subheader":"שלוש פעמים ביום למשך 7 ימים", "body":"נטילה קרובה: היום בשעה 19:00"});

    useEffect(() => {
        setAlerts(cards)
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
                    אין התראות
                </Typography>
            )}
        </>
    );

}

export default UpcomingAlerts;