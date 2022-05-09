import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './course.css';


// material
import { Button, Container, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export default function Recommended() {
    const user = useSelector((state) => state.user);
    const [course, setCourse] = useState([]);
    // const [tag, setTag] = useState("IT")
    // const handleClick = () => setTag("Management")

    
  // var buttonText = "Management";


  // const handleChange = event => {
  //     this.setState({ id: event.target.value });
  // }
   
  
    useEffect(() => {
      axios(`http://152.228.172.32:5000/predict?course=IT`, {
          method: 'POST',
          mode: 'no-cors',
          headers: {"Access-Control-Allow-Origin": "*"}
      }).then(res => {
          console.log(res);
          console.log(res.data);
          setCourse(res.data);
      })
    }, []);
    
  const [pageNumber, setPageNumber] = useState(0);

  const coursesPerPage = 8;
  const pagesVisited = pageNumber * coursesPerPage;
  const displayCourses = course.slice(pagesVisited, pagesVisited + coursesPerPage).map((course) => {
    return (
      <Grid key="" item xs={12} sm={6} md={3}>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            height="140"
            image="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera.s3.amazonaws.com/media/coursera-rebrand-logo-square.png?auto=format%2Ccompress&dpr=1"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" noWrap>
              {course}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div" noWrap>
              <div dangerouslySetInnerHTML={{ __html: course.description }}></div>
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href="https://fr.coursera.org/learn/uva-darden-innovation-business-model-canvas">
              Learn More
            </Button>
            
          </CardActions>
        </Card>
      </Grid>
    );
  });
  const pageCount = Math.ceil(course.length / coursesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <Page title="Dashboard: Course | Learningo">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Course
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/course/new"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Course
          </Button>
          {/* <Button
            name="id" 
            value="Management"
            onClick = {handleClick}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Management
          </Button> */}
        </Stack>
      </Container>
      <Grid container spacing={3}>
        {displayCourses}
      </Grid>
      <br />
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'paginationBttns'}
        previousLinkClassName={'previousBttn'}
        nextLinkClassName={'nextBttn'}
        disabledClassName={'paginationDisabled'}
        activeClassName={'paginationActive'}
      />
    </Page>
  );
}
