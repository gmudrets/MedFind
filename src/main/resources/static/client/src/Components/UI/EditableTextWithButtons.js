import * as React from 'react';

import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Grid from "@mui/material/Grid";
import {Button, Stack} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";


export default function EditableTextWithButtons(props) {
    const inputRef = useRef();
    const passwordRef = useRef();
    const buttonRef = useRef();
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentlyValidated, setCurrentlyValidated] = useState(false);
    const [currentText, setCurrentText] = useState(props.initVal);
    const [lastSubmitted, setLastSubmitted] = useState(props.initVal);
    const [submiting, setSubmitings] = useState(false);
    const [showPassword, setShowPassword] = useState(!props.password);
    const [pointerInButton,setPointerInButton] = React.useState(false);
    

    useEffect(() => {
            if (isEditMode) {

                if (!props.password)
                    inputRef.current.focus();
                else
                    passwordRef.current.focus();
            }
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }

        ,
        [isEditMode]
    )
    const handlePointerEnterButton = () => {
      setPointerInButton(true);
    }
    const handlePointerLeaveButton = () => {
        setPointerInButton(false);
    }
    const clickOutside = (refrence, e) => {
        return refrence.current && !refrence.current.contains(e.target);
    }
    const handleClickOutside = e => {
        if (clickOutside(inputRef, e) && (!props.password || props.password && clickOutside(passwordRef, e)) && clickOutside(buttonRef, e)) {
            handleClearClick();
        }
    };


    const handleEditClick = () => {
        inputRef.current.focus();
        setIsEditMode(true);
        if (props.password) {
            setShowPassword(true);
        }
        setCurrentlyValidated(props.validate(lastSubmitted));
    }

    const handleClearClick = () => {
        setIsEditMode(false);
        setCurrentText(lastSubmitted);
        if (props.password) {
            setShowPassword(false);
        }
    }
    const handleChange = (event) => {
        setCurrentText(event.target.value)
        setCurrentlyValidated(props.validate(event.target.value))

    }

    const myHandleSubmit = () => {
        const currentTextInField = currentText;
        setSubmitings(true);
        if (props.onSubmit(currentTextInField)) {
            setLastSubmitted(currentTextInField);
            setCurrentText(currentTextInField);
        } else {
            alert("Error Submiting " + props.label)
            setCurrentText(lastSubmitted);
        }
        setIsEditMode(false);
        setSubmitings(false);
        if (props.password) {
            setShowPassword(false);
        }

    }
    const handleKeyPress = (event) => {
        if (currentlyValidated && event.code === "Enter") {
            myHandleSubmit();
        }
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box sx={{flexGrow: 1}}>

            <Grid container>
                <Grid item md={9}>
                    {(!props.password || !isEditMode) ?
                        <TextField
                            focused={isEditMode}
                            InputProps={{
                                readOnly: !isEditMode && !submiting,
                            }}
                            onChange={handleChange}
                            label={props.label}
                            id="outlined-start-adornment"
                            fullWidth
                            value={currentText}
                            error={!currentlyValidated && isEditMode}
                            onClick={handleEditClick}
                            inputRef={inputRef}
                            type={showPassword ? 'text' : 'password'}
                            variant={isEditMode ? "outlined" : "standard"}
                            onKeyPress={handleKeyPress}

                        />
                        : <FormControl variant="outlined" fullWidth>
                            <InputLabel
                                htmlFor="outlined-adornment-password">{props.label}</InputLabel>
                            <OutlinedInput
                                type={showPassword ? 'text' : 'password'}
                                focused={isEditMode}S
                                onChange={handleChange}
                                label={props.label}
                                id="outlined-start-adornment"
                                fullWidth
                                value={currentText}
                                error={!currentlyValidated && isEditMode}
                                inputRef={passwordRef}
                                onClick={handleEditClick}
                                onKeyPress={handleKeyPress}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                variant={isEditMode ? "outlined" : "standard"}

                            />
                        </FormControl>}


                </Grid>
                <Grid item md={3}>
                    <Stack>

                        <Button onClick={!isEditMode ? handleEditClick : myHandleSubmit}
                                variant={(!isEditMode&&!pointerInButton) ? 'text' : "contained"}
                                style={{maxWidth: "45px"}}
                                endIcon={!isEditMode ? <EditIcon/> : <CheckIcon/>}
                                ref={buttonRef}
                                onPointerEnter={handlePointerEnterButton}
                                onPointerLeave={handlePointerLeaveButton}
                        />

                    </Stack>
                </Grid>

            </Grid>
        </Box>)


}

EditableTextWithButtons.defaultProps = {
    //the initial value of the field
    initVal: "",
    //validation function for the field
    validate: (s) => true,
    //label of field
    label: "field",
    //handle submition return true if everything was ok
    handleSubmit: (s) => {
        return true
    },
    //is passwor
    password: false

}