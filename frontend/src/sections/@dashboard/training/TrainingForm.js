import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
// material
import {
  Stack,
  TextField,
  InputAdornment,
  InputLabel,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/static/icons/ic_flag_en.svg'
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/static/icons/ic_flag_fr.svg'
  }
];
export function TrainingForm() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    Name: Yup.string().min(2, 'Too Short!').required('Name is required'),
    description: Yup.string().min(2, 'Too Short!').required('Description is required'),
    tag: Yup.string().required('Tags is required'),
    duration: Yup.number().required('Duration is required'),
    language: Yup.string().required('select a language'),
    scheduledDate: Yup.date()
      .required('Scheduled Date is required')
      .min(new Date(), "You can't choose a date equal or later than today"),
    nbrParticipant: Yup.number()
      .min(1, 'Number of participants must be greater than 1')
      .max(20, 'Number of participants must be less than 20')
      .required('Number of participants is required'),
    price: Yup.number().min(1, 'Price must be greater than 1DT').required('Price is required'),
    image: Yup.mixed().nullable().required('image is required')
  });

  const formik = useFormik({
    initialValues: {
      Name: '',
      description: '',
      tag: '',
      duration: '',
      language: '',
      scheduledDate: '',
      nbrParticipant: '',
      price: '',
      image: null
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log(values);
      const formdata = new FormData();
      formdata.append('name', values.Name);
      formdata.append('description', values.description);
      formdata.append('tag', values.tag);
      formdata.append('duration', values.duration);
      formdata.append('language', values.language);
      formdata.append('scheduledDate', values.scheduledDate);
      formdata.append('nbrParticipent', values.nbrParticipant);
      formdata.append('price', values.price);
      formdata.append('image', values.image);
      formdata.append('trainer', user.id);
      axios
        .post('http://localhost:8081/api/training/insert', formdata, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your training has been saved',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            navigate('/training', { replace: true });
          }, 2000);
        });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label=" Name"
              {...getFieldProps('Name')}
              error={Boolean(touched.Name && errors.Name)}
              helperText={touched.Name && errors.Name}
            />
            <TextField
              fullWidth
              label="Tag"
              {...getFieldProps('tag')}
              error={Boolean(touched.tag && errors.tag)}
              helperText={touched.tag && errors.tag}
            />
          </Stack>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Typography sx={{ color: 'text.secondary' }}>Description</Typography>
            <CKEditor
              editor={ClassicEditor}
              data=""
              onChange={(event, editor) => {
                const data = editor.getData();
                setFieldValue('description', data);
              }}
              error={Boolean(touched.description && errors.description)}
            />
            {touched.description && errors.description && (
              <FormHelperText error>{errors.description}</FormHelperText>
            )}
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Duration</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              {...getFieldProps('duration')}
              label="Duration"
              error={Boolean(touched.duration && errors.duration)}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={30}>30 Min</MenuItem>
              <MenuItem value={60}>60 Min</MenuItem>
              <MenuItem value={90}>90 Min</MenuItem>
              <MenuItem value={120}>120 Min</MenuItem>
            </Select>
            {touched.duration && errors.duration && (
              <FormHelperText error>{errors.duration}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Number of participants"
            type="number"
            {...getFieldProps('nbrParticipant')}
            error={Boolean(touched.nbrParticipant && errors.nbrParticipant)}
            helperText={touched.nbrParticipant && errors.nbrParticipant}
          />
          <TextField
            name="image"
            label="Image"
            accept="image/*"
            type="file"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon color="success" />
                </InputAdornment>
              )
            }}
            onChange={(event) => {
              setFieldValue('image', event.currentTarget.files[0]);
            }}
            variant="standard"
            error={Boolean(touched.image && errors.image)}
            helperText={touched.image && errors.image}
          />
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              {...getFieldProps('language')}
              label="Language"
              error={Boolean(touched.language && errors.language)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {LANGS.map((option) => (
                <MenuItem key={option.value} sx={{ py: 1, px: 2.5 }} value={option.label}>
                  <ListItemIcon>
                    <Box component="img" alt={option.label} src={option.icon} />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                    {option.label}
                  </ListItemText>
                </MenuItem>
              ))}
              {/* <MenuItem value={'English'}>English</MenuItem>
              <MenuItem value={'French'}>French</MenuItem>
              <MenuItem value={'Arabic'}>Arabic</MenuItem> */}
            </Select>
            {touched.language && errors.language && (
              <FormHelperText error>{errors.language}</FormHelperText>
            )}
          </FormControl>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Price"
                type="number"
                {...getFieldProps('price')}
                error={Boolean(touched.price && errors.price)}
                helperText={touched.price && errors.price}
                InputProps={{
                  startAdornment: <InputAdornment position="start">DT</InputAdornment>
                }}
              />
              <TextField
                label="Scheduled Date"
                type="datetime-local"
                {...getFieldProps('scheduledDate')}
                error={Boolean(touched.scheduledDate && errors.scheduledDate)}
                helperText={touched.scheduledDate && errors.scheduledDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Stack>
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
