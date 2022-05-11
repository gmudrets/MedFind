import * as React from 'react';

import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import {useEffect, useRef, useState} from "react";

import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";


export default function PasswordShower(props) {
    const inputRef = useRef();
    const buttonRef = useRef();
    const showPasswordButtonRef = useRef();
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [pointerInButton, setPointerInButton] = React.useState(false);


    const handlePointerEnterButton = () => {
        setPointerInButton(true);
    }
    const handlePointerLeaveButton = () => {
        setPointerInButton(false);
    }
    const clickOutside = (refrence, e) => {
        return refrence.current && !refrence.current.contains(e.target);
    }
    const clickInside = (refrence, e) => {
        return refrence.current && refrence.current.contains(e.target);
    }
    const handleClickOutside = e => {
        if (clickOutside(inputRef, e) && (clickOutside(buttonRef, e))) {
            handleCancelClick();
        }
    };
    const handleClickInside = e => {
        e.preventDefault();
        if (clickInside(inputRef, e) && (clickOutside(showPasswordButtonRef, e))) {
            handleClickShowPassword();
        }
    };


    const handleEditClick = () => {
        props.beforeEditModeStarts();
        setIsEditMode(true);
    }

    const handleCancelClick = () => {
        props.onCancel()
        setIsEditMode(false);
        setShowPassword(false);

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
                <Grid item xs={9}>

                    <TextField
                        InputProps={{
                            readOnly: true,

                            endAdornment:
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    ref={showPasswordButtonRef}
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>

                        }}
                        label={props.label}
                        id="outlined-start-adornment"
                        focused={false}
                        value={props.val}
                        inputRef={inputRef}
                        type={showPassword ? 'text' : 'password'}
                        variant={"standard"}
                        fullWidth
                        sx={{maxWidth: "500px", maxHeight: "30px"}}
                        onClick={handleClickInside}

                    />


                </Grid>
                <Grid item xs={3}>
                    <Stack>

                        <IconButton onClick={!isEditMode ? handleEditClick : handleCancelClick}
                                    color={isEditMode ? "warning" : (!pointerInButton) ? 'default' : "primary"}
                                    style={{maxWidth: "45px"}}
                                    ref={buttonRef}
                                    onPointerEnter={handlePointerEnterButton}
                                    onPointerLeave={handlePointerLeaveButton}
                        >
                            {!isEditMode ? <EditIcon/> : <ClearIcon/>}
                        </IconButton>

                    </Stack>
                </Grid>

            </Grid>
        </Box>)


}

PasswordShower.defaultProps = {
    //the initial value of the field
    val: "",
    //validation function for the field
    validate: (s) => true,
    //label of field
    label: "field",

    //called before edit mode starts
    beforeEditModeStart: () => {
        return true;
    },

    //onCancel
    onCancel: () => {
        return true;
    },


}