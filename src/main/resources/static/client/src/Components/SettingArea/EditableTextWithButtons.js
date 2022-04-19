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
import {Button, Stack} from "@mui/material";
import {useState} from "react";
import {checkNode} from "@testing-library/jest-dom/dist/utils";

export default function EditableTextWithButtons(props) {
    const [isEdited, setIsEdited] = useState(false);
    const [isValidate, setIsValidate] = useState(false);
    const [currentText, setCurrentText] = useState(props.initVal);
    const handleEditClick = () => {
        setIsEdited(true);
    }
    const handleClearClick = () => {
        setIsEdited(false);
    }
    // const handleChange = (event) => {
    //     setCurrentText(event.target.value)
    //     setIsValidate(props.validate(currentText))
    // }
    return (<Grid container>
        <Grid item md={9}>
            <TextField
                fullWidth
                label="מספר טלפון"
                id="outlined-start-adornment"
                InputProps={{
                    readOnly: !isEdited,
                }}
                focused={isEdited}
                defaultValue={props.initVal}
            />
        </Grid>
        <Grid item md={3}>
            <Stack>
                {isEdited && <Button onClick={handleClearClick} variant="contained" component="span"
                                     style={{minWidth: 'fit-content', maxWidth: "20px"}}
                                     endIcon={<ClearIcon/>}/>}
                {isEdited &&
                    <Button variant="outlined" component="span" style={{minWidth: 'fit-content', maxWidth: "20px"}}
                            endIcon={<CheckIcon/>}
                            disabled={!isValidate}/>}
                {!isEdited && <Button onClick={handleEditClick} variant="outlined" component="span"
                                      style={{minWidth: 'fit-content', maxWidth: "20px"}} endIcon={<EditIcon/>}/>}

            </Stack>
        </Grid>

    </Grid>)
}