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

function SharedMedicine() {

    const navigate = useNavigate();
    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
    const isDoctor = true; //TODO: implement
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!isDoctor){
            navigate("/");
        }
    });

    useEffect(() => {
        getShareData();
    });

    const nameMapping = {
        "drugName" : "שם התרופה",
        "dosage" : "מינון",
        "amountAvailable" : "כמות זמינה",
        "dosageForm" : "צורת צריכה",
        "expirationDate" : "בתוקף עד",
        "amount" : "כמות",
        "userDetails" : "פרטי משתמש",
    };

    function createData(name, dosage, totalAvailable) {
        return {
            name,
            dosage,
            totalAvailable,
            sharingDetails: [
                {
                    expDate: '2023-11-31',
                    amount: 37,
                    customerId: '11091700',
                },
                {
                    expDate: '2022-09-23',
                    amount: 132,
                    customerId: 'Anonymous',
                },
            ],
        };
    }



    const getShareData = async () => {
        let data = await getRequest(currentUser.stsTokenManager.accessToken,
            ServerConsts.GET_SHARED_MEDICINE);

        setRows(data);
        console.log(data);
    }

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow  sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.dosage}</TableCell>
                    <TableCell align="right">{row.totalAvailable}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography align="right" variant="h6" gutterBottom component="div">
                                    רשימת שיתוף
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="right">{nameMapping.expirationDate}</TableCell>
                                            <TableCell align="right">{nameMapping.amount}</TableCell>
                                            <TableCell align="right">{nameMapping.userDetails}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.sharingDetails.map((detailsRow) => (
                                            <TableRow key={detailsRow.expDate}>
                                                <TableCell align="right" component="th" scope="row">
                                                    {detailsRow.expDate}
                                                </TableCell>
                                                <TableCell align="right">{detailsRow.amount}</TableCell>
                                                <TableCell align="right">{detailsRow.customerId}</TableCell>
                                            </TableRow>
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
            totalAvailable: PropTypes.number.isRequired,
            sharingDetails: PropTypes.arrayOf(
                PropTypes.shape({
                    expDate: PropTypes.string.isRequired,
                    amount: PropTypes.number.isRequired,
                    customerId: PropTypes.string.isRequired,
                }),
            ).isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired,
    };

    // const rows = [
    //     createData('מוקסיפן', 250, 159),
    //     createData('נוסידקס', 50, 237),
    //     createData('לוסק', 50, 262),
    //     createData('אקמול פורטה', 100, 305),
    //     createData('אוגמנטין', 875, 356),
    // ];


    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align="right">{nameMapping.drugName}</TableCell>
                        <TableCell align="right">{nameMapping.dosage}&nbsp;(mg)</TableCell>
                        <TableCell align="right">{nameMapping.amountAvailable}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.name} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default SharedMedicine;