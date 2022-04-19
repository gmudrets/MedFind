import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import Grid from "@mui/material/Grid";
//rtl stuff https://mui.com/material-ui/guides/right-to-left/
import rtlPlugin from 'stylis-plugin-rtl';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {prefixer} from 'stylis';
import {Button, Stack} from "@mui/material";
import EditableTextWithButtons from "./EditableTextWithButtons";
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import * as STATE_PATHS from "../../Consts/StatePaths";

// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props) {
    return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export default function Settings2() {
    const theme = createTheme({direction: 'rtl'});
    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });
    const username = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));
    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const validateName = (s) => {
        return s != '' && s.charAt(0) == 'a';
    }
    const marginY = 2;
    const m = 3;
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <React.Fragment>
                    <Box sx={{flexGrow: 1}}>
                        <Grid container columnSpacing={5} rowSpacing={2} sx={{paddingTop: "40px", paddingLeft: "20px",paddingBottom:"70px"}}>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons label="שם משתמש" validate={validateName} initVal={username}/>
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons label="מייל" validate={validateName}/>
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons label="טלפון" validate={validateName}/>

                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <EditableTextWithButtons password={ true} label="ססמא" validate={validateName}/>

                            </Grid>
                        </Grid>
                    </Box>
                </React.Fragment>

            </ThemeProvider>
        </CacheProvider>


    );
}
