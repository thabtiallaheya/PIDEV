// material
import { Grid, Container, Stack, Typography } from '@mui/material';
// components
import AccountProfile from '../sections/account/AccountProfile';
import AccountProfileDetails from '../sections/account/AccountProfileDetails';
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function Account() {
  return (
    <Page title="Account">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              <AccountProfile />
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <AccountProfileDetails />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Page>
  );
}
