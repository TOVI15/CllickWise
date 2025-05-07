import { CircularProgress, Box } from "@mui/material";

export function Spinner() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px", // גובה קבוע כדי למרכז באמצע
      }}
    >
      <CircularProgress
        thickness={5}
        size={70}
        sx={{
          color: (theme) => theme.palette.grey[400], // אפור כברירת מחדל
          animationDuration: "1.5s",
          '& svg': {
            color: "primary.main",
          }
        }}
      />
    </Box>
  );
}
