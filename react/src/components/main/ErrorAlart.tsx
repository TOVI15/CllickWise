import * as React from 'react';
import { Alert, Stack, IconButton, AlertColor } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';



const ErrorAlert = ({ alertState, setAlertState }: {
    alertState: { open: boolean; message: string; severity: AlertColor };
    setAlertState: React.Dispatch<React.SetStateAction<{ open: boolean; message: string; severity: AlertColor }>>;
}) => {
    return (
        <Stack sx={{ width: '100%', top: 70, zIndex: 3, }} spacing={2} >
            <Alert

                severity={alertState.severity}
                action={
                    <IconButton

                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setAlertState(prev => ({ ...prev, open: false }))}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                {alertState.message}
            </Alert>
        </Stack>
    );
};

export default ErrorAlert;