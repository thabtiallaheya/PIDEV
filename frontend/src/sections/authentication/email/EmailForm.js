import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function EmailForm() {
  const [status, setStatus] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async ({ email }) => {
      const genericErrorMessage = 'Something went wrong! Please try again later.';
      try {
        const response = await fetch('http://localhost:8081/users/resetpassword', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (response.status !== 200) {
          setStatus({ type: 'error', message: data?.message || genericErrorMessage });
        } else {
          setStatus({
            type: 'success',
            message: 'A verification email has been sent to this email'
          });
          console.log(data);
        }
      } catch (error) {
        // setIsSubmitting(false);
        console.log(genericErrorMessage);
      }
    }
  });
  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {status && (
            <Alert severity={status?.type} sx={{ width: '100%' }} onClose={() => setStatus(null)}>
              {status?.message}
            </Alert>
          )}
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Send verification email
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
