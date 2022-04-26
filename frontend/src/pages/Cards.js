import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Alert } from '@mui/material';
import { AlertTitle } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
//
import USERLIST from '../_mocks_/user';
import { useCart } from 'react-use-cart';
import { CartProvider } from 'react-use-cart';

// ----------------------------------------------------------------------
//carts

const TABLE_HEAD = [
  { id: 'image', label: 'Image', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'tag', label: 'Tag', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  //{ id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Cards() {
  //carts
  const {
    isEmpty,
    totalUniqueItems,
    items,
    totalItems,
    cartTotal,
    updateItemQuantity,
    removeItem,
    emptyCart
  } = useCart();

  var storedTraining = JSON.parse(localStorage.getItem('trainingInStorage'));
  const [cardList, setCardList] = useState(storedTraining);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //carts
  const ondelete = (id) => {
    //remove from localstorage
    const itemsInCart = JSON.parse(localStorage.getItem('trainingInStorage'));
    itemsInCart.splice(id, 1);
    localStorage.setItem('trainingInStorage', JSON.stringify(itemsInCart));
    setCardList(itemsInCart);
    //removeItem(id);
  };
  const ClearCart = () => {
    localStorage.clear();
  };
  let total = 0;
  const Sum = () => {
    for (let i = 0; i < storedTraining.length; i++) {
      total = total + storedTraining[i].price;
    }

    return total;
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  //if(isEmpty)
  if (storedTraining == null || localStorage == null)
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        carts list is empty <strong>check it out!</strong>
      </Alert>
    );
  return (
    <Page title="Carts | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Carts List
          </Typography>
          Total price of all carts is: {Sum()} TND
          <LoadingButton
            align="right"
            size="small"
            type="submit"
            variant="contained"
            //onClick={()=> emptyCart()}
            onClick={() => ClearCart()}
          >
            {<DeleteIcon />} Clear Carts
          </LoadingButton>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {cardList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => {
                      //const { id, name, role, status, company, avatarUrl, isVerified } = row;
                      //const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={index}
                          tabIndex={-1}
                          role="checkbox"
                          //selected={isItemSelected}
                          //aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                            // checked={isItemSelected}
                            //onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar src={`http://localhost:8081/${item.image}`} />
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{item.name}</TableCell>
                          <TableCell align="left">{item.tag}</TableCell>
                          <TableCell align="left">{item.duration} Hours</TableCell>
                          <TableCell align="left">{item.price}TND</TableCell>
                          {/*<TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>*/}
                          <TableCell align="left">
                            {
                              <Label
                                variant="ghost"
                                color={(item.status === false && 'error') || 'success'}
                              >
                                <p>Unpaid</p>
                              </Label>
                            }
                          </TableCell>

                          <TableCell align="right">
                            <Button
                              onClick={() => ondelete(index)}
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
