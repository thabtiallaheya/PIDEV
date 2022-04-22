import { Box, Button, Container, Grid, Stack } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Photo } from './Photo';
import { TopSection } from './TopSection';

export const Profile = () => {
  const user = useSelector((state) => state.user);

  return (
    <Container>
      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <Grid container spacing={6}>
          <Grid item md={4} xs={8} gutterBottom>
            <Box mb={4}>
              <Photo url={user.photo} />
            </Box>
            <Button fullWidth variant="contained">
              Follow
            </Button>
          </Grid>
          <Grid item lg={8} xs={8}>
            <TopSection
              name={`${user.firstName} ${user.lastName}`}
              phone={user.phone}
              bio={user.bio}
              followers={user.followers?.length}
            />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};
