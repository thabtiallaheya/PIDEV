import * as Yup from 'yup';
import { useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  InputLabel,
  Select,
  Chip,
  MenuItem
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import { login } from 'src/features/User/UserSlice';
import { LoadingButton } from '@mui/lab';
import { skills } from 'src/utils/skillsList';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function AccountProfileDetails(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [status, setStatus] = useState(null);

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string().length(8).required('Phone number is required')
  });

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      skills: user.skills || []
    },
    validationSchema: ProfileSchema,
    onSubmit: async ({ firstName, lastName, phone, bio, skills }) => {
      const genericErrorMessage = 'Something went wrong! Please try again later.';
      try {
        const response = await fetch(`http://localhost:8081/users/${user.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, phone, bio, skills })
        });
        const data = await response.json();
        if (response.status !== 200) {
          setStatus({ type: 'error', message: data?.message || genericErrorMessage });
        } else {
          setStatus({ type: 'success', message: 'Data updated successfuly' });
          dispatch(
            login({
              ...user,
              firstName,
              lastName,
              phone,
              bio,
              skills
            })
          );
        }
      } catch (error) {
        console.log(genericErrorMessage);
      }
    }
  });
  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          {status && (
            <Alert severity={status?.type} sx={{ width: '100%' }} onClose={() => setStatus(null)}>
              {status?.message}
            </Alert>
          )}
          <CardHeader subheader="The information can be edited" title="Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="First name"
                  {...getFieldProps('firstName')}
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Last name"
                  {...getFieldProps('lastName')}
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField fullWidth disabled label="Email Address" {...getFieldProps('email')} />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  type="number"
                  fullWidth
                  label="phone"
                  {...getFieldProps('phone')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          {user.role === 'MENTOR' && (
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <TextField multiline fullWidth label="Bio" rows={4} {...getFieldProps('bio')} />
                </Grid>
                <Grid item md={12} xs={12}>
                  <InputLabel shrink>Skills</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    label="skills"
                    {...getFieldProps('skills')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((name) => (
                          <Chip key={name} label={name} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {skills.map(({ name }) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </CardContent>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2
            }}
          >
            <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
              Save details
            </LoadingButton>
          </Box>
        </Card>
      </Form>
    </FormikProvider>
  );
}
