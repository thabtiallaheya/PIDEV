// material
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import Card from '@mui/material/Card';
// components
import Page from '../components/Page';
import { CourseForm } from '../sections/@dashboard/course/editCourseForm';

import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import VideoPlayer from 'react-video-js-player';

import './course.css';
// material
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Stack from '@mui/material/Stack';
// components
import { AppNewsUpdate } from '../sections/@dashboard/app';
import PDFViewer from 'pdf-viewer-reactjs';

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

export default function EditCourse() {
  const [course, setCourse] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // console.log(id);
    axios.get(`http://localhost:8081/api/course/getOne/${id}`).then((response) => {
      setCourse(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <RootStyle title="New Course | Minimal-UI">
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Edit course.
            </Typography>
          </Box>
          {course && <CourseForm {...course} />}
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
