import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import { UserContext } from '../main/contexUser';

export default function FallbackAvatars() {
  const contex = useContext(UserContext);
  const user = localStorage.getItem("userName") || contex?.state.name

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        alt="Remy Sharp"
        src="/broken-image.jpg">
        {user?.charAt(0).toUpperCase()}
      </Avatar>
    </Stack>
  );
}
