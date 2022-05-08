import React from 'react';
import axios from 'axios';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';

// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  ButtonBase,
  Paper,
  CardMedia,
  Button,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// components
import Page from '../components/Page';
import { format } from 'date-fns';

export default function TrainingsDetail() {
  const user = useSelector((state) => state.user);
  const [training, setTraining] = useState([]);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = React.useState(false);
  const [applyIn, setApplyIn] = React.useState(false);

  useEffect(async () => {
    setIsLoading(true);
    const response = await axios.get(`http://localhost:8081/api/training/getOne/${id}`);
    // console.log(response.data);
    setTraining(response.data);
    setDisable(new Date().getTime() === new Date(response.data.scheduledDate).getTime());
    setApplyIn(response.data.participants.find((p) => p === user.id) === user.id);
    setIsLoading(false);
  }, []);
  const navigate = useNavigate();
  const fDateTime = (date) => {
    return format(new Date(date), 'dd MMM yyyy HH:mm ');
  }; //carts
  let itemsInCart = [];
  let numberOfCart = 0;
  const applyToTraining = (t) => {
    axios
      .put(`http://localhost:8081/api/training/participantToTraining/${training._id}/${user.id}`, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'You apply to training with success',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          navigate(`/training`, { replace: true });
        }, 2000);
      });
  };
  const addData = (val) => {
    //numberOfCart = numberOfCart +1;
    //setNumber(numberOfCart);
    //save in sessionstorage
    itemsInCart.push(val);
    let bookStringified = JSON.stringify(itemsInCart);
    sessionStorage.setItem('trainingInStorage', bookStringified);
    localStorage.setItem('trainingInStorage', bookStringified);

    //addItem(val);
    console.log(itemsInCart);
  };
  return (
    <Page title=" Traning Details | Minimal-UI">
      <Container maxWidth="xl">
        {isLoading ? (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
          >
            <Grid item xs={3}>
              <CircularProgress color="success" />
            </Grid>
          </Grid>
        ) : (
          <>
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
                      {/* //flag:gb-4x3 */}
                      {training.language === 'French' && (
                        <Icon icon="twemoji:flag-france" width="20" height="20" />
                      )}
                      {training.language === 'English' && (
                        <Icon icon="flag:gb-4x3" width="20" height="20" />
                      )}{' '}
                      Language : {training.language}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {training.scheduledDate && (
                      <Typography variant="body2" color="text.secondary">
                        <Icon icon="icon-park:time" width="20" height="20" /> ScheduledDate :{' '}
                        {fDateTime(training.scheduledDate)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      <Icon icon="bi:box-arrow-in-down" width="20" height="20" />
                      Participants apply into: {training.nbrApplyInto}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      <Icon icon="heroicons-solid:user-group" width="20" height="20" />
                      Places available: {training.nbrParticipent}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      <Icon icon="el:screen" width="20" height="20" /> Duration: {training.duration}{' '}
                      Min
                    </Typography>
                  </Grid>
                  <Grid item>
                    {training.trainer?.firstName && training.trainer?.lastName && (
                      <Typography variant="body2" color="text.secondary">
                        <Icon icon="icon-park:user-business" width="20" height="20" /> Created by{' '}
                        <b>
                          {' '}
                          {training.trainer.firstName} {training.trainer.lastName}
                        </b>
                      </Typography>
                    )}
                  </Grid>
                  <Divider variant="middle" />
                  {applyIn && (
                    <Box sx={{ m: 2 }} justify="center">
                      <Stack spacing={2} display="flex" justifyContent="center" alignItems="center">
                        <Button
                          variant="contained"
                          startIcon={<Icon icon="ant-design:video-camera-add-outlined" />}
                          onClick={() => {
                            // applyToTraining(training);
                          }}
                          disabled={!disable}
                        >
                          join meeting now
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  {!applyIn && (
                    <Box sx={{ m: 2 }} justify="center">
                      <Stack spacing={2} display="flex" justifyContent="center" alignItems="center">
                        <Button
                          variant="contained"
                          startIcon={<Icon icon="bx:log-in-circle" />}
                          onClick={() => {
                            applyToTraining(training);
                          }}
                        >
                          join now
                        </Button>
                      </Stack>
                      <br></br>
                      <Divider variant="middle" />
                      <br></br>
                      <Stack spacing={2} display="flex" justifyContent="center" alignItems="center">
                        <Button
                          variant="outlined"
                          startIcon={<Icon icon="bx:cart-download" />}
                          onClick={() => {
                            addData(training);
                          }}
                        >
                          add to cart
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Page>
  );
}
