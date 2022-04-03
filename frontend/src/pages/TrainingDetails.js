import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

// material
import { Box, Grid, Container, Typography } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Stack from '@mui/material/Stack';
// components
import Page from '../components/Page';
import { AppNewsUpdate } from '../sections/@dashboard/app';

export default function TrainingDetails() {
  const [training, setTraining] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // console.log(id);
    axios.get(`http://localhost:8081/api/training/getOne/${id}`).then((response) => {
      setTraining(response.data);
      console.log(response.data);
    });
  }, []);
  return (
    <Page title=" Traning Details | Minimal-UI">
      <Container maxWidth="xl">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} md={8}>
            <Paper
              sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonBase>
                    {training.image && (
                      <CardMedia
                        component="img"
                        image={`http://localhost:8081/${training.image}`}
                      />
                    )}
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={1}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1" component="div">
                        {training.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {training.tag}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {training.description}
                      </Typography>
                    </Grid>
                    {/* <Grid item>
                      <Typography sx={{ cursor: 'pointer' }} variant="body2">
                        Remove
                      </Typography>
                    </Grid> */}
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" component="div">
                      DT{training.price}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper
              sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
              }}
            >
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Language: {training.language}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  ScheduledDate: {training.scheduledDate}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Participant: {training.nbrParticipent}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Duration: {training.duration} Min
                </Typography>
              </Grid>
            </Paper>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<DeleteIcon />}>
                Delete
              </Button>
              <Button variant="contained" endIcon={<ModeEditIcon />}>
                Update
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
