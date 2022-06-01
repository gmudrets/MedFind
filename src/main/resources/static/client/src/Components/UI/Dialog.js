import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function AlertDialog(props) {

    const {
        open,
        setOpen,
        title,
        textContent,
        acceptButtonText,
        declineButtonText,
        onAccept,
    } = props;

    const handleClose = () => {
        setOpen(false);
    };

    const handleAccept = () => {
        onAccept && onAccept();
        setOpen(false);
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {textContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{declineButtonText}</Button>
                    <Button onClick={handleAccept} autoFocus>
                        {acceptButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AlertDialog;