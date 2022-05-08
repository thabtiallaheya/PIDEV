// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import { CartProvider } from 'react-use-cart';
import { useState } from 'react';
import DashboardNavbarStudent from 'src/layouts/dashboard/DashboardNavbarStudent';
import DashboardSidebarStudent from 'src/layouts/dashboard/DashboardSidebarStudent';
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function CardComponent() {
  const [open, setOpen] = useState(false);
  return (
    <Page title="Dashboard | Minimal-UI">
      <DashboardNavbarStudent onOpenSidebar={() => setOpen(true)} />

      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>

        <Grid item xs={12} md={6} lg={8}>
          <CartProvider>
            <AppNewsUpdate />
          </CartProvider>
        </Grid>
      </Container>
    </Page>
  );
}
