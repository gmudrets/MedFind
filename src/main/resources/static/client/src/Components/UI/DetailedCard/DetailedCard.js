import * as React from 'react';
import {createTheme, styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddCardIcon from '@mui/icons-material/AddCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {getRequest} from "../../../Utils/AxiosRequests";
import {External, ServerConsts} from "../../../Consts/apiPaths";
import ArticleIcon from "@mui/icons-material/Article";
import LoadingButton from "@mui/lab/LoadingButton";
import {useState} from "react";
import {TableCell} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import {ThemeProvider} from "@emotion/react";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function DetailedCard(props) {
    const {
        type,
        title,
        subheader,
        image,
        body,
        expandData,
    } = props;
    const theme = createTheme({direction: 'rtl'});

    const [ expanded, setExpanded ] = useState(false);
    const [ brochureLoading, setBrochureLoading ] = useState(false);

    const nameMapping = {
        "activeComponents" : "חומרים פעילים",
        "barcodes" : "ברקוד",
        "customerPrice" : "מחיר לצרכן",
        "dosageForm" : "צורת צריכה",
        "dragEnName" : "שם באנגלית",
        "dragHebName" : "שם בעברית",
        "health" : "בסל הבריאות",
        "images" : "תמונות",
        "prescription" : "צריך מרשם",
        "secondarySymptom" : "השפעות",
        "brochure" : "עלון לצרכן",
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const getValue = (data) => {
        if(data === "null") {
            return ""
        }
        else if(data === true) {
            return "כן";
        }
        else if(data === false) {
            return "לא";
        }

        return data;
    }

    const getBrochure = async (drugRegNum) => {
        setBrochureLoading(true);
        let data = await getRequest(ServerConsts.GET_BROCHURE, { "drugRegNum" : drugRegNum});
        let url = External.EXTERNAL_FILES_URL + data["consumerBrochure"];

        const link = document.createElement("a");
        link.download = data["consumerBrochure"];
        link.href = url;
        link.click();
        setBrochureLoading(false);
    }

    return (
        <ThemeProvider theme={theme}>
            <Card sx={{ maxWidth: 600, width: '90%', marginBottom: 2 }}>
                <CardHeader
                    title={title}
                    subheader={subheader}
                />
                <CardMedia
                    component="img"
                    height="300"
                    image={image}
                    alt="N/A"
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {getValue(body)}
                    </Typography>
                </CardContent>
                {type === 'drug' && (
                    <>
                        <CardActions disableSpacing>
                            <IconButton aria-label="add to my medicine">
                                <AddCardIcon />
                            </IconButton>
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography paragraph>פרטים נוספים:</Typography>
                                <Typography paragraph>
                                    <Table size="small" style={{marginBottom:15}}>
                                        <TableRow>
                                            <TableCell variant="head" align="right">{nameMapping["activeComponents"]}</TableCell>
                                            <TableCell align="right">{expandData.activeComponents}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head" align="right">{nameMapping["customerPrice"]}</TableCell>
                                            <TableCell align="right">{expandData.customerPrice} &#8362;</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head" align="right">{nameMapping["dosageForm"]}</TableCell>
                                            <TableCell align="right">{getValue(expandData.dosageForm)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head" align="right">{nameMapping["health"]}</TableCell>
                                            <TableCell align="right">{getValue(expandData.health)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head" align="right">{nameMapping["prescription"]}</TableCell>
                                            <TableCell align="right">{getValue(expandData.prescription)}</TableCell>
                                        </TableRow>
                                    </Table>
                                    <LoadingButton
                                        variant="contained"
                                        size="small"
                                        endIcon={<ArticleIcon style={{marginRight: 12}}/>}
                                        onClick={() => {getBrochure(expandData.brochure);}}
                                        loading={brochureLoading}
                                        loadingPosition="end"
                                    >
                                        עלון לצרכן
                                    </LoadingButton>
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </>
                )}
            </Card>
        </ThemeProvider>
    );
}
