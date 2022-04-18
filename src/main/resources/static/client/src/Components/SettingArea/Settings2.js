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
    const marginY = 2;
    const m = 3;
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <React.Fragment>
                    <Box sx={{flexGrow: 1}}>
                        <Grid container columnSpacing={5} rowSpacing={2} sx={{paddingTop: "40px"} }>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <TextField
                                    label="שם משתמש"
                                    id="outlined-start-adornment"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <Grid container>
                                    <Grid item md={9}>
                                        <TextField
                                            label="מייל"
                                            id="outlined-start-adornment"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={3} >
                                        <Stack>
                                            <Button variant="outlined" component="span" style={{minWidth: 'fit-content'}} endIcon={<EditIcon/>}/>

                                        </Stack>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <Grid container>
                                    <Grid item md={9}>
                                        <TextField
                                            fullWidth
                                            label="מספר טלפון"
                                            id="outlined-start-adornment"
                                        />
                                    </Grid>
                                    <Grid item md={3} >
                                        <Stack>
                                            <Button variant="outlined" component="span" style={{minWidth: 'fit-content'}} endIcon={<ClearIcon/>}/>
                                            <Button variant="contained" component="span" style={{minWidth: 'fit-content'}} endIcon={<CheckIcon/>}/>
                                        </Stack>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item md={3} sx={{textAlign: "center"}}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel
                                        htmlFor="outlined-adornment-password" >ססמא</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        onChange={handleChange('password')}

                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"

                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </React.Fragment>

            </ThemeProvider>
        </CacheProvider>


    );
}
