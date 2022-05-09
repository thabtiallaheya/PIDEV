import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { RegisterForm } from '../sections/authentication/register';
import AuthSocial from '../sections/authentication/AuthSocial';
import CreateActivity from 'src/sections/authentication/activities/CreateActivity';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function CreateAct() {
  return (
    <RootStyle title="Create Activity | Minimal-UI">
      <Container>
        <center>
          <Typography variant="h3" gutterBottom>
            👨‍🏫📝 Post new Activity
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Enter all the details below.</Typography>
        </center>
        <ContentStyle>
          <CreateActivity />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
