import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
// material
import { Button, Container, Stack, Typography, Divider, Card, Grid } from '@mui/material';

// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Training() {
  return (
    <Page title="Calendar | Learnigo">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Calendar
          </Typography>
        </Stack>
      </Container>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: 'event 1', date: '2022-04-19' },
          { title: 'event 2', date: '2022-04-02' }
        ]}
      />
    </Page>
  );
}
