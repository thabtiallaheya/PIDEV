import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import VideoPlayer from "react-video-js-player"

import "./course.css"
// material
import { Box, Grid, Container, Typography } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Stack from '@mui/material/Stack';
// components
import Page from '../components/Page';
import { AppNewsUpdate } from '../sections/@dashboard/app';
import PDFViewer from 'pdf-viewer-reactjs'
export default function CourseDetails() {
  const [course, setCourse] = useState(null);
  const { id } = useParams();


  useEffect(() => {
    // console.log(id);
    axios.get(`http://localhost:3001/api/course/getOne/${id}`).then((response) => {
      setCourse(response.data);
      console.log(response.data);
    });
  }, []);

  let deleteCourse = () => {
    axios.delete(`http://localhost:3001/api/course/delete/${id}`).then((response) => {
      // setCourse(response.data);
      window.location.href = "/dashboard/course"
      console.log(response.data);
    });
  }

  return (
    <Page title=" Course Details | Minimal-UI">
      {course &&
        <Container maxWidth="xl">
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid md={8}>
              <Paper
                sx={{
                  p: 2,
                  margin: 'auto',
                  maxWidth: 800,
                  flexGrow: 1,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
                }}
              >
                <Grid container spacing={2}>
                  {/* <VideoPlayer src={course.video} width="720"
                    height="420"
                    playBackRates={[0.5, 1, 1.25, 1.5, 2]} />

                  <a href={course.pdf} download>Click to download</a> */}

                  <Grid item md={12} container>
                    <Grid item xs container direction="column" spacing={1}>
                      <Grid item xs>
                        
                        <Typography gutterBottom variant="h4">
                           course : {course.name}
                        </Typography>
                        <div className="p-2"></div>
                      </Grid>
                    </Grid>
                  </Grid>

                  {course.files.map(item =>
                    item.endsWith(".mp4") ?
                      <Grid item md={12}>
                        <video height="300" controls>
                          <source src={`http://localhost:3001/${item.replace(/\\/, "/")}`} type="video/mp4" />
                        </video>
                      </Grid> :
                      item.endsWith(".pdf") ?
                        <Grid item md={6}>
                          <PDFViewer
                            document={{
                              url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf',
                            }}
                            scale={.5}
                            hideNavbar
                            hideZoom
                            hideRotation
                            style={{ height: 100 }}
                            css={"pdfViewer"}
                            canvasCss={"pdfViewer"}
                          />
                        </Grid> :
                        <Grid item md={4}>
                          <img
                            style={{ height: 150, objectFit: "cover", objectPosition: "50% 50%" }}
                            src={`http://localhost:3001/${item.replace(/\\/, "/")}`} />
                        </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
            <Grid item md={4}>
              <Paper
                sx={{
                  p: 2,
                  margin: 'auto',
                  maxWidth: 500,
                  flexGrow: 1,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
                }}
              >
                <Grid item direction="column" spacing={6}>
                <Typography variant="body1" color="text.secondary">
                          tag: {course.tag}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                         <div dangerouslySetInnerHTML={{ __html: course.description }}>

                          </div>
                        </Typography>
                  <Typography variant="subtitle1" component="div">
                  Price: {course.price} DT
                  </Typography>
                </Grid>
              </Paper>
              <Stack direction="row" spacing={2}>
                <Button onClick={deleteCourse} variant="outlined" startIcon={<DeleteIcon />}>
                  Delete
                </Button>
                <Button
                  component={RouterLink}
                  to={`/dashboard/course/edit/${course._id}`} variant="contained" endIcon={<ModeEditIcon />}>
                  Update
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      }
    </Page>
  );
}
