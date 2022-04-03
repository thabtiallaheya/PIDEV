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
import ShowDetail from 'src/sections/authentication/activities/ShowDetail';

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

export default function ShowDetailAct() {
  return (
    <RootStyle title="Create Activity | Minimal-UI">
      <Container>
        <Typography variant="h3" gutterBottom>
          📜 Activity to do
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          record the activity bellow 👇 pst d'ont forget to restore it before the limite date Good
          luck.
        </Typography>
        <br />
        <ShowDetail />
        <ContentStyle></ContentStyle>
      </Container>
    </RootStyle>
  );
}
