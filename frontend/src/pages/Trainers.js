import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

export const Trainer = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingArray, setLoadingArray] = React.useState([]);
  const [trainers, setTrainers] = React.useState([]);
  let navigate = useNavigate();
  const [status, setStatus] = React.useState(null);
  const user = useSelector((state) => state.user);

  const handleFollowClick = async (mentor, isFollowed) => {
    setLoadingArray([...loadingArray, mentor._id]);
    const genericErrorMessage = 'Something went wrong! Please try again later.';
    try {
      const response = await fetch(
        isFollowed ? 'http://localhost:8081/users/unfollow' : 'http://localhost:8081/users/follow',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student: user.id, mentor: mentor._id })
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        if (isFollowed) {
          let item = mentor.followers.indexOf(user.id);
          mentor.followers.splice(item, 1);
          item = user.following.indexOf(mentor._id);
          user.following.splice(item, 1);
        } else {
          mentor.followers.push(user.id);
          user.following.push(mentor._id);
        }
        setStatus({ type: 'success', message: 'Updated succesfully' });
      } else {
        setStatus({ type: 'error', message: data?.message || genericErrorMessage });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error || genericErrorMessage });
    }
    const item = loadingArray.indexOf(mentor._id);
    const temp = loadingArray;
    temp.splice(item, 1);
    setLoadingArray(temp);
  };

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8081/users/trainers');
        const data = await response.json();
        setTrainers(data.trainers);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <Container>
      <Snackbar open={!!status} autoHideDuration={6000} onClose={() => setStatus(null)}>
        <Alert onClose={() => setStatus(null)} severity={status?.type} sx={{ width: '100%' }}>
          {status?.message}
        </Alert>
      </Snackbar>
      <Typography gutterBottom variant="h2" component="div">
        Trainers
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {trainers.map((mentor) => {
            return (
              <Grid item xs={4} key={mentor._id}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea
                    onClick={() => navigate('/profile', { replace: true, state: mentor })}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      src={`http://localhost:8081/${mentor.photo}`}
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {mentor.firstName} {mentor.lastName}
                      </Typography>
                      <Typography noWrap variant="body2" color="text.secondary">
                        {mentor.bio}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <LoadingButton
                      loading={loadingArray.indexOf(mentor._id) !== -1}
                      size="small"
                      color="primary"
                      fullWidth
                      variant={user.following.indexOf(mentor._id) !== -1 ? 'outlined' : 'contained'}
                      onClick={() =>
                        handleFollowClick(mentor, user.following.indexOf(mentor._id) !== -1)
                      }
                    >
                      {user.following.indexOf(mentor._id) !== -1 ? 'Unfollow' : 'Follow'}
                    </LoadingButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};
