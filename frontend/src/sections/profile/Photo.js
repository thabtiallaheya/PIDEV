import * as React from 'react';
import { Avatar } from '@mui/material';

export const Photo = ({ url }) => {
  return <Avatar alt="user photo" src={url} sx={{ height: '300px', width: '300px' }} />;
};
