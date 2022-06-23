import * as React from 'react';
import {createTheme, styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';

import {ThemeProvider} from "@emotion/react";

import DeleteIcon from '@mui/icons-material/Delete';


import Typography from "@mui/material/Typography";
import {useEffect} from "react";


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
                {/*<CardMedia*/}
                {/*    component="img"*/}
                {/*    height="300"*/}
                {/*    image={image}*/}
                {/*    alt="N/A"*/}
                {/*/>*/}

                <CardContent sx={{display: 'flex', flexDirection: 'row', justifyContent: "space-between"}}>
                    <Typography variant="body2" color="text.secondary" style={{whiteSpace: 'pre-line'}}>
                        {info}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="deleteReminder">
                        <DeleteIcon/>
                    </IconButton>

                </CardActions>

            </Card>
        </ThemeProvider>
    )
        ;
}
