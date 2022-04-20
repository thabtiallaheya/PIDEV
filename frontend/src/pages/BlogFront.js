import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
//
import POSTS from '../_mocks_/blog';
import {  useRef,useEffect, useState } from 'react';
import axios, * as others from 'axios';
import ReactPaginate from 'react-paginate';
import { element } from 'prop-types';
import BlogPostCardFront from 'src/sections/@dashboard/blog/BlogPostCardFront';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import ChatIcon from '@mui/icons-material/Chat';
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'mod1', label: 'Oldest' },
  { value: 'mod2', label: 'Latest' }
];

// ----------------------------------------------------------------------

export default function BlogFront() {
  const socket = useRef();
  const [activityList, setActivityList] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedmultipleFiles, setSortedmultipleFiles] = useState([]);

  const getMultipleFiles = async () => {
    try {
      const { data } = await axios.get('http://localhost:8081/eya/getMultipleFiles');
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
    axios.get('http://localhost:8081/read').then((response) => {
      console.log(response.data);
      setActivityList(response.data);
    });
    socket.current = io("ws://localhost:8002");

    socket.current.on("connnection", () => {
      console.log("connected to server");
    });
    socket.current.on("new-notification", () => {
      console.log("new notif");
      Swal.fire(
        'the feed is up to date!',
        'You clicked the button!',
        'success'
      )
      //alert("  New notification!!!");
      
    });

      //chatBoat
      
    (function(d, m){
        var kommunicateSettings = 
            {"appId":"da13654b0c21d8a6200129043a9f84f5","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
/* NOTE : Use web server to view HTML files as real-time update will not work if you directly open the HTML file in the browser. */





  }, []);

  const ascOrder = () => {
    setMultipleFiles(
      multipleFiles.sort(function (a, b) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
    );
    setSortedmultipleFiles(multipleFiles);
    console.log(sortedmultipleFiles);
  };
  const descOrder = () => {
    setMultipleFiles(
      multipleFiles
        .sort(function (a, b) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        })
        .reverse()
    );
    setSortedmultipleFiles(multipleFiles);
    console.log(sortedmultipleFiles);
  };
  const modo = (value) => {
    switch (value) {
      case 'mod1':
        ascOrder();
        break;
      case 'mod2':
        descOrder();
        break;
    }
  };

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
            to="/chat"
            //startIcon={<Iconify icon="eva:plus-fill" />}
          >  <ChatIcon  />
             Join Chat 
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={multipleFiles} setSearchTerm={setSearchTerm} />
          { <BlogPostsSort options={SORT_OPTIONS} modo={modo} /> } 
        </Stack>

        <Grid container spacing={3}>
          {multipleFiles
            .filter((element) => {
              if (searchTerm == '') {
                return element;
              } else if (
                element.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                element.subject.toLowerCase().includes(searchTerm.toLocaleLowerCase())
              ) {
                return element;
              }
            })
            .map((element, index) => (
              <BlogPostCardFront element={element} index={index} />
            ))}
        </Grid>
      </Container>
    </Page>
  );
}
