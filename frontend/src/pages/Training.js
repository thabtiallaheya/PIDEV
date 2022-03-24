import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Button, Container, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' }
];

// ----------------------------------------------------------------------

export default function Training() {
  const [training, setTraining] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3001/api/training/getAll').then((response) => {
      setTraining(response.data);
      // console.log(response.data);
    });
  }, []);
  return (
    <Page title="Dashboard: Training | Learnigo">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Training
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Training
          </Button>
        </Stack>
      </Container>
      <Grid container spacing={3}>
        {training.map((training) => (
          <Grid key={training._id} item xs={12} sm={6} md={3}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:3001/${training.image}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {training.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {training.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Page>
  );
}
