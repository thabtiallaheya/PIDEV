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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Swal from 'sweetalert2';

//icon

import React from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
//import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
//tostify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// components
import Iconify from '../components/Iconify';
import DashboardNavbarStudent from 'src/layouts/dashboard/DashboardNavbarStudent';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Trainings() {
  toast.configure();
  var storedTraining = JSON.parse(sessionStorage.getItem('trainingInStorage'));
  var [itemCount, setItemCount] = React.useState(0);
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const [training, setTraining] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allChecked, setAllChecked] = useState(true);
  const socket = openSocket('http://localhost:8000');
  //window.location.reload(true);

  const itemsNumberFct = () => {
    setItemCount(itemCount + 1);
  };
  //carts
  //let itemCount = [];
  let itemsInCart = [];
  let numberOfCart = 0;
  const addData = (val) => {
    itemsInCart.push(val);
    let bookStringified = JSON.stringify(itemsInCart);
    sessionStorage.setItem('trainingInStorage', bookStringified);
    localStorage.setItem('trainingInStorage', bookStringified);

    //addItem(val);
    numberOfCart = numberOfCart + 1;
    if (numberOfCart == 1)
      toast.info(' Greate new training has been succussfully added to your cart ​​🛒​ ');
    else
      toast.success(
        ' Greate ' + numberOfCart + ' new trainings have been succussfully added to your cart ​🛒​ '
      );
    console.log(itemsInCart);

    //itemsNumberFct(val);
  };

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
              <Button
                size="small"
                onClick={() => {
                  //addData(training)
                  //window.location.reload(false);
                  //setItemCount(itemCount + 1);
                  addData(training);
                }}
              >
                add to cart
              </Button>
              <Button
                onClick={() => {
                  itemsNumberFct();

                  //setItemCount(itemCount + 1);
                }}
              >
                <AddShoppingCartIcon />
              </Button>
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

              {/**  <Button
            onClick={() => {
              setItemCount(Math.max(itemCount - 1, 0));
            }}
          >
            {" "}
            <RemoveIcon fontSize="small" />
          </Button> */}
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
