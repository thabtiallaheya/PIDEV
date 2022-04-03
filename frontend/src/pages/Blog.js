import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
//
import POSTS from '../_mocks_/blog';
import { useEffect, useState } from 'react';
import axios, * as others from 'axios';
import ReactPaginate from 'react-paginate';
import { element } from 'prop-types';
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'mod1', label: 'Oldest' },
  { value: 'mod2', label: 'Latest' }
];

// ----------------------------------------------------------------------

export default function Blog() {
  const [activityList, setActivityList] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [searchTerm, setSearchTerm]= useState('')
  const [sortedmultipleFiles, setSortedmultipleFiles] = useState([])



         
  const getMultipleFiles = async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/api/getMultipleFiles');
      return data;
    } catch (error) {
      throw error;
    }
  };
  const getMultipleFilesList = async () => {
    try {
      const fileslist = await getMultipleFiles();
      setMultipleFiles(fileslist);
      console.log(multipleFiles);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMultipleFilesList();
    axios.get('http://localhost:3001/read').then((response) => {
      console.log(response.data);
      setActivityList(response.data);
    });
  }, []);


  const  ascOrder=  ()=>{
    setMultipleFiles(multipleFiles.sort(function(a,b){
     // return (a.createdAt-b.createdAt)
     return new Date(a.createdAt).getTime() - 
        new Date(b.createdAt).getTime()
      
    }))
    setSortedmultipleFiles(multipleFiles);
    console.log(sortedmultipleFiles)

  }
  const  descOrder=  ()=>{
    setMultipleFiles(multipleFiles.sort(function(a,b){
      //return (b.createdAt<a.createdAt)
      return new Date(a.createdAt).getTime() - 
      new Date(b.createdAt).getTime()
    }).reverse())
    setSortedmultipleFiles(multipleFiles);
  console.log(sortedmultipleFiles)
  }  
  const modo = (value)=>{
    switch(value) {
      case "mod1":
         ascOrder();
         break;
      case "mod2":
        descOrder();
         break;
    
    }
  }
  
  return (
    <Page title="Dashboard: Blog | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            📚Activities📖
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/add"
            //startIcon={<Iconify icon="eva:plus-fill" />}
          >
            📝New activity
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={multipleFiles} setSearchTerm={setSearchTerm}  />
          <BlogPostsSort options={SORT_OPTIONS} modo={modo} />
        </Stack>
        
        <Grid container spacing={3}>
          {multipleFiles.filter((element)=>{
        if(searchTerm == ""){
          return element;
        }
        else if(element.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()) || element.subject.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ) {
         return element;
        }
      }
      ).map((element, index) => (
            <BlogPostCard element={element} index={index} />
            
          ))}
         
        </Grid>
      </Container>
    </Page>
  );
}
