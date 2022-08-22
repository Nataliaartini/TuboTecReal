import React from "react";

import {Alert, Button, IconButton, Snackbar,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ResultMessage(props){

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={props.onClose}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={props.onClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                open={props.open}
                autoHideDuration={6000}
                onClose={props.onClose}
                message={props.message}
                action={action}
            >
                <Alert
                    onClose={props.onClose}
                    severity={props.severity}
                    sx={{ width: "100%" }}
                >
                    {props.message}
                </Alert>
            </Snackbar>
        </div>
    );
}