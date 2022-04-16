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
import {AccountCircle} from "@mui/icons-material";

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
    const marginX = 7;
    const m = 3;
    return (
        <ThemeProvider theme={theme}>

                 <div>
                    <TextField
                        label="שם משתמש"
                        id="outlined-start-adornment"
                        sx={{m:m,marginX: marginX, width: '25ch'}}
                        InputLabelProps={{sx:{textAlign:'right'}}}
                        focused
                    />
                    <TextField
                        label="מייל"
                        id="outlined-start-adornment"
                        sx={{m:m,marginX: marginX, width: '25ch',}}
                        focused

                    />

                    <FormControl sx={{m:m,marginX: marginX, width: '25ch'}} variant="outlined" focused>
                        <InputLabel
                            htmlFor="outlined-adornment-password">ססמא</InputLabel>
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


                </div>
        </ThemeProvider>

    );
}
