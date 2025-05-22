import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography
} from '@mui/material';

type Props = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const DeleteDialog: React.FC<Props> = ({ open, onConfirm, onCancel }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>אישור מחיקה</DialogTitle>
            <DialogContent>
                <Typography>האם את בטוחה שברצונך למחוק את העובד?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>ביטול</Button>
                <Button onClick={onConfirm} color="error">מחק</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
