import * as Yup from 'yup';
import { useRef,useEffect,useState } from 'react';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import axios, * as others from 'axios';
import { validatrosCreate } from 'src/common/setErrors';
import Swal from 'sweetalert2';
import ImageIcon from '@mui/icons-material/Image';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { io } from "socket.io-client";
import toast, { Toaster } from 'react-hot-toast';
// ----------------------------------------------------------------------

export default function CreateActivity() {
  const socket = useRef();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const ActivitySchema = Yup.object().shape({
    subject: Yup.string()
      //.min(2, 'Too Short!')
      //.max(50, 'Too Long!')
      .required('Subject is required'),
    title: Yup.string()
      //.min(2, 'Too Short!')
      //.max(50, 'Too Long!')
      .required('Title is required'),
    file: Yup.string()
      //.min(2, 'Too Short!').max(50, 'Too Long!')
      .required('File is required'),
    /* creationDate: Yup.string()
      //.email('Email must be a valid email address')
      .required('creation Date is required'),*/
    limiteDate: Yup.string().required('Limite Date is required')
  });

  const formik = useFormik({
    initialValues: {
      subject: '',
      title: '',
      file: '',
      //creationDate: '',
      limiteDate: ''
    },
    validationSchema: ActivitySchema,
    onSubmit: () => {
      navigate('/dashboard/blog', { replace: true });
    }
  });
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [multipleFiles, setMultipleFiles] = useState('');

  //const [file, setFile] = useState('');
  //const [creationDate, setCreationDate] = useState('');
  const [limiteDate, setLimiteDate] = useState('');
  const [errorrs, setErrorrs] = useState({});

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const validate = (subject, title, multipleFiles, limiteDate) => {
    const errorrs = validatrosCreate(subject, title, multipleFiles, limiteDate);
    setErrorrs(errorrs);
    //setFormData({ errors: errors })
    return Object.values(errorrs).every((err) => err === '');
  };
  useEffect(() => {
    socket.current = io("ws://localhost:8002");

    socket.current.on("connnection", () => {
      console.log("connected to server");
    });
    socket.current.on("new-notification", () => {
      console.log("new notif");
      Swal.fire(
        'The feed is up to date!',
        'You clicked the button!',
        'success'
      )
      //alert("  New notification!!!");
    
    });
    
    
    
  }, [])
  const MultipleFileChange = (event) => {
    setMultipleFiles(event.target.files);
  };
  const multipleFilesUpload = async (data) => {
    try {
      await axios.post('http://localhost:8081/eya/multipleFiles', data);
    } catch (error) {
      throw error;
    }
  };
  const UploadMultipleFiles = async () => {
    console.log(multipleFiles);

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('title', title);
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append('file', multipleFiles[i]);
    }
    formData.append('limiteDate', limiteDate);

    if (validate(subject, title, multipleFiles, limiteDate)) {
      await multipleFilesUpload(formData);
      Swal.fire({
        //position: 'top-end',
        icon: 'success',
        title: 'Your insertion has been saved',
        showConfirmButton: false,
        timer: 3500
      });
      socket.current.emit("message", new Date().getTime());
      navigate('/blog', { replace: true });
    }
  };
  /*const addToList = () => {
    if (validate(title, file, limiteDate)) {
      axios.post('http://localhost:8081/insert', {
        title: title,
        file: file,
        //creationDate: creationDate,
        limiteDate: limiteDate
      });
      navigate('/dashboard/blog', { replace: true });
    }
    //console.log(title + file + creationDate + limiteDate);
  };*/
  return (
    
    <FormikProvider value={formik}>
        
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Subject"
              //{...getFieldProps('title')}
              error={Boolean(touched.subject && errorrs.subject)}
              onChange={(event) => {
                setSubject(event.target.value);
              }}
              helperText={touched.subject && errorrs.subject}
            />
            <TextField
              fullWidth
              label="Title"
              //{...getFieldProps('title')}
              error={Boolean(touched.title && errorrs.title)}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              helperText={touched.title && errorrs.title}
            />
            <br />

            <br />
          </Stack>
          <label
            style={{
              color: 'green'
            }}
          >
            📚 Files
          </label>
          
           <TextField
           fullWidth
            name="image"
            //label="Files"
            accept="image/*"
            type="file"
            inputProps={{ multiple: true }}
            InputProps={{ 
              startAdornment: (
                <InputAdornment position="start">
                <UploadFileIcon color="success" />
                </InputAdornment>
              )
            }}
            onChange={(event) => {
              MultipleFileChange(event);
            }}
            variant="standard"
            error={Boolean(touched.file && errorrs.file)}
            helperText={touched.file && errorrs.file}
          />
          <label
            style={{
              color: 'green'
            }}
          >
            ⏰ Limite date
          </label>
          <TextField
            fullWidth
            autoComplete="current-password"
            type="datetime-local" //label="Limite date"
            //{...getFieldProps('limiteDate')}
            onChange={(event) => {
              setLimiteDate(event.target.value);
            }}
            error={Boolean(touched.limiteDate && errorrs.limiteDate)}
            helperText={touched.limiteDate && errorrs.limiteDate}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            //loading={addToList}
            onClick={() => UploadMultipleFiles()}
          >
            Save
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
