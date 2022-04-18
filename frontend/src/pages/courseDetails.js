import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import VideoPlayer from "react-video-js-player"
import { Player } from 'video-react';
import "./course.css";

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

export default function CourseDetails() {
  const [course, setCourse] = useState([]);
  const { id } = useParams();

    const handleButtonClick = () => {
        axios.delete(`http://localhost:3001/api/course/delete/${id}`)
            .then((res)=> {
                console.log(res);
            });
    }
  useEffect(() => {
    // console.log(id);
    axios.get(`http://localhost:3001/api/course/getOne/${id}`).then((response) => {
      setCourse(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <Page title=" Course Details | Minimal-UI">
      <Container maxWidth="xl">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} md={8}>
            <Paper
              sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonBase>
                    {course.image && (
                      <CardMedia
                        component="img"
                        image={`http://localhost:3001/${course.image}`}
                      />

                    )}
                  </ButtonBase>
                </Grid>
                  <div className="player-wrapper" >
                  <Player  className="react-player"
                      poster="/assets/poster.png"
                           width="100%"
                           height="100%"
                      src="https://res.cloudinary.com/learningo/video/upload/v1649129633/pnabmmtqpsv3aawf6uti.mp4"
                  />
                  );
                  </div>

          <a href={course.pdf} download>Click to download</a>

                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={1}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1" component="div">
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.tag}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {course.description}
                      </Typography>

          <div className="p-2"></div>
                    </Grid>
                    { <Grid item>
                      <Typography sx={{ cursor: 'pointer' }} variant="body2">
                        Remove
                      </Typography>
                    </Grid> }
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper
              sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
              }}
            >
              <Grid item>
                    <Typography variant="subtitle1" component="div">
                      DT{course.price}
                    </Typography>
                  </Grid>
            </Paper>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<DeleteIcon />} >
                Delete
              </Button>
              <Button variant="contained" endIcon={<ModeEditIcon />}>
                Update
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
