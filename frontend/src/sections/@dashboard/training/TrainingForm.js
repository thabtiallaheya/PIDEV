import * as Yup from 'yup';
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
  Typography
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { LoadingButton } from '@mui/lab';

export function TrainingForm() {
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    Name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
    description: Yup.string().min(2, 'Too Short!').required('Description is required'),
    tag: Yup.string().required('Tags is required'),
    duration: Yup.number().required('Duration is required'),
    language: Yup.string().required('select a language'),
    scheduledDate: Yup.date()
      .required('Scheduled Date is required')
      .min(new Date(), "You can't choose a date equal or later than today"),
    nbrParticipant: Yup.number().required('Number of participants is required'),
    price: Yup.number().required('Price is required'),
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
      axios
        .post('http://localhost:8081/api/training/insert', formdata, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          //console.warn(res);
          navigate('/training', { replace: true });
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
              <FormHelperText error>{errors.language}</FormHelperText>
            )}
          </FormControl>

          {/* <TextField
            fullWidth
            label="Description"
            {...getFieldProps('description')}
            multiline
            rows={4}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          /> */}
          <TextField
            fullWidth
            type="number"
            label="Duration"
            {...getFieldProps('duration')}
            error={Boolean(touched.duration && errors.duration)}
            helperText={touched.duration && errors.duration}
            InputProps={{
              startAdornment: <InputAdornment position="start">Min</InputAdornment>
            }}
          ></TextField>
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
              // console.log(getFieldProps('image'));
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
              <MenuItem value={'English'}>English</MenuItem>
              <MenuItem value={'French'}>French</MenuItem>
              <MenuItem value={'Arabic'}>Arabic</MenuItem>
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
