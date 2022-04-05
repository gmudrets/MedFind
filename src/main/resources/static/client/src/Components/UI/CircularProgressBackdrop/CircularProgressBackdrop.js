import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import {useEffect} from "react";

export default function CircularProgressBackdrop(props) {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    const handleClose = () => {
        setOpen(false);
        props.toggle(false);
    };

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}