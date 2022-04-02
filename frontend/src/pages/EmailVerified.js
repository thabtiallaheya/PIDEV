import { motion } from 'framer-motion';
import { Link as RouterLink, useParams, useNavigate, Link } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { useEffect } from 'react';
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import Login from './Login';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function EmailVerified() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:8081/users/active', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (response.status !== 200) navigate('/404', { replace: true });
    })();
  }, [navigate, token]);
  return (
    <RootStyle title="Email Verified!">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Email Verified Successfully
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Email verified successfully you can now login into your account
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src="/static/illustrations/email-verified-illustration.jpeg"
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />
            </motion.div>

            <Link to="/login">
              <Button size="large" variant="contained">
                Go to login
              </Button>
            </Link>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
