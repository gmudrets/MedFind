import React, {useEffect, useState} from "react";
import {createTheme} from "@mui/material/styles";
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

function MyMedicine() {
    const theme = createTheme({direction: 'rtl'});
    const navigate = useNavigate();
    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));

    const [ loading, setLoading ] = useState(false);
    const [ items, setItems ] = useState([]);
    const [ loadData, setLoadData ] = useState(true);
    const [ resultsFound, setResultsFound ] = useState(false);


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

        console.log(data);
        if(data.length>0){
            setItems(data);
            setResultsFound(true);
        }
        setLoadData(false);
        setLoading(false);
    }

    //TODO: Add expiration date and amount to details
    //TODO: when clocking share check that the user has a city and phone number, if not present an error meggase dialog and suggest to go to settings to update the details.
    return (
        <>
            <CircularProgressBackdrop open={loading} toggle={setLoading}/>
            <Typography align="center" variant="h6" gutterBottom component="div">
                התרופות שלי
            </Typography>
            {!resultsFound && (
                <Typography sx={{ mt: 2 }} align={"center"}>
                    אין מידע להצגה
                </Typography>
            )}
            {resultsFound && (
                <>
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
                                <DetailedCard data={item} type='myDrug' title={item.hebName} subheader={item.engName} image={item.imageUrl} body={item.treatment} expandData={item} prescription={item.prescription}/>
                            </Box>
                    ))}
                </>
            )}
        </>
    );

}

export default MyMedicine;