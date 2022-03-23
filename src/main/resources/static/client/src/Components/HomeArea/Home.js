import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { getSafe } from '../../Utils/Utils'
import * as STATE_PATHS from '../../Consts/StatePaths'
import {getRequest} from "../../Utils/AxiosRequests";
import {ServerConsts} from "../../Consts/apiPaths";

function Home() {
  const theme = createTheme({direction: 'rtl'});
  const navigate = useNavigate();
  const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));

  const [ tableRows, setTableRows ] = useState([]);
  const [ searchValue, setSearchValue ] = useState("");

  useEffect(() => {
    if (username === ''){
        navigate("/login");
    }
  }, [username]);

  const createData = (activeComponents, barcodes, customerPrice, dosageForm, dragEnName,
                      dragHebName, health, images, prescription, secondarySymptom) => {
      return { activeComponents, barcodes, customerPrice, dosageForm, dragEnName, dragHebName, health,
                  images, prescription, secondarySymptom };
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
  };

  const search = async () => {
    let rows = [];
    let data = await getRequest(ServerConsts.SEARCH_MEDICINE, { "name" : searchValue, "prescription" : "true", "pageIndex" : "1" });

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
          generateMultiField(d["images"]),
          d["prescription"],
          d["secondarySymptom"],
          ))
      }
    );

    setTableRows(rows);
  }

  const handleSearchValueChange = (eventData) => {
    setSearchValue(eventData.target.value);
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
                    <MenuIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="חיפוש תרופה"
                    inputProps={{ 'aria-label': 'חיפוש תרופה' }}
                    onChange={handleSearchValueChange}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={search}>
                    <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="barcode">
                    <QrCode2Icon />
                </IconButton>
                </Paper>
            </Box>
        </Container>
        { tableRows.length > 0 ? (
        <TableContainer component={Paper} sx={{ m: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="right">{nameMapping["dragHebName"]}</TableCell>
                <TableCell align="right">{nameMapping["dragEnName"]}</TableCell>
                <TableCell align="right">{nameMapping["activeComponents"]}</TableCell>
                <TableCell align="right">{nameMapping["customerPrice"]}</TableCell>
                <TableCell align="right">{nameMapping["dosageForm"]}</TableCell>
                <TableCell align="right">{nameMapping["health"]}</TableCell>
                <TableCell align="right">{nameMapping["prescription"]}</TableCell>
                <TableCell align="right">{nameMapping["secondarySymptom"]}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="right">{row.dragHebName}</TableCell>
                  <TableCell align="right">{row.dragEnName}</TableCell>
                  <TableCell align="right">{row.activeComponents}</TableCell>
                  <TableCell align="right">{row.customerPrice}</TableCell>
                  <TableCell align="right">{getValue(row.dosageForm)}</TableCell>
                  <TableCell align="right">{getValue(row.health)}</TableCell>
                  <TableCell align="right">{getValue(row.prescription)}</TableCell>
                  <TableCell align="right">{getValue(row.secondarySymptom)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>) : (<p align="center"> אין מידע להצגה </p>) }
    </ThemeProvider>
  );
}

export default Home;