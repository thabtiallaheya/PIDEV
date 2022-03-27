import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// material
import { Stack, TextField, InputAdornment } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';

export function TrainingForm() {
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    Name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
    description: Yup.string().min(2, 'Too Short!').required('Description is required'),
    tag: Yup.string().required('Tags is required'),
    duration: Yup.number().required('Duration is required'),
    language: Yup.string().required('select a language'),
    scheduledDate: Yup.date().required('Scheduled Date is required'),
    nbrParticipant: Yup.number().required('Number of participants is required'),
    price: Yup.number().required('Price is required')
  });

  const formik = useFormik({
    initialValues: {
      Name: '',
      description: '',
      tag: '',
      duration: 0,
      language: '',
      scheduledDate: '',
      nbrParticipant: 0,
      price: 0,
      image: null
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
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
        .post('http://localhost:3001/api/training/insert', formdata, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          //console.warn(res);
          navigate('/dashboard/training', { replace: true });
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
          <TextField
            fullWidth
            label="Description"
            {...getFieldProps('description')}
            multiline
            rows={4}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />
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
          />
          <TextField
            label="Number of participants"
            type="number"
            {...getFieldProps('nbrParticipant')}
            error={Boolean(touched.nbrParticipant && errors.nbrParticipant)}
            helperText={touched.nbrParticipant && errors.nbrParticipant}
          />
          <TextField
            name="image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setFieldValue('image', event.currentTarget.files[0]);
              // console.log(getFieldProps('image'));
            }}
            // onChange={(event) => {
            //   setFieldValue('image', event.currentTarget);
            // }}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
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
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
