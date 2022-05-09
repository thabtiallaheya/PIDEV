import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import axios, * as others from 'axios';

import { alpha, styled } from '@mui/material/styles';
import {
  Stack,
  Button,
  Box,
  Link,
  Card,
  Grid,
  Avatar,
  Typography,
  CardContent
} from '@mui/material';
// utils
import { fDate, fDateTime, fDateTimeSuffix } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';
import Label from 'src/components/Label';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2)
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function BlogPostCard(props) {
  // const { cover, title, view, comment, share, author, createdAt } = val;
  const latestPostLarge = props.index === 0 || props.index === 3 || props.index === 6;
  const latestPost = props.index === 1 || 4;
  const navigate = useNavigate();

  /*const POST_INFO = [
    { number: comment, icon: 'eva:message-circle-fill' },
    { number: view, icon: 'eva:eye-fill' },
    { number: share, icon: 'eva:share-fill' }
  ];*/
  /*const [activityList, setActivityList] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8081/read').then((response) => {
      console.log(response.data);
      setActivityList(response.data);
    });
  }, []);*/

  const deleteActivity = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8081/eya/delete/${id}`);
        // navigate('/blog', { replace: true });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };
  //ancien del
  /*const deleteActivity = (id) => {
    axios.delete(`http://localhost:8081/api/delete/${id}`);
    navigate('/dashboard/blog', { replace: true });
  };*/

  //return activityList.map((val, key) => {
  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card key={props.element._id} sx={{ position: 'relative' }}>
        <Label
          variant="filled"
          color={'secondary'}
          sx={{
            zIndex: 9,
            top: 16,
            right: 16,
            position: 'absolute',
            textTransform: 'uppercase'
          }}
        >
          {props.element.subject}
        </Label>
        <CardMediaStyle
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
              }
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)'
              }
            })
          }}
        >
          <SvgIconStyle
            color="paper"
            //src="/static/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              ...((latestPostLarge || latestPost) && { display: 'none' })
            }}
          />

          <CoverImgStyle
            alt="img"
            src={`http://localhost:8081/${props.element.file[0].fileName}`}
          />
        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute'
            })
          }}
        >
          <TitleStyle
            to={`/api/read/detail/${props.element._id}`}
            //to={`/api/read/detail/${props.element._id}`}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white'
              })
            }}
          >
            {props.element.title}
          </TitleStyle>
          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block' }}
          >
            {' '}
            Posted At 📝 :{fDateTime(props.element.createdAt)}
          </Typography>

          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block' }}
          >
            {' '}
            Limite Date ⏰ :{fDateTime(props.element.limiteDate)}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Button
              variant="contained"
              component={RouterLink}
              to={`/edit/${props.element._id}`}
              //startIcon={<Iconify icon="flat-color-icons:data-recovery" />}
            >
              <a href={`/dashboard/edit/${props.element._id}`}>✏️ update</a>
            </Button>
            <Button
              variant="contained"
              component={RouterLink}
              to={`/api/read/detail/${props.element._id}`}
              //startIcon={<Iconify icon="flat-color-icons:data-recovery" />}
            >
              <a href={`/api/read/detail/${props.element._id}`}>📖show</a>
            </Button>

            <Button
              onClick={() => {
                deleteActivity(props.element._id);
              }}
              style={{ color: 'red' }}
              variant="contained"
              //startIcon={<Iconify icon="flat-color-icons:delete-column" />}
            >
              ✂️ Delete
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
  //});
}
