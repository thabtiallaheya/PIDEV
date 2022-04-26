import { faker } from '@faker-js/faker';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import React , {useEffect,useState} from 'react'
// material
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert } from '@mui/material';
import { AlertTitle } from '@mui/material';
//import Box from '@mui/material/Box';
//import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
//import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
import { mockImgCover } from '../../../utils/mockImages';
//
import Scrollbar from '../../../components/Scrollbar';
import Iconify from '../../../components/Iconify';
import { LoadingButton } from '@mui/lab';


// ----------------------------------------------------------------------

const NEWS = [...Array(5)].map((_, index) => {
  const setIndex = index + 1;
  return {
    title: faker.name.title(),
    description: faker.lorem.paragraphs(),
    image: mockImgCover(setIndex),
    postedAt: faker.date.soon()
  };
});

// ----------------------------------------------------------------------

/*NewsItem.propTypes = {
  news: PropTypes.object.isRequired
};*/

/*function NewsItem(props) {
  
  //const { image, title, description, postedAt } = news;
 
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={props.val.name}
        src={`http://localhost:8081/${props.val.image}`}
        sx={{ width: 48, height: 48, borderRadius: 1.5 }}
      />
          
      <Box sx={{ minWidth: 450 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
          {props.val.name}
          </Typography>
        </Link>
      
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
        {props.val.tag}
        </Typography>
      </Box>
  
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
      {props.val.price} TND
      </Typography>
      <Button onClick= {() => ondelete2(props.key)} variant="outlined" startIcon={<DeleteIcon />}>
                           Delete
                          </Button>
    </Stack>
  );
}*/

export default function AppNewsUpdate() {

  const [open, setOpen] = React.useState(true);

   //carts
   var storedTraining = JSON.parse(sessionStorage.getItem("trainingInStorage"))
   const [cardList, setCardList] = useState(storedTraining)
   const clearCart = () => {
    sessionStorage.clear();
   
   }

   const ondelete2 = (id) => {
    const itemsInCart = JSON.parse(sessionStorage.getItem('trainingInStorage'));
    itemsInCart.splice(id, 1);
    sessionStorage.setItem('trainingInStorage', JSON.stringify(itemsInCart))
    //removeItem(id)
   }
    let total = 0;
    const Sum  = () => {
       for (let i = 0 ; i<storedTraining.length ; i++ )
       {
         total = total + storedTraining[i].price;
       }
   
    return  total ;
  
       }  
 
       if(storedTraining == null || sessionStorage == null) return(
         <div>
           <Alert severity="info">
  <AlertTitle>Info</AlertTitle>
  
  Your cart is still empty <strong>fill it up!</strong> 
</Alert>
          
       <Box sx={{ p: 2, textAlign: 'right' }}>
       <Button
         to="#"
         size="small"
         color="inherit"
         component={RouterLink}
         endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
       >
           <h3> total 0 TND </h3> 
       </Button>
     </Box>
         </div>
       )
  
  return (
    <Card>
      <CardHeader title="News Update" />
      {/*<Alert variant="filled" severity="success">
  This is a success alert — check it out!
  </Alert>*/}
<Box sx={{ width: '100%' }}>
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
          These trainings are successfully added in your cart !
        </Alert>
      </Collapse>
      <Button
        disabled={open}
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Re-open
      </Button>
    </Box>

      <Scrollbar>
      
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {cardList.map((val, key) => (
            <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              alt={val.name}
              src={`http://localhost:8081/${val.image}`}
              sx={{ width: 48, height: 48, borderRadius: 1.5 }}
            />
                
            <Box sx={{ minWidth: 450 }}>
              <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                <Typography variant="subtitle2" noWrap>
                {val.name}
                </Typography>
              </Link>
            
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {val.tag}
              </Typography>
            </Box>
        
            <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
            {val.price} TND
            </Typography>
           {/*  <LoadingButton 
            align="right"
            size="small"
            type="submit"
            variant="contained"
            //onClick={()=> emptyCart()}
            onClick= {() => ondelete2(key)}
            startIcon={<DeleteIcon />}
            
          >
           {<DeleteIcon />} Delete
          </LoadingButton> */}
            <Button onClick= {() => ondelete2(key)} variant="outlined" >
            <DeleteIcon /> Retrieve
                                </Button>
          </Stack>
          
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <LoadingButton 
            align="right"
            size="small"
            type="submit"
            variant="contained"
            //onClick={()=> emptyCart()}
            onClick={()=> clearCart()}
            
          >
           {<DeleteIcon />} Clear Carts
          </LoadingButton>
        <Button
          to="#"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
            <h3> total {Sum()} TND </h3> 
        </Button>

        </Stack>
       
      </Box>
    </Card>
  );
}
