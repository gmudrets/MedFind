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

function Home() {
  const theme = createTheme({direction: 'rtl'});
  const navigate = useNavigate();
  const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));

  const [ tableRows, setTableRows ] = useState([]);
  const [ searchValue, setSearchValue ] = useState("");
  const [ scannerOpen, setScannerOpen ] = useState(false);
  const [ triggerSearch, setTriggerSearch ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    if (username === ''){
        navigate("/login");
    }
  }, [username]);

  useEffect(() => {
    if (triggerSearch && searchValue !== ''){
        search()
        setTriggerSearch(!triggerSearch);
    }
  }, [triggerSearch]);

  const createData = (activeComponents, barcodes, customerPrice, dosageForm, dragEnName,
                      dragHebName, health, images, prescription, secondarySymptom, brochure) => {
      return { activeComponents, barcodes, customerPrice, dosageForm, dragEnName, dragHebName, health,
                  images, prescription, secondarySymptom, brochure };
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

  const search = async () => {
      setLoading(true)
    let rows = [];
    let data = await getRequest(ServerConsts.SEARCH_MEDICINE, { "name" : searchValue, "prescription" : "false", "pageIndex" : "1" });

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
          ))
      }
    );

    setTableRows(rows);
    setLoading(false);
  }

  const handleSearchValueChange = (eventData) => {
    setSearchValue(eventData.target.value);
  }

  const toggleScanner = () => {
    setScannerOpen(!scannerOpen);
  }

  const searchBarcode = (data) =>{
      setSearchValue(data);
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
                                search();
                                e.preventDefault();
                            }
                        }
                    }
                />
                <IconButton sx={{ p: '10px' }} aria-label="search" onClick={search}>
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
        <CircularProgressBackdrop open={loading} toggle={setLoading}/>
        { tableRows.length > 0 ? (
            <Box
                    marginTop='65px'
                    marginBottom='45px'
                    display='flex'
                    flexDirection='column'
                    justifyContent="center"
                    alignItems='center'
            >
                {tableRows.map((row) => (
                        <DetailedCard data={row}/>
                    ))
                }
            </Box>
        ) : (<p align="center"> אין מידע להצגה </p>) }
    </ThemeProvider>
  );
}

export default Home;