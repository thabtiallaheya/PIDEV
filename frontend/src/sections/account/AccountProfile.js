import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Snackbar,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from 'src/features/User/UserSlice';

export default function AccountProfile(props) {
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState(null);
  const user = useSelector((state) => state.user);
  const [status, setStatus] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (photo) {
      setImageUrl(URL.createObjectURL(photo));
    }
  }, [photo]);

  const onSubmit = async () => {
    if (photo) {
      const formData = new FormData();
      formData.append('photo', photo);
      console.log(user.id);
      formData.append('id', user.id);
      const genericErrorMessage = 'Something went wrong! Please try again later.';

      try {
        const response = await fetch('http://localhost:8081/users/upload-photo', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (response.status === 200) {
          setStatus({ type: 'success', message: 'Image updated succesfully' });
          dispatch(
            login({
              ...user,
              photo: `http://localhost:8081/${data}`
            })
          );
          setPhoto(null);
        } else {
          setStatus({ type: 'error', message: data?.message || genericErrorMessage });
        }
      } catch (error) {
        setStatus({ type: 'error', message: genericErrorMessage });
      }
    }
  };

  return (
    <Card {...props}>
      <Snackbar open={!!status} autoHideDuration={6000} onClose={() => setStatus(null)}>
        <Alert onClose={() => setStatus(null)} severity={status?.type} sx={{ width: '100%' }}>
          {status?.message}
        </Alert>
      </Snackbar>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.photo}
            sx={{
              height: 64,
              mb: 2,
              width: 64
            }}
          />
          <Typography color="textPrimary" gutterBottom variant="h5">
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {`${user.city} ${user.country}`}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {user.timezone}
          </Typography>
        </Box>
      </CardContent>
      {imageUrl && photo && (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
          textAlign="center"
        >
          <div>New Image Preview:</div>
          <img src={imageUrl} alt={photo.name} height="100px" />
        </Box>
      )}
      <Divider />
      <CardActions>
        <Button fullWidth component="label">
          Choose an image
          <input
            type="file"
            hidden
            accept=".png, .jpg, .jpeg"
            name="photo"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </Button>
        <Button color="primary" fullWidth variant="contained" disabled={!photo} onClick={onSubmit}>
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
