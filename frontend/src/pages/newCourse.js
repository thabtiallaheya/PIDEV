// material
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import Card from '@mui/material/Card';
// components
import Page from '../components/Page';
import { CourseForm } from '../sections/@dashboard/course/courseForm';

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
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function NewCourse() {
  return (
    <RootStyle title="New Course | Minimal-UI">
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Add new Courses.
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Create course 
            </Typography>
          </Box>
          <CourseForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
