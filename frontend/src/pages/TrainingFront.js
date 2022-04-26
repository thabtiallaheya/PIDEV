import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './Training.css';
// material
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
//import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Container, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useCart } from "react-use-cart";

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import DashboardNavbarStudent from 'src/layouts/dashboard/DashboardNavbarStudent';
import DashboardSidebarStudent from 'src/layouts/dashboard/DashboardSidebarStudent';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function TrainingFront() {
  const [open, setOpen] = React.useState(true);
  const { isEmpty,totalUniqueItems,totalItems,cartTotal,updateItemQuantity,removeItem,emptyCart } = useCart();
  //carts
  const { addItem , items } = useCart();
  const [training, setTraining] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8081/api/training/getAll').then((response) => {
      setTraining(response.data);
      // console.log(response.data);
    });
  }, []);
//carts
  let itemsInCart = [];
  let numberOfCart = 0;
  const addData = (val)=>{
   //numberOfCart = numberOfCart +1;
    //setNumber(numberOfCart);
   //save in sessionstorage
   itemsInCart.push(val);
   let bookStringified = JSON.stringify(itemsInCart);
   sessionStorage.setItem('trainingInStorage', bookStringified)
   localStorage.setItem('trainingInStorage', bookStringified)

  //addItem(val);
    console.log(itemsInCart);
  }

  const [pageNumber, setPageNumber] = useState(0);
  const trainingsPerPage = 8;
  const pagesVisited = pageNumber * trainingsPerPage;
  const displayTrainings = training
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
              <Typography gutterBottom variant="h5" component="div">
                {training.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {training.description}
              </Typography>
            </CardContent>
            <CardActions>
           
              <Button size="small"  onClick={() => {
                addData(training)
              }} ><AddShoppingCartIcon/>  </Button>
               <Button size="small" component={RouterLink} to={`/training/details/front/${training._id}`}>
                Learn More
              </Button>
                <Button size="small" onClick={()=>addItem(training)} >
                <ShoppingCartCheckoutIcon/>
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
    <Page title="Dashboard: Training | Learnigo">
      <Container>
      <DashboardNavbarStudent onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebarStudent isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Training
          </Typography>
   
          <Box sx={{ width: '50%' }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
           Total price of {/*totalItems*/} carts : {/*cartTotal*/} TND
        </Alert>
      </Collapse>
      <Button
        disabled={open}
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        My Cart {<ShoppingCartIcon />}
      </Button>
    </Box>
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
