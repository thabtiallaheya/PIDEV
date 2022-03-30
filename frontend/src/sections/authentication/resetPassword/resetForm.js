import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
// component
import { login } from '../../../features/User/UserSlice';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function ResetForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resetPassword } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [id, setId] = useState();
  const [status, setStatus] = useState(false);

  const LoginSchema = Yup.object().shape({
    password: Yup.string().required('Password is required')
  });

  useEffect(() => {
    const getUserId = async () => {
      try {
        const date = await fetch('http://localhost:8081/users/verify-restpassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restpassword: resetPassword })
        });
        const data = await date.json();
        console.log(date);
        setId(data.id);
        setStatus({ type: 'success', message: 'password changed successfuly' });
      } catch (err) {
        console.log(err);
        setStatus({ type: 'error', message: 'something went wrong, please try again' });
        navigate('/404');
      }
    };
    getUserId();
  }, [navigate, resetPassword]);

  const formik = useFormik({
    initialValues: {
      confirmPassword: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async ({ password, confirmPassword }) => {
      const genericErrorMessage = 'Something went wrong! Please try again later.';
      console.log('here');
      try {
        const response = await fetch('http://localhost:8081/users/update-password', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, password })
        });
        if (!response.ok) {
          if (response.status === 400) {
            console.log('Please fill all the fields correctly!');
          } else if (response.status === 401) {
            console.log('Invalid email and password combination.');
          } else {
            console.log(genericErrorMessage);
          }
        } else {
          const data = await response.json();
          console.log(data);
        }
      } catch (error) {
        // setIsSubmitting(false);
        console.log(genericErrorMessage);
      }
      // navigate('/dashboard', { replace: true });
    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('confirmPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
