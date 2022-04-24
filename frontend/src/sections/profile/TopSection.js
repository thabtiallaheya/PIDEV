import { Box, Chip, Typography } from '@mui/material';
import * as React from 'react';

export const TopSection = ({ name, bio, followers, skills }) => {
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
      <Box mt={4} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {skills?.map((name) => (
          <Chip key={name} label={name} />
        ))}
      </Box>
    </>
  );
};
