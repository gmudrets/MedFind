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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Configs/FirebaseConfig";
import {ServerConsts} from "../../Consts/apiPaths";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ContactPageIcon from '@mui/icons-material/ContactPage';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LoadingButton from "@mui/lab/LoadingButton";
import moment from "moment";
import TransitionsModal from "../UI/Modal/Modal";

function SharedMedicine() {

    const navigate = useNavigate();
    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
    const isDoctor = true; //TODO: implement
    const [rows, setRows] = useState([]);
    const [contactDetailsLoading, setContactDetailsLoading] = useState(false);
    const [showContactDetails, setShowContactDetails] = useState(false);
    const [contactDetails, setContactDetails] = useState({});

    useEffect(() => {
        if (!isDoctor){
            navigate("/");
        }
    });

    useEffect(() => {
        if(rows.length===0){
            getShareData();
        }
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

    const getShareData = async () => {
        let data = await getRequest(currentUser.stsTokenManager.accessToken,
            ServerConsts.GET_SHARED_MEDICINE);

        let result = data.reduce((r, { hebName: name, dosage: dosage, regNum: regNum, unitType: unitType, ...object }) => {
            let temp = r.find(o => o.regNum === regNum);
            if (!temp) r.push(temp = { hebName: name, dosage: dosage, unitType: unitType, regNum: regNum, sharingDetails: [] });
            temp.sharingDetails.push(object);
            return r;
        }, []);

        setRows(result);
    }

    const calculateTotalAvailable = (row) => {
        let count = 0;
        row.sharingDetails.forEach((item) => {
            count += item.count;
        });
        return count;
    }

    const formatDate = (dateString) => {
        let date = new moment(dateString);

        return date.format('DD/MM/yyyy');
    }

    const getContactDetails = async (uuid) => {
        let data = await getDoc(doc(db, "users", uuid));
        setContactDetails(data.data());
        console.log(data.data());
        setShowContactDetails(true);
    };

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
                        {row.hebName}
                    </TableCell>
                    <TableCell align="right">{row.dosage}{row.unitType==='CAPLET'?<>&nbsp;(mg)</>:<>&nbsp;(ml)</>}</TableCell>
                    <TableCell align="right">{calculateTotalAvailable(row)}</TableCell>
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
                                            <TableRow key={detailsRow.expiration}>
                                                <TableCell align="right" component="th" scope="row">
                                                    {formatDate(detailsRow.expiration)}
                                                </TableCell>
                                                <TableCell align="right">{detailsRow.count}</TableCell>
                                                <TableCell align="right">
                                                    <LoadingButton
                                                        variant="contained"
                                                        size="small"
                                                        endIcon={<ContactPageIcon style={{marginRight: 12}}/>}
                                                        onClick={() => {getContactDetails(detailsRow.uuid);}}
                                                        loading={contactDetailsLoading}
                                                        loadingPosition="end"
                                                    >
                                                        פרטי משתמש
                                                    </LoadingButton>
                                                </TableCell>
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
            {showContactDetails &&
                <>
                    <TransitionsModal open={showContactDetails} toggleModal={()=>{setShowContactDetails(!showContactDetails)}}>
                        <h4>{contactDetails.firstName} {contactDetails.lastName}</h4>
                        <Box paddingBottom={'8px'} display={'flex'}>
                            <EmailIcon/> &nbsp;&nbsp;{contactDetails.email}
                        </Box>
                        <Box paddingBottom={'8px'} display={'flex'}>
                            <PhoneIcon/> &nbsp;&nbsp;{contactDetails.telephone}
                        </Box>
                        <Box paddingBottom={'8px'} display={'flex'}>
                            <HomeIcon/> &nbsp;&nbsp;{contactDetails.city}
                        </Box>
                    </TransitionsModal>
                </>
            }

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
                        {rows.map((row) => (
                            <Row key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default SharedMedicine;