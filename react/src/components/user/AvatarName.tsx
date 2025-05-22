import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { blue } from '@mui/material/colors';
import { useContext } from 'react';
import { UserContext } from '../main/contexUser';

export default function FallbackAvatars() {
  const contex = useContext(UserContext);
  const user = localStorage.getItem("userName") || contex?.state.name

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        sx={{
          bgcolor: blue[800],
          position: 'fixed',
          top: 15,
          left: 50,
          zIndex: 2
        }}
        alt="Remy Sharp"
        src="/broken-image.jpg">
        {user?.charAt(0).toUpperCase()}
      </Avatar>
    </Stack>
  );
}
