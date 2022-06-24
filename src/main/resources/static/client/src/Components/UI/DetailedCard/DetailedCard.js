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
import ShareIcon from '@mui/icons-material/Share';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LoadingButton from "@mui/lab/LoadingButton";
import {useState} from "react";
import {Alert, Snackbar, Stack, TableCell} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import {CacheProvider, ThemeProvider} from "@emotion/react";
import noPrescription from '../../../Assets/Images/no_perscription_logo.png';
import needPrescription from '../../../Assets/Images/perscription_only_logo.png';
import Link from "@mui/material/Link";
import {auth} from "../../../Configs/FirebaseConfig"
import * as Utils from "../../../Utils/Utils";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import {red} from "@mui/material/colors";
import {useSelector} from "react-redux";
import {getSafe} from "../../../Utils/Utils";
import * as STATE_PATHS from "../../../Consts/StatePaths";
import {DesktopDatePicker, LocalizationProvider} from "@mui/lab";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TransitionsModal from "../Modal/Modal";

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'whitesmoke',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginLeft: '16px',
}));

export default function DetailedCard(props) {
    const {
        type,
        title,
        subheader,
        image,
        body,
        expandData,
        prescription,
        setGenericSearchValue,
        triggerSearch,
        handleAddClick,
        handleDeleteClick,
        handleShareClick,
        handleAlertClick,
    } = props;
    const theme = createTheme({
        direction: 'rtl',
        palette: {
            secondary: red,
        },});

    const profile = useSelector((state) => getSafe(STATE_PATHS.USER_PROFILE, state));
    const [ expanded, setExpanded ] = useState(false);
    const [ brochureLoading, setBrochureLoading ] = useState(false);
    const [ docBrochureLoading, setDocBrochureLoading ] = useState(false);
    const [ showBrochureError, setShowBrochureError ] = useState(false);
    const [ showDocBrochureError, setShowDocBrochureError ] = useState(false);
    const [ showUpdateCountDialog, setShowUpdateCountDialog ] = useState(false);
    const [ showUpdateMessage, setShowUpdateMessage ] = useState(false);
    const [ countUpdateItem, setCountUpdateItem ] = useState(null);
    const [ newAmount, setNewAmount ] = useState(expandData.count);
    const DOCTOR = 'רופא';
    const MEDICAL_STAFF = 'צוות רפואי';
    const isMedStaff = profile.userType===DOCTOR || profile.userType===MEDICAL_STAFF;

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

    const getBrochure = async (payload, doctor) => {
        doctor ? setDocBrochureLoading(true) : setBrochureLoading(true);
        let url;
        let data = null;
        let download;
        if (type === 'drug'){
            data = await getRequest(
                await auth.currentUser.getIdToken(true),
                ServerConsts.GET_BROCHURE,
                { "drugRegNum" : payload});
            if (!doctor) {
                url = data["consumerBrochure"] ? External.EXTERNAL_FILES_URL + data["consumerBrochure"] : null;
                download = data["consumerBrochure"] ? data["consumerBrochure"] : null;
            }
            else {
                url = data["doctorBrochure"] ? External.EXTERNAL_FILES_URL + data["doctorBrochure"] : null;
                download = data["doctorBrochure"] ? data["doctorBrochure"] : null;
            }
        }
        else {
            url = payload;
            download = payload !== 'null' ? payload : null;
        }
        if (url && url !== 'null'){
            const link = document.createElement("a");
            link.download = download;
            link.href = url;
            link.target="_blank";
            link.click();
        }
        else{
            doctor ? setShowDocBrochureError(true) : setShowBrochureError(true);
        }
        doctor ? setDocBrochureLoading(false) : setBrochureLoading(false);
    }

    const handleUpdateAmount = (item) => {
        setShowUpdateCountDialog(true);
        setCountUpdateItem(item);
    }

    const updateMedicineAmount = async () => {
        let data = await getRequest(
            await auth.currentUser.getIdToken(true),
            ServerConsts.UPDATE_MEDICINE_COUNT,
            { id : countUpdateItem.id, count : newAmount});
    }

    const handleUnitsAmount = (newAmount) => {
        setNewAmount(newAmount.target.value);
    }

    const toggleUpdateCountDialog = () => {
      setShowUpdateCountDialog(!showUpdateCountDialog);
    }

    return (
        <ThemeProvider theme={theme}>
            <TransitionsModal open={showUpdateCountDialog} toggleModal={toggleUpdateCountDialog}>
                <Typography sx={{ mt: 2 }} align={"center"} marginBottom={'20px'}>
                    עדכון כמות יחידות לתרופה
                </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={3}>
                            <TextField
                                required
                                id="outlined-number"
                                label="כמות חדשה"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={newAmount}
                                onChange={handleUnitsAmount}
                                InputProps={{
                                    inputProps: { min: 1 }
                                }}
                            />
                        </Stack>
                        <Box
                            marginTop='20px'
                            display='flex'
                            flexDirection='row'
                            justifyContent="center"
                            alignItems='center'
                        >
                            <Button onClick={() => {
                                setShowUpdateCountDialog(false);
                                updateMedicineAmount();
                            } } autoFocus>
                                אישור
                            </Button>
                        </Box>
                    </LocalizationProvider>
            </TransitionsModal>
            <Snackbar open={showUpdateMessage}
                      autoHideDuration={1500}
                      onClose={() => {
                          setShowUpdateMessage(false);
                      }}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity="success">
                    הכמות עודכנה
                </Alert>
            </Snackbar>
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
                    {(type === 'drug' || type ==='myDrug') && (
                        prescription ?
                            <img src={needPrescription} className="prescription-logo" alt="logo" width="30%" height="30%" /> :
                            <img src={noPrescription} className="prescription-logo" alt="logo" width="60" height="60" />

                    )}
                </CardContent>
                {type === 'drug' && (
                    <>
                        <CardActions disableSpacing>
                            <IconButton aria-label="add to my medicine" onClick={handleAddClick}>
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
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => {
                                    setGenericSearchValue({activeIngredient: expandData.activeComponentsCompareName, hebName: title});
                                    triggerSearch(true);
                                }}
                            >
                                חפש תכשירים עם חומר פעיל זהה
                            </Link>
                        </CardActions>
                    </>)}
                {type === 'myDrug' && (
                    <>
                        <CardActions disableSpacing>
                            <IconButton aria-label="delete medicine" onClick={handleDeleteClick}>
                                <DeleteIcon />
                            </IconButton>
                            {expandData.shared ?
                                <ThemeProvider theme={theme}>
                                    <IconButton aria-label="share medicine" color='secondary' onClick={handleShareClick}>
                                        <ShareOutlinedIcon />
                                    </IconButton>
                                </ThemeProvider>:
                                <IconButton aria-label="share medicine" onClick={handleShareClick}>
                                    <ShareIcon />
                                </IconButton>
                            }
                            <IconButton aria-label="set alert" onClick={handleAlertClick}>
                                <NotificationsActiveIcon />
                            </IconButton>
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                            <CssBaseline>
                            <Stack direction="row" >
                                <Item>{"תאריך תפוגה: " + Utils.formatDate(expandData.expiration)}</Item>
                                <Item style={{ cursor: 'pointer' }} onClick={() => handleUpdateAmount(expandData)}>{"כמות זמינה: " + newAmount}</Item>
                            </Stack>
                            </CssBaseline>
                        </CardActions>
                    </>

                )}
                {(type === 'drug' || type ==='myDrug') && (
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>פרטים נוספים:</Typography>
                            <Typography paragraph>
                                <Table size="small" style={{marginBottom:15}}>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{nameMapping["activeComponents"]}</TableCell>
                                        <TableCell align="right">{expandData.activeComponents}</TableCell>
                                    </TableRow>
                                    {type === 'drug' && (
                                        <TableRow>
                                            <TableCell variant="head" align="right">{nameMapping["customerPrice"]}</TableCell>
                                            <TableCell align="right">{expandData.customerPrice} &#8362;</TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell variant="head" align="right">{nameMapping["dosageForm"]}</TableCell>
                                        <TableCell align="right">
                                            {
                                                type === 'drug' ?
                                                getValue(expandData.dosageForm) :
                                                    (expandData.unitType === 'null' ? '' : expandData.unitType)
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{nameMapping["health"]}</TableCell>
                                        <TableCell align="right">
                                            {
                                                type === 'drug' ?
                                                getValue(expandData.health) :
                                                    getValue(expandData.healthBasket)
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{nameMapping["prescription"]}</TableCell>
                                        <TableCell align="right">{getValue(expandData.prescription)}</TableCell>
                                    </TableRow>
                                </Table>
                                {showBrochureError ? (<p style={{color: 'red'}}>לא קיים עלון לצרכן במאגר משרד הבריאות</p>) :
                                    <LoadingButton
                                        variant="contained"
                                        size="small"
                                        endIcon={<ArticleIcon style={{marginRight: 12}}/>}
                                        onClick={() => {
                                            type === 'drug' ?
                                                getBrochure(expandData.brochure, false):
                                                getBrochure(expandData.brochureUrl, false)
                                            ;}}
                                        loading={brochureLoading}
                                        loadingPosition="end"
                                    >
                                        עלון לצרכן
                                    </LoadingButton>
                                }
                                {isMedStaff && (showDocBrochureError ? (<p style={{color: 'red'}}>לא קיים עלון לרופא במאגר משרד הבריאות</p>) :
                                    <LoadingButton
                                        style={{marginRight: 12}}
                                        variant="contained"
                                        size="small"
                                        endIcon={<ArticleIcon style={{marginRight: 12}}/>}
                                        onClick={() => {
                                            type === 'drug' ?
                                                getBrochure(expandData.brochure, true):
                                                getBrochure(expandData.docBrochureUrl, true)
                                            ;}}
                                        loading={docBrochureLoading}
                                        loadingPosition="end"
                                    >
                                        עלון לרופא
                                    </LoadingButton>
                                )}
                            </Typography>
                        </CardContent>
                    </Collapse>
                )}
            </Card>
        </ThemeProvider>
    );
}
