import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './course.css';

// material
import {
  Button,
  Chip,
  Container,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = ['Business', 'IT', 'Marketing', 'Management'];
export default function Recommended() {
  const user = useSelector((state) => state.user);
  const [course, setCourse] = useState([]);
  // const [tag, setTag] = useState("IT")
  // const handleClick = () => setTag("Management")

  // var buttonText = "Management";

  // const handleChange = event => {
  //     this.setState({ id: event.target.value });
  // }

  const [personName, setPersonName] = useState('IT');
  useEffect(() => {
    axios(`http://152.228.172.32:5000/predict?course=${personName}`, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Access-Control-Allow-Origin': '*' }
    }).then((res) => {
      console.log(res);
      console.log(res.data);
      setCourse(res.data);
    });
  }, [personName]);

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setPersonName(value);
  };

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
            <Button
              size="small"
              href="https://fr.coursera.org/learn/uva-darden-innovation-business-model-canvas"
            >
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

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium
    };
  }
  const theme = useTheme();

  return (
    <Page title="Dashboard: Course | Learningo">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Course
          </Typography>
          <CardContent></CardContent>
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
      <Stack alignItems="center" justifyContent="space-between" mb={5}>
        <InputLabel shrink>Tags</InputLabel>
        <Select
          fullWidth
          label="Tags"
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Chip key={selected} label={selected} />
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </Stack>
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
