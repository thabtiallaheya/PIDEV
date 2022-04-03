import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import moment from 'moment';
import Swal from "sweetalert2";  
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import axios, * as others from 'axios';
import { validatrosUpdate } from 'src/common/setErrors';

// ----------------------------------------------------------------------

export default function EditActivity() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const ActivitySchema = Yup.object().shape({
    subject: Yup.string()
      //.min(2, 'Too Short!')
      //.max(50, 'Too Long!')
      .required('Title is required'),
    title: Yup.string()
      //.min(2, 'Too Short!')
      //.max(50, 'Too Long!')
      .required('Title is required'),
    file: Yup.string()
      //.min(2, 'Too Short!').max(50, 'Too Long!')
      .required('File is required'),
    creationDate: Yup.string()
      //.email('Email must be a valid email address')
      .required('creation Date is required'),
    limiteDate: Yup.string().required('Limite Date is required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      subject: '',
      //creationDate: '',
      limiteDate: ''
    },
    validationSchema: ActivitySchema,
    onSubmit: () => {
      navigate('/dashboard/blog', { replace: true });
    }
  });
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    //creationDate: '',
    limiteDate: ''
  });
  const [errorrs, setErrorrs] = useState({});

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const validate = (subject, title, limiteDate) => {
    const errorrs = validatrosUpdate(subject, title, limiteDate);
    setErrorrs(errorrs);
    //setFormData({ errors: errors })
    return Object.values(errorrs).every((err) => err === '');
  };
  const { id } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:3001/api/read/detail/${id}`).then((response) => {
      /*let isoDate = response.data.activity.creationDate
        let newDate = moment.utc(isoDate).format('YYYY-MM-DD')*/

      let isoDate2 = response.data.activity.limiteDate;
      let newDate2 = moment.utc(isoDate2).format('yyyy-MM-DDThh:mm');

      setFormData({
        subject: response.data.activity.subject,
        title: response.data.activity.title,
        //creationDate: newDate,
        limiteDate: newDate2
      });
    });
  }, [id]);
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

     const onSubmit = (e) => {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {

          e.preventDefault();
      const { subject, title, limiteDate } = formData;
      console.log(formData);
  
      if (validate(subject, title, limiteDate)) {
        axios.put(`http://localhost:3001/api/update/${id}`, formData).then((response) => {
          if (response.data.success) {
            //alert('updated')
          }
          navigate('/dashboard/blog', { replace: true });
        });
      }
          Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
     
    
    };
 //ancien update
  /*const onSubmit = (e) => {
    e.preventDefault();
    const { subject, title, limiteDate } = formData;
    console.log(formData);

    if (validate(subject, title, limiteDate)) {
      axios.put(`http://localhost:3001/api/update/${id}`, formData).then((response) => {
        if (response.data.success) {
          //alert('updated')
        }
        navigate('/dashboard/blog', { replace: true });
      });
    }
  };*/
  const { subject, title, limiteDate } = formData;

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
              name="subject"
              value={subject}
              onChange={(e) => onChange(e)}
              helperText={
                errorrs.subject && (
                  <div
                    style={{
                      color: 'red'
                    }}
                  >
                    {errorrs.subject}
                  </div>
                )
              }
            />

            <TextField
              fullWidth
              label="Title"
              //{...getFieldProps('title')}
              error={Boolean(touched.title && errorrs.title)}
              name="title"
              value={title}
              onChange={(e) => onChange(e)}
              helperText={
                errorrs.title && (
                  <div
                    style={{
                      color: 'red'
                    }}
                  >
                    {errorrs.title}
                  </div>
                )
              }
            />
          </Stack>

          <label
            style={{
              color: 'green'
            }}
          >
            ⏰ Limite date
          </label>

          <TextField
            fullWidth
            //autoComplete="current-password"
            type="datetime-local"
            //label="Limite date"
            //{...getFieldProps('limiteDate')}
            name="limiteDate"
            value={limiteDate}
            onChange={(e) => onChange(e)}
            error={Boolean(touched.limiteDate && errors.limiteDate)}
            helperText={
              errorrs.limiteDate && (
                <div
                  style={{
                    color: 'red'
                  }}
                >
                  {errorrs.limiteDate}
                </div>
              )
            }
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            //loading={addToList}
            onClick={onSubmit}
          >
            Save
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
