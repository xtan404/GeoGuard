import { useState, Fragment, ReactNode } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled, useTheme } from '@mui/material/styles';
import MuiCard, { CardProps } from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import { useRouter } from 'next/router'; 
import Axios from 'axios';
import { AxiosError } from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';

import themeConfig from 'src/configs/themeConfig';

import BlankLayout from 'src/@core/layouts/BlankLayout';

import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration';

interface ErrorResponse {
  message: string; 
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}));

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

const RegisterPage = () => {
  const theme = useTheme();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    agreedToTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  });

  const router = useRouter(); 

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src='/images/logos/GeoGuardMainLogo.png' alt="Logo" style={{ paddingTop: 5, paddingLeft: 12, height: '100px' }} />
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Adventure starts here 🚀
            </Typography>
            <Typography variant='body2'>Sign up here to create your account</Typography>
          </Box>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              agreedToTerms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              try {
                const response = await Axios.post('http://localhost:8081/register', {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  password: values.password,
                });
                console.log(response.data);
                router.push('/');
              } catch (error: unknown) {
                const axiosError = error as AxiosError<ErrorResponse>;
                if (axiosError.response) {
                  if (axiosError.response.status === 400) {
                    const errorMessage = axiosError.response.data?.message || 'Email already exists';
                    setFieldError('email', errorMessage);
                  } else {
                    console.error('Registration failed:', axiosError.response.data);
                  }
                } else {
                  console.error('An unexpected error occurred:', error);
                }
              } finally {
                setSubmitting(false);
              }
            }}           
            
          >
            {({ values, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
             <Form noValidate autoComplete='off'>
               <ErrorMessage name='firstName'>
                 {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
               </ErrorMessage>
               <Field
                 as={TextField}
                 fullWidth
                 label='First Name'
                 sx={{ marginBottom: 4 }}
                 name='firstName'
                 onChange={handleChange}
                 onBlur={handleBlur}
               />

               <ErrorMessage name='lastName'>
                 {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
               </ErrorMessage>
               <Field
                 as={TextField}
                 fullWidth
                 label='Last Name'
                 sx={{ marginBottom: 4 }}
                 name='lastName'
                 onChange={handleChange}
                 onBlur={handleBlur}
               />

               <ErrorMessage name='email'>
                 {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
               </ErrorMessage>
               <Field
                 as={TextField}
                 fullWidth
                 type='email'
                 label='Email'
                 sx={{ marginBottom: 4 }}
                 name='email'
                 onChange={handleChange}
                 onBlur={handleBlur}
               />

               <ErrorMessage name='password'>
                 {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
               </ErrorMessage>
               <FormControl fullWidth>
                 <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
                 <OutlinedInput
                   label='Password'
                   sx={{ marginBottom: 4 }}
                   name='password'
                   value={values.password} 
                   onChange={handleChange}
                   onBlur={handleBlur}
                   type={showPassword ? 'text' : 'password'} 
                   endAdornment={
                     <InputAdornment position='end'>
                       <IconButton
                         edge='end'
                         onClick={() => setShowPassword(!showPassword)}
                         onMouseDown={(event) => event.preventDefault()}
                         aria-label='toggle password visibility'
                       >
                         {showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                       </IconButton>
                     </InputAdornment>
                   }
                 />
               </FormControl>
              
               <ErrorMessage name='confirmPassword'>
                 {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
               </ErrorMessage>
               <FormControl fullWidth>
                 <InputLabel htmlFor='auth-register-confirm-password'>Confirm Password</InputLabel>
                 <OutlinedInput
                   label='Confirm Password'
                   sx={{ marginBottom: 4 }}
                   name='confirmPassword'
                   value={values.confirmPassword} 
                   onChange={handleChange}
                   onBlur={handleBlur}
                   type={showConfirmPassword ? 'text' : 'password'} 
                   endAdornment={
                     <InputAdornment position='end'>
                       <IconButton
                         edge='end'
                         onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                         onMouseDown={(event) => event.preventDefault()}
                         aria-label='toggle confirm password visibility'
                       >
                         {showConfirmPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                       </IconButton>
                     </InputAdornment>
                   }
                 />
               </FormControl>
               
               <MuiFormControlLabel
                 control={
                   <Checkbox
                     name='agreedToTerms'
                     checked={values.agreedToTerms}
                     onChange={() => setFieldValue('agreedToTerms', !values.agreedToTerms)}
                   />
                 }
                 label={
                   <Fragment>
                     <span>I agree to </span>
                     <Link href='/' passHref>
                       <LinkStyled
                         onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
                       >
                         privacy policy & terms
                       </LinkStyled>
                     </Link>
                   </Fragment>
                 }
               />
               <ErrorMessage name='agreedToTerms'>
                 {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
               </ErrorMessage>
               
               <Button 
                 fullWidth 
                 size='large' 
                 type='submit' 
                 variant='contained' 
                 sx={{ marginBottom: 7 }} 
                 disabled={isSubmitting}
               >
                 Sign up
               </Button>
               
               <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                 <Typography variant='body2' sx={{ marginRight: 2 }}>
                   Already have an account?
                 </Typography>
                 <Typography variant='body2'>
                   <Link passHref href='/' >
                     <LinkStyled>Sign in instead</LinkStyled>
                   </Link>
                 </Typography>
               </Box>
             </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  );
};

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default RegisterPage;
