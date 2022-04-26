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

export function CourseForm() {
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    Name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
    description: Yup.string().min(2, 'Too Short!').required('Description is required'),
    tag: Yup.string().required('Tags is required'),
    image: Yup.mixed().nullable().required('image is required')
  });

  const formik = useFormik({
    initialValues: {
      Name: '',
      description: '',
      tag: '',
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
      formdata.append('price', values.price);
      if (values.image.length != 0) {
        for (const single_file of values.image) {
          // data.append('uploadedImages', single_file)
          formdata.append('image', single_file);
        }
      }

      axios
        .post('http://localhost:8081/api/course/add', formdata, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          //console.warn(res);
          navigate('/course', { replace: true });
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
              label=" Title"
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
            name="image"
            label="Image"
            accept="image/*"
            type="file"
            inputProps={{
              multiple: true
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon color="success" />
                </InputAdornment>
              )
            }}
            multiple
            onChange={(event) => {
              setFieldValue('image', event.currentTarget.files);
              // console.log(getFieldProps('image'));
            }}
            variant="standard"
            error={Boolean(touched.image && errors.image)}
            helperText={touched.image && errors.image}
          />

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
