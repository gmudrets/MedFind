import * as React from 'react';
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";

export default function SettingsCheckBox(props) {
    return (
        <FormGroup>
            <FormControlLabel
                control={<Checkbox defaultChecked={ props.initialyChecked} style={{
                    transform: "scale(1.1)",
                }}/>}
                label={props.label}
                labelPlacement="end"
                onChange={props.onChange}
                on

            />
        </FormGroup>
    );
}