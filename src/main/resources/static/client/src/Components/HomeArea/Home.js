import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { getSafe } from '../../Utils/Utils'
import * as STATE_PATHS from '../../Consts/StatePaths'
import {getRequest} from "../../Utils/AxiosRequests";
import {ServerConsts, External} from "../../Consts/apiPaths";
import TransitionsModal from '../UI/Modal/Modal';
import BarcodeScanner from '../BarcodeScanner/BarcodeScanner';
import CircularProgressBackdrop from "../UI/CircularProgressBackdrop/CircularProgressBackdrop";
import icon from '../../Assets/Images/icon.png'
import DetailedCard from "../UI/DetailedCard/DetailedCard";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";

function Home() {
  const theme = createTheme({direction: 'rtl'});
  const navigate = useNavigate();
  const currentUser = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));

  const [ items, setItems ] = useState([]);
  const [ searchValue, setSearchValue ] = useState("");
  const [ scannerOpen, setScannerOpen ] = useState(false);
  const [ triggerSearch, setTriggerSearch ] = useState(false);
  const [ triggerGenericSearch, setTriggerGenericSearch ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [HasMore, setHasMore] = useState(true);
  const [ isGeneric, setIsGeneric ] = useState(false);
  const [ genericSearchValue, setGenericSearchValue ] = useState(null)
  const [ noResultsFound, setNoResultsFound ] = useState(false);

  useEffect(() => {
    if (currentUser === ''){
        navigate("/login");
    }
  }, [currentUser]);

  useEffect(() => {
    if (triggerSearch && searchValue !== ''){
        search(true);
        setTriggerSearch(!triggerSearch);
    }
  }, [triggerSearch]);

  useEffect(() => {
    if (triggerGenericSearch && genericSearchValue !== null){
        search(true, true);
        setTriggerGenericSearch(!triggerGenericSearch);
    }
  }, [triggerGenericSearch]);

  const createData = (activeComponents, barcodes, customerPrice, dosageForm, dragEnName,
                      dragHebName, health, images, prescription, secondarySymptom, brochure, activeComponentsCompareName) => {
      return { activeComponents, barcodes, customerPrice, dosageForm, dragEnName, dragHebName, health,
                  images, prescription, secondarySymptom, brochure, activeComponentsCompareName };
  }

  const generateMultiField = (data) => {
    let final = '';

    data.forEach(
      (d) => {
        final += d + ":";
      }
    );

    // Remove last character
    return final.slice(0, -1);
  }

  const getImageURL = (data) => {
    let url = External.EXTERNAL_FILES_URL;
    if (data[0] === undefined){
        url = icon;
    }
    else {
        url += data[0];
    }
    return url;
  }

  const search = async (newSearch, generic) => {
    let pageNum = page;
    setIsFetching(true);
    if (newSearch)
    {
        setLoading(true);
        setItems([]);
        pageNum = 1;
        setPage(pageNum);
    }

    let data;
    if (generic){
        setIsGeneric(true);
        data = await getRequest(currentUser.stsTokenManager.accessToken,
        ServerConsts.SEARCH_GENERIC,
            { "val" : genericSearchValue.activeIngredient, "name" : genericSearchValue.hebName, "pageIndex" : pageNum });
    }
    else{
        setIsGeneric(false);
        data = await getRequest(currentUser.stsTokenManager.accessToken,
            ServerConsts.SEARCH_MEDICINE,
            { "name" : searchValue, "prescription" : "false", "pageIndex" : pageNum });
    }
    if (data["results"].length === 0){
        setNoResultsFound(true);
    }

    populateData(data);
  }

    const populateData = (data) => {
        let rows = [];
        data["results"].forEach(
            (d) => {
                rows.push(createData(
                    generateMultiField(d["activeComponents"]),
                    d["barcodes"],
                    d["customerPrice"],
                    d["dosageForm"],
                    d["dragEnName"],
                    d["dragHebName"],
                    d["health"],
                    getImageURL(d["images"]),
                    d["prescription"],
                    d["secondarySymptom"],
                    d["dragRegNum"],
                    d["activeComponentsCompareName"],
                ))
            }
        );

        setItems((prevRows) => {
            return [...new Set([...prevRows, ...rows])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(rows.length > 0);
        setIsFetching(false);
        setLoading(false);
    }

  const handleSearchValueChange = (eventData) => {
    setSearchValue(eventData.target.value);
  }

  const toggleScanner = () => {
    setScannerOpen(!scannerOpen);
  }

  const searchBarcode = (data) => {
      setSearchValue(data);
  }

  const toggleNoResults = () => {
    setNoResultsFound(!noResultsFound);
  }

  return (
    <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="חיפוש תרופה"
                    inputProps={{ 'aria-label': 'חיפוש תרופה' }}
                    onChange={handleSearchValueChange}
                    value={searchValue}
                    onKeyDown={
                        (e) => {
                            if (e.key === 'Enter') {
                                search(true);
                                e.preventDefault();
                            }
                        }
                    }
                />
                <IconButton sx={{ p: '10px' }} aria-label="search" onClick={() => {search(true)}}>
                    <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="barcode" onClick={toggleScanner}>
                    <QrCode2Icon />
                </IconButton>
                </Paper>
            </Box>
        </Container>
          <TransitionsModal open={scannerOpen} toggleModal={toggleScanner}>
            <BarcodeScanner setScannedData={searchBarcode} triggerSearch={setTriggerSearch} closeModal={toggleScanner}/>
          </TransitionsModal>
        <TransitionsModal open={noResultsFound} toggleModal={toggleNoResults}>
            <Typography sx={{ mt: 2 }} align={"center"}>
                לא נמצאו תוצאות
            </Typography>
        </TransitionsModal>
        <CircularProgressBackdrop open={loading} toggle={setLoading}/>
        { items.length > 0 ? (
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
                        <DetailedCard data={item} type='drug' title={item.dragHebName} subheader={item.dragEnName} image={item.images} body={item.secondarySymptom} expandData={item} prescription={item.prescription} setGenericSearchValue={setGenericSearchValue} triggerSearch={setTriggerGenericSearch}/>
                    </Box>
            ))}
            {HasMore && (
                <Box
                    sx={{
                        marginBottom: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <LoadingButton
                        variant="contained"
                        size="small"
                        endIcon={<KeyboardArrowDownIcon style={{marginRight: 12}}/>}
                        onClick={() => {search(false, isGeneric)}}
                        loading={isFetching}
                        loadingPosition="end"
                    >
                        תוצאות נוספות
                    </LoadingButton>
                </Box>
            )}
            </>
        ) : (<p align="center"> אין מידע להצגה </p>) }
    </ThemeProvider>
  );
}

export default Home;