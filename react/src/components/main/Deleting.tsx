import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Box, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type DeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title = "אישור מחיקה",
  description = "האם אתה בטוח שברצונך למחוק?",
}: DeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "right", color: "text.primary" }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose} color="inherit">
          ביטול
        </Button>
        <Button variant="contained" onClick={onConfirm} color="error">
          מחיקה
        </Button>
      </DialogActions>
    </Dialog>
  );
};
