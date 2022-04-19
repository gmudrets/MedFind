import * as React from 'react';

import TextField from '@mui/material/TextField';

import ClearIcon from '@mui/icons-material/Clear';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Grid from "@mui/material/Grid";
import {Button, Stack} from "@mui/material";
import {useState} from "react";


export default function EditableTextWithButtons(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentlyValidated, setCurrentlyValidated] = useState(false);
    const [currentText, setCurrentText] = useState(props.initVal);
    const [lastSubmitted, setLastSubmitted] = useState(props.initVal);
    const [submiting, setSubmitings] = useState(false);


    const handleEditClick = () => {
        setIsEditMode(true);
    }
    const handleClearClick = () => {
        setIsEditMode(false);
        setCurrentText(lastSubmitted);
    }
    const handleChange = (event) => {
        setCurrentText(event.target.value)
        setCurrentlyValidated(props.validate(event.target.value))

    }
    const myHandleSubmit = () => {
        var cur = currentText;
        setSubmitings(true);
        if(props.handleSubmit(cur)) {
            setLastSubmitted(cur);
            setCurrentText(cur);
        }else{
          alert("Error Submiting " + props.label)
        }
        setIsEditMode(false);
        setSubmitings(false);

    }
    return (<Grid container>
        <Grid item md={9}>
            <TextField
                focused={isEditMode}
                defaultValue={lastSubmitted}
                InputProps={{
                    readOnly: !isEditMode && !submiting,
                }}
                onChange={handleChange}
                label={props.label}
                id="outlined-start-adornment"
                fullWidth
                value={currentText}
                error={!currentlyValidated && isEditMode}

            />
        </Grid>
        <Grid item md={3}>
            <Stack>
                {isEditMode && <Button onClick={handleClearClick} variant="outlined" component="span"
                                       style={{minWidth: 'fit-content', maxWidth: "20px"}}
                                       endIcon={<ClearIcon/>}/>}
                {isEditMode &&
                    <Button onClick={myHandleSubmit} variant="contained" component="span"
                            style={{minWidth: 'fit-content', maxWidth: "20px"}}
                            endIcon={<CheckIcon/>}
                            disabled={!currentlyValidated}/>}
                {!isEditMode && <Button onClick={handleEditClick} variant="outlined" component="span"
                                        style={{minWidth: 'fit-content', maxWidth: "20px"}} endIcon={<EditIcon/>}
                />}

            </Stack>
        </Grid>

    </Grid>)


}

EditableTextWithButtons.defaultProps = {
    //the initial value of the field
    initVal: "",
    //validation function for the field
    validate: (s) => true,
    //label of field
    label: "field",
    //handle submition return true if everything was ok
    handleSubmit: (s) => {return true},
    //is passwor
    password:false

}