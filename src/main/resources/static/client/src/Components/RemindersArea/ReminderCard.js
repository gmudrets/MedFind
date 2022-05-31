import * as React from 'react';
import {createTheme, styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import {TableCell} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import {ThemeProvider} from "@emotion/react";
import noPrescription from '../../../Assets/Images/no_perscription_logo.png';
import needPrescription from '../../../Assets/Images/perscription_only_logo.png';
import Link from "@mui/material/Link";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useSelector} from "react-redux";
import {getSafe} from "../../../Utils/Utils";
import * as STATE_PATHS from "../../../Consts/StatePaths";
import {auth} from "../../../Configs/FirebaseConfig"
import {MEDICINE, TITLE} from "./RemindersCreateForm";



export default function DetailedCard(props) {
    const {
        medicineName,
        title,
        image,
        relevantData,
        uuid
    } = props;
    const theme = createTheme({direction: 'rtl'});


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

    const userDetails = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));


    return (
        <ThemeProvider theme={theme}>
            <Card sx={{maxWidth: 600, width: '90%', marginBottom: 2}}>
                <CardHeader
                    title={medicineName}
                    subheader={title}
                />
                {/*TODO later*/}
                {/*<CardMedia*/}
                {/*    component="img"*/}
                {/*    height="300"*/}
                {/*    image={image}*/}
                {/*    alt="N/A"*/}
                {/*/>*/}

                <>
                <CardContent>

                    <Table size="small" style={{marginBottom: 15}}>
                        {Object.entries(relevantData).map(([key, val]) => (
                            <TableRow>
                                <TableCell variant="head"
                                           align="right">key</TableCell>
                                <TableCell align="right">val</TableCell>
                            </TableRow>
                        ))}
                    </Table>

                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="editMedicine">
                        <ModeEditIcon/>
                    </IconButton>
                    <IconButton aria-label="add to my medicine">
                        <DeleteIcon/>
                    </IconButton>

                </CardActions>
            </>
            )}
        </Card>
</ThemeProvider>
)
    ;
}
