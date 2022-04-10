import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

// material
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// components
import Page from '../components/Page';
import { UpdateTrainingForm } from '../sections/@dashboard/training/UpdateTrainingForm';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function UpdateTraining() {
  const [training, setTraining] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:8081/api/training/getOne/${id}`).then((response) => {
      setTraining(response.data);
    });
  }, []);
  return (
    <RootStyle title="New Training | Minimal-UI">
      <Container>
        <Typography variant="h4" gutterBottom>
          <IconButton aria-label="delete" component={RouterLink} to={`/training/details/${id}`}>
            <ArrowBackIcon />
          </IconButton>
          Back To Trainig
        </Typography>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Get started To Planifie your Trainig.
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Make with as New Training Session
            </Typography>
          </Box>
          {training.image && <UpdateTrainingForm training={training} />}
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
