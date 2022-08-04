import React, {useEffect, useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {setAppErrorAC, TextErrorType} from "../../state/app-reducer";
import {useAppDispatch} from "../../app/hooks";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {
    const error = useSelector<AppRootStateType, TextErrorType>(state => state.app.error)
    const [open, setOpen] = useState(true);
    const dispatch = useAppDispatch()
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppErrorAC(null))
        setOpen(false);
    };
    
    useEffect(() => {
        setTimeout(() => {
            console.log("useEffect")
            dispatch(setAppErrorAC(null))
        }, 4000)
    }, [dispatch, error])
    
    return (
        <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                Error message 😠: {error}
            </Alert>
        </Snackbar>
    );
}
