import * as React from 'react';

import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import {useEffect, useRef, useState} from "react";

import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import {clear} from "@testing-library/user-event/dist/clear";


export default function EditableTextWithButtons(props) {
    const inputRef = useRef();
    const buttonRef = useRef();
    const showPasswordButtonRef = useRef();
    const [isEditMode, setIsEditMode] = useState(props.startsOnEdit);
    const [currentlyValidated, setCurrentlyValidated] = useState(props.periodicValidate(props.initVal));
    const [currentText, setCurrentText] = useState(props.initVal);
    const [lastSubmitted, setLastSubmitted] = useState(props.initVal);
    const [submiting, setSubmiting] = useState(false);
    const [showPassword, setShowPassword] = useState(!props.password);
    const [pointerInButton, setPointerInButton] = React.useState(false);


    useEffect(() => {
            if (isEditMode) {
                inputRef.current.focus();
            }
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            }

        }

        ,
        [isEditMode,props.clearOnOutsideClick]
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
    const clickInside = (refrence, e) => {
        return refrence.current && refrence.current.contains(e.target);
    }
    const handleClickOutside = e => {

        if (clickOutside(inputRef, e) && clickOutside(buttonRef, e) && (clickOutside(props.notOutsideRef, e))) {
            if (props.trySubmitOnOutsideClick && currentlyValidated) {
                myHandleSubmit();
            } else if (props.clearOnOutsideClick) {
                handleClearClick();

            } else {
            }
        }

    };
    const handleClickInside = e => {
        if (clickInside(inputRef, e) && (!props.password || clickOutside(showPasswordButtonRef, e))) {
            handleEditClick();
        }
    };


    const handleEditClick = () => {
        inputRef.current.focus();
        props.beforeEditModeStart(props.id);
        setIsEditMode(true);
        if (props.password) {
            setShowPassword(true);
        }
        setCurrentlyValidated(props.periodicValidate(lastSubmitted));
    }

    const handleClearClick = () => {
        props.beforeEditModeFinish(props.id);
        setIsEditMode(false);
        setCurrentText(lastSubmitted);
        if (props.password) {
            setShowPassword(false);
        }
    }
    const handleChange = (event) => {
        setCurrentText(event.target.value);
        if(!props.validateOnlyOnSubmit) {
            setCurrentlyValidated(props.periodicValidate(event.target.value));
        }else {
            setCurrentlyValidated(true);
        }
    }

    const myHandleSubmit = async () => {
        const currentTextInField = currentText;
        setSubmiting(true);
        if (await props.onSubmit(currentTextInField)) {
            setLastSubmitted(currentTextInField);
            setCurrentText(currentTextInField);
            props.beforeEditModeFinish(props.id);
            setIsEditMode(false);
            if (props.password) {
                setShowPassword(false);
            }
        } else {
            if (props.validateOnlyOnSubmit) {
                alert("Error Submiting " + props.label)
                setCurrentText(lastSubmitted);
            } else {
                setCurrentlyValidated(false);
            }
        }
        setSubmiting(false);

    }
    const handleKeyPress = (event) => {
        if (currentlyValidated && (event.code === "Enter"||event.code === "Return"|| event.code === "Go"||event.code === "")) {
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
                <Grid item xs={9}>

                    <TextField
                        focused={isEditMode}
                        InputProps={props.password ? {
                            readOnly: !isEditMode && !submiting,

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

                        } : {
                            readOnly: !isEditMode && !submiting,
                        }}
                        onChange={handleChange}
                        label={props.label}

                        value={currentText}
                        error={!currentlyValidated && isEditMode}
                        inputRef={inputRef}
                        type={showPassword ? 'text' : 'password'}
                        variant={isEditMode ? "outlined" : "standard"}
                        onKeyPress={handleKeyPress}
                        fullWidth
                        sx={{maxWidth: "500px", maxHeight: "30px"}}
                        onClick={handleClickInside}
                        helperText={!currentlyValidated? props.errorHint: ""}

                    />


                </Grid>
                <Grid item xs={3}>
                    <Stack>

                        <IconButton
                            onClick={!isEditMode ? handleEditClick : myHandleSubmit}
                            color={(!isEditMode && !pointerInButton) ? 'default' : "primary"}
                            style={{maxWidth: "45px"}}
                            ref={buttonRef}
                            onPointerEnter={handlePointerEnterButton}
                            onPointerLeave={handlePointerLeaveButton}
                            disabled={isEditMode && !currentlyValidated}
                        >
                            {!isEditMode ? <EditIcon/> : (props.saveButton ? <SaveIcon/> : <CheckIcon/>)}
                        </IconButton>

                    </Stack>
                </Grid>

            </Grid>
        </Box>)


}

EditableTextWithButtons.defaultProps = {
    //the initial value of the field
    initVal: "",
    //validation function for the field called on each edit
    periodicValidate: (s) => true,
    //label of field
    label: "field",
    //handle submition return true if everything was ok
    handleSubmit: (s) => {
        return true;
    },
    //called before edit mode starts
    beforeEditModeStart: (id) => {
        return true;
    },
    //called before edit mode ends
    beforeEditModeFinish: (id) => {
        return true;
    },
    //is password
    password: false,
    //contains show password button
    saveButton: false,
    //is starting on edit mode
    startsOnEdit: false,
    ///should try to submit on outsideClick?
    trySubmitOnOutsideClick: false,
    //should clear on outside click
    clearOnOutsideClick: true,
    //refrence for elemnt that dosent count as ouside
    notOutsideRef: null,
    //validate only on submit by function handle submit returning false
    validateOnlyOnSubmit:false,
    //hint on error
    errorHint:""


}