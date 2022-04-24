import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';

export const Trainer = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [trainers, setTrainers] = React.useState([]);
  let navigate = useNavigate();

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
      <Typography gutterBottom variant="h2" component="div">
        Trainers
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {trainers.map((user) => {
            return (
              <Grid item xs={4} key={user._id}>
                <Card
                  sx={{ maxWidth: 345 }}
                  onClick={() => navigate('/profile', { replace: true, state: user })}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      src={`http://localhost:8081/${user.photo}`}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography noWrap variant="body2" color="text.secondary">
                        {user.bio}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      follow
                    </Button>
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
