import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import * as STATE_PATHS from "../../Consts/StatePaths";
import {getRequest} from "../../Utils/AxiosRequests";
import {ServerConsts} from "../../Consts/apiPaths";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import CircularProgressBackdrop from "../UI/CircularProgressBackdrop/CircularProgressBackdrop";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {red} from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import {Alert, Snackbar} from "@mui/material";
import AlertDialog from "../UI/Dialog";
import * as Utils from "../../Utils/Utils";

function MySharing() {

    const navigate = useNavigate();
    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));
    const [ updateTable, setUpdateTable ] = useState(true);
    const [rows, setRows] = useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [showUnshareMessage, setShowUnshareMessage] = useState(false);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (currentUser === ''){
            navigate("/login");
        }
    }, [currentUser]);

    useEffect(() => {
        if(updateTable){
            getShareData();
        }
    }, [updateTable]);

    const nameMapping = {
        "drugName" : "שם התרופה",
        "dosage" : "מינון",
        "amountAvailable" : "כמות זמינה",
        "dosageForm" : "צורת צריכה",
        "expirationDate" : "בתוקף עד",
        "amount" : "כמות",
        "share" : "ביטול שיתוף",
    };

    const theme = createTheme({
        palette: {
            secondary: red,
        },
    });

    const getShareData = async () => {
        setLoading(true);
        let data = await getRequest(currentUser.stsTokenManager.accessToken,
            ServerConsts.GET_USER_SHARED_MEDICINE);

        let result = data.reduce((r, { hebName: name, dosage: dosage, regNum: regNum, unitType: unitType, ...object }) => {
            let temp = r.find(o => o.regNum === regNum);
            if (!temp) r.push(temp = { hebName: name, dosage: dosage, unitType: unitType, regNum: regNum, sharingDetails: [] });
            temp.sharingDetails.push(object);
            return r;
        }, []);
        setRows(result);
        setUpdateTable(false);
        setLoading(false);
    }

    const calculateTotalAvailable = (row) => {
        let count = 0;
        row.sharingDetails.forEach((item) => {
            count += item.count;
        });
        return count;
    }

    const unshareMedicine = async (id) => {
        await getRequest(currentUser.stsTokenManager.accessToken,
            ServerConsts.UPDATE_MEDICINE_SHARING, {
                id: id,
                shared: false
            });
        setShowUnshareMessage(true);
    };

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow  sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell style={{ width: '50px' }}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                        {row.hebName}
                    </TableCell>
                    <TableCell align="right">{row.dosage}{Utils.dosageUnits(row.unitType)}</TableCell>
                    <TableCell align="right">{calculateTotalAvailable(row)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto">
                            <Box sx={{ margin: 1 }}>
                                <Table size="small" aria-label="shared-meds"  style={{backgroundColor:'whitesmoke'}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="right">{nameMapping.expirationDate}</TableCell>
                                            <TableCell align="right">{nameMapping.amount}</TableCell>
                                            <TableCell align="right">{nameMapping.share}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.sharingDetails.map((detailsRow,index) => (
                                            <>
                                                <AlertDialog open={openDialog}
                                                             setOpen={setOpenDialog}
                                                             title="ביטול שיתוף תרופה"
                                                             textContent="האם לבטל את שיתוף התרופה?"
                                                             acceptButtonText="אישור"
                                                             declineButtonText="חזור"
                                                             onAccept={() => {unshareMedicine(detailsRow.id)}}
                                                />
                                                <TableRow key={index}>
                                                    <TableCell align="right" component="th" scope="row">
                                                        {Utils.formatDate(detailsRow.expiration)}
                                                    </TableCell>
                                                    <TableCell align="right">{detailsRow.count}</TableCell>
                                                    <TableCell align="right">
                                                        <ThemeProvider theme={theme}>
                                                            <IconButton aria-label="deny" color="secondary" onClick={() => {setOpenDialog(true)}}>
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </ThemeProvider>
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    Row.propTypes = {
        row: PropTypes.shape({
            dosage: PropTypes.number.isRequired,
            unitType: PropTypes.string.isRequired,
            sharingDetails: PropTypes.arrayOf(
                PropTypes.shape({
                    count: PropTypes.number.isRequired,
                    engName: PropTypes.string.isRequired,
                    expiration: PropTypes.string.isRequired,
                    uuid: PropTypes.string.isRequired,
                }),
            ).isRequired,
            hebName: PropTypes.string.isRequired,
            regNum: PropTypes.string.isRequired,
        }).isRequired,
    };

    return (
        <>
            <CircularProgressBackdrop open={loading} toggle={setLoading}/>
            <Typography align="center" variant="h6" gutterBottom component="div">
                התרופות המשותפות שלי
            </Typography>
            <Snackbar open={showUnshareMessage}
                      autoHideDuration={1500}
                      onClose={() => {
                          setShowUnshareMessage(false);
                          setUpdateTable(true);
                      }}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity="success">
                    שיתוף התרופה בוטל
                </Alert>
            </Snackbar>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="right">{nameMapping.drugName}</TableCell>
                            <TableCell align="right">{nameMapping.dosage}</TableCell>
                            <TableCell align="right">{nameMapping.amountAvailable}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <Row key={index} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default MySharing;