import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './Training.css';
// material
import {
  Button,
  Container,
  Stack,
  Typography,
  Divider,
  Card,
  Grid,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import openSocket from 'socket.io-client';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';

// components
import Page from '../components/Page';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Trainings() {
  const user = useSelector((state) => state.user);
  const [training, setTraining] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allChecked, setAllChecked] = useState(true);
  const socket = openSocket('http://localhost:8000');
  useEffect(() => {
    axios
      .get(
        allChecked
          ? `http://localhost:8081/api/training/getAll `
          : `http://localhost:8081/api/trainings/participat/${user.id}`
      )
      .then((response) => {
        setTraining(response.data);
      });
    // socket.on('refresh', () => {
    //   axios.get(`http://localhost:8081/api/training/getAll`).then((response) => {
    //     setTraining(response.data);
    //   });
    // });
  }, [allChecked]);
  const [pageNumber, setPageNumber] = useState(0);
  //carts
  let itemsInCart = [];
  let numberOfCart = 0;
  const addData = (val) => {
    itemsInCart.push(val);
    let bookStringified = JSON.stringify(itemsInCart);
    sessionStorage.setItem('trainingInStorage', bookStringified);
    localStorage.setItem('trainingInStorage', bookStringified);
    console.log(itemsInCart);
  };

  const trainingsPerPage = 8;
  const pagesVisited = pageNumber * trainingsPerPage;
  const displayTrainings = training
    .filter((val) => {
      if (searchTerm == '') {
        return val;
      } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      }
    })
    .slice(pagesVisited, pagesVisited + trainingsPerPage)
    .map((training) => {
      return (
        <Grid key={training._id} item xs={12} sm={6} md={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image={`http://localhost:8081/${training.image}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" noWrap>
                {training.name}
              </Typography>
              <Divider variant="middle" />
              <Typography variant="body2" color="text.secondary" component="div" noWrap>
                Created by{' '}
                <b>
                  {' '}
                  {training?.trainer?.firstName} {training?.trainer?.lastName}
                </b>
              </Typography>
              {/* <Typography variant="body2" color="text.secondary" component="div" noWrap>
                {parse(training.description)}
              </Typography> */}
            </CardContent>
            <Divider variant="middle" />
            <CardActions style={{ justifyContent: 'center' }}>
              <Button size="small" component={RouterLink} to={`/training/details/${training._id}`}>
                Learn More
              </Button>
              <Button
                size="small"
                onClick={() => {
                  addData(training);
                }}
              >
                add to cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
  const pageCount = Math.ceil(training.length / trainingsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <Page title="Training | Learnigo">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Trainings
          </Typography>
        </Stack>
      </Container>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <Input
              id="standard-adornment-amount"
              placeholder="Search ...."
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              startAdornment={<Icon icon="pepicons:loop" width="50" height="50" />}
            />
          </FormControl>
        </Stack>
        <Stack mb={5}>
          <FormControlLabel
            control={<Checkbox checked={allChecked} onClick={() => setAllChecked(!allChecked)} />}
            label="Show all trainings"
          />
        </Stack>
      </Container>
      <Grid container spacing={3}>
        {displayTrainings}
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
