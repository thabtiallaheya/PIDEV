import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
// material
import { Button, Container, Stack, Typography, Divider, Card, Grid } from '@mui/material';

// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Calendar() {
  const user = useSelector((state) => state.user);
  const [training, setTraining] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8081/api/trainings/user/${user.id}`).then((response) => {
      setTraining(response.data);
      console.log(response.data);
    });
  }, []);
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
        events={training.map((t) => ({ title: t.name, date: t.scheduledDate }))}
      />
    </Page>
  );
}
