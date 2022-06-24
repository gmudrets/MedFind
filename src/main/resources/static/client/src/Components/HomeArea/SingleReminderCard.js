import * as React from 'react';
import {useEffect} from 'react';
import {createTheme} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import {ThemeProvider} from "@emotion/react";


import Typography from "@mui/material/Typography";


export default function SingleReminderCard(props) {
    const {
        image,
        medicineName,
        title,
        info,

    } = props;
    const theme = createTheme({direction: 'rtl'});
    useEffect(() => {
    }, []);

    const getValue = (data) => {
        if (data === "null") {
            return ""
        } else if (data === true) {
            return "כן";
        } else if (data === false) {
            return "לא";
        }

        return data;
    }



    return (
        <ThemeProvider theme={theme}>
            <Card sx={{maxWidth: 300, width: '90%', marginBottom: 2, minWidth:200}}>
                <CardHeader
                    title={title===""?medicineName: title}
                    subheader={title===""?"":medicineName}
                />

                <CardContent sx={{display: 'flex', flexDirection: 'row', justifyContent: "space-between"}}>
                    <Typography variant="body2" color="text.secondary" style={{whiteSpace: 'pre-line'}}>
                        {info}
                    </Typography>
                </CardContent>


            </Card>
        </ThemeProvider>
    );
}
