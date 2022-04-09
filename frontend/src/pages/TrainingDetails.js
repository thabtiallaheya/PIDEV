import axios from 'axios';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';

// material
import { Box, Grid, Container, Typography, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Stack from '@mui/material/Stack';
// components
import Page from '../components/Page';
import { format, formatDistanceToNow } from 'date-fns';

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
  const navigate = useNavigate();
  const deleteTraining = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00ab55',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8081/api/training/delete/${id}`);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        navigate('/training', { replace: true });
      }
    });
  };
  const fDateTime = (date) => {
    console.log(date);
    return format(new Date(date), 'dd MMM yyyy HH:mm ');
  };
  return (
    <Page title=" Traning Details | Minimal-UI">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <IconButton aria-label="delete" component={RouterLink} to="/training">
              <ArrowBackIcon />
            </IconButton>
            {training.name}
          </Typography>
        </Stack>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} md={8} justify="center">
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
                        justify="center"
                        component="img"
                        image={`http://localhost:8081/${training.image}`}
                      />
                    )}
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={1}>
                    <Grid item xs>
                      <Typography variant="body2" color="text.secondary">
                        {training.tag}
                      </Typography>
                      {training.description && (
                        <Typography variant="body2" gutterBottom component="div">
                          {parse(training.description)}
                        </Typography>
                      )}
                    </Grid>
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
                  Language : {training.language}
                </Typography>
              </Grid>
              <Grid item>
                {training.scheduledDate && (
                  <Typography variant="body2" color="text.secondary">
                    ScheduledDate : {fDateTime(training.scheduledDate)}
                  </Typography>
                )}
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
              <Divider variant="middle" />
              <Box sx={{ m: 2 }} justify="center" justifyContent="space-between">
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      deleteTraining(training._id);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<ModeEditIcon />}
                    component={RouterLink}
                    to={`/training/update/${training._id}`}
                  >
                    Update
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
