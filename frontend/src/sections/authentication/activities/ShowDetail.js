import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import moment from 'moment';
import { alpha, styled } from '@mui/material/styles';

// material
import { Stack, TextField, IconButton, InputAdornment, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import axios, * as others from 'axios';
import { validatrosUpdate } from 'src/common/setErrors';
import { saveAs } from 'file-saver';
import Label from 'src/components/Label';
import Swal from "sweetalert2";  


// ----------------------------------------------------------------------
const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});
export default function ShowDetail() {
  const navigate = useNavigate();

  const [activity, setActivity] = useState({});
  const [fileActivity, setFileActivity] = useState([]);

  const saveFile = (url, name) => {
  
    let timerInterval
Swal.fire({
  title: 'Autorize download!',
  html: 'It will be downloaded in <b></b> milliseconds.',
  timer: 2000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  saveAs(url, name);
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log('I was closed by the timer')
  }
})

  };

  const { id } = useParams();

  useEffect(() => {
    Swal.fire({
      title: 'record the activity bellow 👇',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
    axios.get(`http://localhost:3001/api/read/detail/${id}`).then((response) => {
      console.log(response.data.activity);
      setActivity(response.data.activity);
      setFileActivity(response.data.activity.file);
    });
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {fileActivity.map((file, key) => {
          return (
            <div key={key}>
              <img src={`http://localhost:3001/${file.filePath}`} height="500" alt="img" />
              <br />
              <center>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Button
                    variant="contained"

                    //startIcon={<Iconify icon="flat-color-icons:delete-column" />}
                  >
                    <a href={`http://localhost:3001/${file.filePath}`} download={file.fileName}>
                      🔎 Show
                    </a>
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      saveFile(`http://localhost:3001/${file.filePath}`, file.fileName);
                    }}
                    //startIcon={<Iconify icon="flat-color-icons:delete-column" />}
                  >
                    🖨️ Downolad
                  </Button>
                </Stack>
              </center>
            </div>
          );
        })}
      </Stack>
      <Label
        variant="filled"
        color={'secondary'}
        sx={{
          zIndex: 9,
          //top: 10,
          //right: 16,
          position: 'absolute',
          textTransform: 'uppercase'
        }}
      >
        {activity.subject}
      </Label>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Typography
          gutterBottom
          variant="caption"
          sx={{ color: 'text.disabled', display: 'block' }}
        >
          {' '}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <h3> Activity About 📜 : {activity.title} </h3>
          </Stack>
        </Typography>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Typography
          gutterBottom
          variant="caption"
          sx={{ color: 'text.disabled', display: 'block' }}
        >
          {' '}
          Posted At 📝 : {activity.createdAt}
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Typography
          gutterBottom
          variant="caption"
          sx={{ color: 'text.disabled', display: 'block' }}
        >
          {' '}
          Last Update at ✏️ : {activity.updatedAt}
        </Typography>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Typography
          gutterBottom
          variant="caption"
          sx={{ color: 'text.disabled', display: 'block' }}
        >
          {' '}
          Limite date ⏰ : {activity.limiteDate}
        </Typography>
      </Stack>
    </Stack>
  );
}
