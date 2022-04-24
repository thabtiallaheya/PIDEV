import { Alert, Box, Container, Grid, Snackbar, Stack } from '@mui/material';
import * as React from 'react';
import { Photo } from './Photo';
import { TopSection } from './TopSection';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { login } from 'src/features/User/UserSlice';

export const Profile = () => {
  const location = useLocation();
  const mentor = location.state;
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFollowed, setIsFollowed] = React.useState(
    mentor.followers?.find((element) => element === user.id)
  );
  const dispatch = useDispatch();
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
          dispatch(
            login({
              ...user
            })
          );
        } else {
          mentor.followers.push(user.id);
          user.following.push(mentor._id);
          dispatch(
            login({
              ...user
            })
          );
        }
        setIsFollowed(!isFollowed);
        setStatus({ type: 'success', message: 'Updated succesfully' });
      } else {
        setStatus({ type: 'error', message: data?.message || genericErrorMessage });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error || genericErrorMessage });
    }
    setIsLoading(false);
  };

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
    </Container>
  );
};
