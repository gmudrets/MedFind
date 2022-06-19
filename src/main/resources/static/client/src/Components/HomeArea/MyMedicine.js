import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import * as STATE_PATHS from "../../Consts/StatePaths";
import Typography from "@mui/material/Typography";
import CircularProgressBackdrop from "../UI/CircularProgressBackdrop/CircularProgressBackdrop";
import Box from "@mui/material/Box";
import DetailedCard from "../UI/DetailedCard/DetailedCard";
import {getRequest} from "../../Utils/AxiosRequests";
import {ServerConsts} from "../../Consts/apiPaths";
import AlertDialog from "../UI/Dialog";
import {Alert, Snackbar} from "@mui/material";

function MyMedicine() {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));

    const [ loading, setLoading ] = useState(false);
    const [ items, setItems ] = useState([]);
    const [ loadData, setLoadData ] = useState(true);
    const [ resultsFound, setResultsFound ] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openShareDialog, setOpenShareDialog] = React.useState(false);
    const [dialogItem, setDialogItem] = React.useState({});
    const [showShareMessage, setShowShareMessage] = useState(false);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);


    useEffect(() => {
        if (currentUser === ''){
            navigate("/login");
        }
    }, [currentUser]);

    useEffect(() => {
        if(loadData){
            getMyMeds();
        }
    }, [loadData]);

    const getMyMeds = async () => {
        setLoading(true);
        let data = await getRequest(currentUser.stsTokenManager.accessToken,
            ServerConsts.GET_USER_MEDICINE);

        if(data.length>0){
            setItems(data);
            setResultsFound(true);
        }
        setLoadData(false);
        setLoading(false);
    }

    const handleShareClick = async (item) => {
        await getRequest(currentUser.stsTokenManager.accessToken,
            ServerConsts.UPDATE_MEDICINE_SHARING, {
                id: item.id,
                shared: !item.shared
            });
        setShowShareMessage(true);

    };

    const handleDeleteClick = async (id) => {
        await getRequest(currentUser.stsTokenManager.accessToken,
            ServerConsts.DELETE_MEDICINE, {
                id: id,
            });
        setShowDeleteMessage(true);
    };

    const handleAlertClick = async (id) => {
        //TODO: implement

        // await getRequest(currentUser.stsTokenManager.accessToken,
        //     ServerConsts.UPDATE_MEDICINE_SHARING, {
        //         id: id,
        //         shared: true
        //     });
        // setShowShareMessage(true);

        console.log("Alert!");
    };

    //TODO: when clicking share check that the user has a city and phone number, if not present an error meggase dialog and suggest to go to settings to update the details.
    return (
        <>
            <CircularProgressBackdrop open={loading} toggle={setLoading}/>
            <Typography align="center" variant="h6" gutterBottom component="div">
                התרופות שלי
            </Typography>
            <Snackbar open={showDeleteMessage}
                      autoHideDuration={1500}
                      onClose={() => {
                          setShowDeleteMessage(false);
                          setLoadData(true);
                      }}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity="success">
                    התרופה הוסרה מהמאגר
                </Alert>
            </Snackbar>
            <Snackbar open={showShareMessage}
                      autoHideDuration={1500}
                      onClose={() => {
                          setShowShareMessage(false);
                          setLoadData(true);
                      }}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity="success">
                    שיתוף התרופה עודכן
                </Alert>
            </Snackbar>
            {!resultsFound && (
                <Typography sx={{ mt: 2 }} align={"center"}>
                    אין מידע להצגה
                </Typography>
            )}
            {resultsFound && (
                <>
                    <AlertDialog open={openDeleteDialog}
                                 setOpen={setOpenDeleteDialog}
                                 title="אישור מחיקת תרופה"
                                 textContent="האם למחוק את התרופה?"
                                 acceptButtonText="אישור"
                                 declineButtonText="ביטול"
                                 onAccept={() => {handleDeleteClick(dialogItem.id)}}
                    />
                    <AlertDialog open={openShareDialog}
                                 setOpen={setOpenShareDialog}
                                 title={dialogItem.shared ? "ביטול שיתוף תרופה" : "אישור שיתוף תרופה"}
                                 textContent={dialogItem.shared ? "האם לבטל את שיתוף התרופה?" : "האם לשתף את התרופה?"}
                                 acceptButtonText="אישור"
                                 declineButtonText="חזור"
                                 onAccept={() => {
                                     handleShareClick(dialogItem)
                                 }}
                    />
                    {items.map((item,index) => (
                        <Box
                            key={index}
                            marginTop='65px'
                            marginBottom='45px'
                            display='flex'
                            flexDirection='column'
                            justifyContent="center"
                            alignItems='center'
                        >
                            <DetailedCard data={item}
                                          type='myDrug'
                                          title={item.hebName}
                                          subheader={item.engName}
                                          image={item.imageUrl}
                                          body={item.treatment}
                                          expandData={item}
                                          prescription={item.prescription}
                                          handleDeleteClick={() => {
                                              setDialogItem(item);
                                              setOpenDeleteDialog(true);
                                          }}
                                          handleShareClick={() => {
                                              setDialogItem(item);
                                              setOpenShareDialog(true);
                                          }}
                                          handleAlertClick={handleAlertClick}
                            />
                        </Box>
                    ))}
                </>
            )}
        </>
    );

}

export default MyMedicine;