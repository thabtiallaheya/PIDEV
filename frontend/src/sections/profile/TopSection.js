import { Typography } from '@mui/material';
import * as React from 'react';

export const TopSection = ({ name, phone, bio, followers }) => {
  return (
    <>
      <Typography variant="h2" gutterBottom>
        {name}
      </Typography>
      {followers && (
        <Typography variant="h4" gutterBottom>
          followers: {followers}
        </Typography>
      )}
      <Typography variant="body1">{bio}</Typography>
    </>
  );
};
