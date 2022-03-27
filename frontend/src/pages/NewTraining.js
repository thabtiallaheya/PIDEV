// material
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { TrainingForm } from '../sections/@dashboard/training/TrainingForm';

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

export default function NewTraining() {
  return (
    <RootStyle title="New Training | Minimal-UI">
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Get started To Planifie your Trainig.
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Make with as New Training Session
            </Typography>
          </Box>
          <TrainingForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
