import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const { resetPassword } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [id, setId] = useState();
  const [status, setStatus] = useState(false);

  const LoginSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Does not match with field1!')
      .required('Password is required')
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
    onSubmit: async ({ password }) => {
      const genericErrorMessage = 'Something went wrong! Please try again later.';
      try {
        const response = await fetch('http://localhost:8081/users/update-password', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, password })
        });
        console.log('here');
        const data = await response.json();
        if (!response.ok) {
          setStatus({ type: 'error', message: data?.message || genericErrorMessage });
        } else {
          setStatus({
            type: 'success',
            message: 'Password changed successfully'
          });
        }
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    }
  });
  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Snackbar open={status} autoHideDuration={6000} onClose={() => setStatus(null)}>
            <Alert onClose={() => setStatus(null)} severity={status?.type} sx={{ width: '100%' }}>
              {status?.message}
            </Alert>
          </Snackbar>
          {status && (
            <Alert severity={status?.type} sx={{ width: '100%' }} onClose={() => setStatus(null)}>
              {status?.message}
            </Alert>
          )}
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
