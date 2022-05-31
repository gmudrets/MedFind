import * as React from "react";
import {useEffect, useState} from "react";
import {getRequest} from "../../Utils/AxiosRequests";
import {ServerConsts} from "../../Consts/apiPaths";
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import * as STATE_PATHS from "../../Consts/StatePaths";
import CircularProgressBackdrop from "../UI/CircularProgressBackdrop/CircularProgressBackdrop";
import {auth} from "../../Configs/FirebaseConfig";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import PhotoIcon from '@mui/icons-material/Photo';
import IconButton from "@mui/material/IconButton";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {Stack} from "@mui/material";
import {green, red} from "@mui/material/colors";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import TransitionsModal from "../UI/Modal/Modal";
import {useNavigate} from "react-router-dom";

function ApprovalRequests() {

    const navigate = useNavigate();
    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));
    const profile = useSelector((state) => getSafe(STATE_PATHS.USER_PROFILE, state));
    const [rows, setRows] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ updateTable, setUpdateTable ] = useState(true);
    const [ showImage, setShowImage ] = useState(false);
    const [ image, setImage ] = useState("");
    const isAdmin = profile.userType==='admin';


    useEffect(() => {
        if (currentUser === ''){
            navigate("/login");
        }
    }, [currentUser]);

    useEffect(() => {
        if (!isAdmin){
            navigate("/");
        }
    },[isAdmin]);

    useEffect(() => {
        if (updateTable){
            getPendingRequests();
        }
    }, [updateTable]);

    const userTypes = {
        "DOCTOR":"רופא",
        "MEDICAL_STAFF_MEMBER":"צוות רפואי"
    };

    const statuses = {
        "PENDING":"ממתין לאישור",
        "APPROVED":"מאושר",
        "DENIED":"נדחה"
    };

    const getPendingRequests = async () => {
        setLoading(true);
        let data = await getRequest(await auth.currentUser.getIdToken(true),
            ServerConsts.GET_PENDING_REQUESTS, {"requestStatus": "PENDING"});

        setRows(data);
        setUpdateTable(false);
        setLoading(false);
    };

    const handleAction = async (uuid, newStatus) => {
        await getRequest(await auth.currentUser.getIdToken(true),
            ServerConsts.CHANGE_REQUEST_STATUS, {"uuid": uuid, "requestStatus": newStatus});
        setUpdateTable(true);
    }

    const toggleShowImage = () => {
        setShowImage(!showImage);
    }

    const theme = createTheme({
        palette: {
            primary: green,
            secondary: red,
        },
    });

    return (
        <>
            <CircularProgressBackdrop open={loading} toggle={setLoading}/>
            <TransitionsModal open={showImage} toggleModal={toggleShowImage}>
                <img src={image} alt="img"/>
            </TransitionsModal>
            {rows.length===0 && <p align="center"> אין בקשות ממתינות </p>}
            {rows.length>0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">שם פרטי</TableCell>
                                <TableCell align="right">שם משפחה</TableCell>
                                <TableCell align="right">סוג משתמש מבוקש</TableCell>
                                <TableCell align="right">הוכחת זהות</TableCell>
                                <TableCell align="right">סטטוס</TableCell>
                                <TableCell align="right">פעולה</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" align="right">
                                        {row.firstName}
                                    </TableCell>
                                    <TableCell align="right">{row.lastName}</TableCell>
                                    <TableCell align="right">{userTypes[row.requestedType]}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            endIcon={<PhotoIcon style={{marginRight: 12}}/>}
                                            size="small"
                                            onClick={()=>{
                                                    setImage(row.certificateImage);
                                                    setShowImage(true);
                                                }
                                            }
                                        >
                                            הצג צילום
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">{statuses[row.requestStatus]}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1}>
                                            {row.requestStatus!=='PENDING' ? (
                                                <>
                                                    <IconButton aria-label="approve" disabled>
                                                        <DoneIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="deny" disabled>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </>
                                                ) : (
                                                <ThemeProvider theme={theme}>
                                                    <IconButton aria-label="approve" color="primary" onClick={() => {handleAction(row.uuid, "APPROVED")}}>
                                                        <DoneIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="deny" color="secondary" onClick={() => {handleAction(row.uuid, 'DENIED')}}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </ThemeProvider>
                                                )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                )}
        </>

    );
}

export default ApprovalRequests;
