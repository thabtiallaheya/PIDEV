import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Typography
} from '@mui/material';
import * as React from 'react';
import { Photo } from './Photo';
import { TopSection } from './TopSection';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import parse from 'html-react-parser';
import { Link as RouterLink } from 'react-router-dom';

export const Profile = () => {
  const location = useLocation();
  const mentor = location.state;
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFollowed, setIsFollowed] = React.useState(
    mentor.followers?.find((element) => element === user.id)
  );
  const [courses, setCourses] = React.useState([]);
  const [status, setStatus] = React.useState(null);

  const handleFollowClick = async () => {
    setIsLoading(true);
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
        setIsFollowed(!isFollowed);
        setStatus({ type: 'success', message: 'Updated succesfully' });
      } else {
        setStatus({ type: 'error', message: data?.message || genericErrorMessage });
      }
    } catch (error) {
      console.log(error);
      setStatus({ type: 'error', message: error || genericErrorMessage });
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/api/trainings/user/${mentor._id}`);
        const data = await response.json();
        setCourses(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, [mentor._id]);

  return (
    <Container>
      <Snackbar open={!!status} autoHideDuration={6000} onClose={() => setStatus(null)}>
        <Alert onClose={() => setStatus(null)} severity={status?.type} sx={{ width: '100%' }}>
          {status?.message}
        </Alert>
      </Snackbar>
      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <Grid container spacing={6}>
          <Grid item md={4} xs={8}>
            <Box mb={4}>
              <Photo url={`http://localhost:8081/${mentor.photo}`} />
            </Box>
            <LoadingButton
              fullWidth
              loading={isLoading}
              variant={isFollowed ? 'outlined' : 'contained'}
              onClick={handleFollowClick}
            >
              {isFollowed ? 'Unfollow' : 'Follow'}
            </LoadingButton>
          </Grid>
          <Grid item lg={8} xs={8}>
            <TopSection
              name={`${mentor.firstName} ${mentor.lastName}`}
              phone={mentor.phone}
              bio={mentor.bio}
              followers={mentor.followers?.length || 0}
              skills={mentor.skills}
            />
          </Grid>
        </Grid>
      </Stack>
      <Typography gutterBottom variant="h2" component="div">
        Trainings
      </Typography>
      <Grid container spacing={3}>
        {courses?.map((training) => (
          <Grid key={training._id} item xs={12} sm={6} md={3}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:8081/${training.image}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {training.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div" noWrap>
                  {training.name}
                </Typography>
              </CardContent>
              <Divider variant="middle" />
              <CardActions style={{ justifyContent: 'center' }}>
                <Button
                  size="small"
                  component={RouterLink}
                  to={`/training/details/${training._id}`}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
