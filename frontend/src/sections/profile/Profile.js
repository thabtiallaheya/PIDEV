import { Box, Button, Container, Grid, Stack } from '@mui/material';
import * as React from 'react';
import { Photo } from './Photo';
import { TopSection } from './TopSection';
import { useLocation } from 'react-router-dom';

export const Profile = () => {
  const location = useLocation();
  const user = location.state;

  return (
    <Container>
      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <Grid container spacing={6}>
          <Grid item md={4} xs={8}>
            <Box mb={4}>
              <Photo url={`http://localhost:8081/${user.photo}`} />
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
              skills={user.skills}
            />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};
