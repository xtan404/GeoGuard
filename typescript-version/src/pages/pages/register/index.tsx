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

// Modal components for Privacy Policy and Terms
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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
  const router = useRouter(); 
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State for modal visibility

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
                         onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                           e.preventDefault();
                           handleOpenDialog();
                         }}
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

      {/* Privacy Policy & Terms Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
  <DialogTitle>Privacy Policy & Terms</DialogTitle>
  <DialogContent dividers>
    <Typography variant="body1" gutterBottom>
      <strong>Privacy Policy</strong> <br />
     {/* <strong>Effective Date:</strong> [Insert Date] <br /><br /> */}

      At GeoGuard, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services, including the Dashboard, Alert Management, Reports, and Help and Support features. <br />
    </Typography>

    <Typography variant="body2" gutterBottom>
      <br />
      <strong>1. Information We Collect</strong> <br />
      <strong>Personal Information:</strong> We may collect your name, and email address data when you register or use our services.<br />
      <strong>Usage Data:</strong> We automatically collect data about how you interact with our website, including pages visited, features used, and any information submitted through forms or alerts.<br />
      <strong>Device Information:</strong> We may collect technical information about your device, such as IP address, browser type, and operating system, to enhance your experience.<br /><br />

      <strong>2. How We Use Your Information</strong> <br />
      To Provide Services: We use your data to operate the Dashboard, manage alerts, generate reports, and offer support.<br />
      Notifications: Your contact information may be used to send SMS or email notifications about flood alerts and system updates.<br />
      Analytics: We may analyze how you use our website to improve performance, features, and overall service quality.<br /><br />

      <strong>3. Data Security</strong> <br />
      We prioritize data security and employ various technical and organizational measures to protect your data from unauthorized access or disclosure. However, no method of transmission over the Internet is completely secure.<br /><br />

      <strong>4. Sharing of Information</strong> <br />
      We do not share your personal information with third parties, except as necessary to comply with legal obligations or to protect the rights and safety of our users.<br />
      We may share anonymized data for analytics and reporting purposes to improve flood monitoring and response.<br /><br />

      <strong>5. Your Choices</strong> <br />
      You may access, update, or delete your personal information at any time through your account settings. You can also opt-out of receiving non-essential communications by contacting us.<br /><br />

      <strong>6. Third-Party Links</strong> <br />
      Our website may contain links to third-party websites. We are not responsible for the privacy practices of other sites.<br /><br />

      <strong>7. Changes to This Privacy Policy</strong> <br />
      We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date.<br /><br />

      <strong>Contact Us:</strong> If you have any questions about this Privacy Policy, please contact us at r.rendon.528550@umindanao.edu.ph.<br /><br />
    </Typography>

    <Typography variant="body1" gutterBottom>
      <strong>Terms of Service</strong> <br />
     {/*} <strong>Effective Date:</strong> [Insert Date] <br /><br /> */}

      Welcome to GeoGuard! By using our website and services, including the Dashboard, Alert Management, Reports, and Help and Support features, you agree to the following terms and conditions. Please read them carefully. <br />
    </Typography>

    <Typography variant="body2" gutterBottom>
      <br />
      <strong>1. Acceptance of Terms</strong> <br />
      By accessing or using GeoGuard, you agree to be bound by these Terms of Service. If you do not agree with these terms, you must not use our website or services.<br /><br />

      <strong>2. Use of Services</strong> <br />
      Account Registration: You may be required to create an account to use certain features. You are responsible for maintaining the confidentiality of your account information.<br />
      Permitted Use: Our website is intended for monitoring flood conditions and providing alert notifications. You agree not to misuse the platform, engage in unauthorized access, or disrupt our services.<br />
      Prohibited Use: You agree not to use our website for illegal activities, distribute harmful materials, or violate the rights of others.<br /><br />

      <strong>3. Service Availability</strong> <br />
      We strive to maintain the functionality of GeoGuard, but we cannot guarantee uninterrupted access to the site. Maintenance, updates, or unforeseen issues may occasionally affect the availability of services.<br /><br />

      <strong>4. User Responsibilities</strong> <br />
      Accuracy of Data: You are responsible for ensuring the accuracy of the data you provide, including contact information for receiving alerts.<br />
      Flood Alerts: GeoGuard provides alerts based on the data available. However, the accuracy of flood predictions may vary, and you should not solely rely on the system in emergency situations.<br /><br />

      <strong>5. Intellectual Property</strong> <br />
      All content, including text, graphics, logos, and software, is the property of GeoGuard or its licensors. You may not copy, distribute, or use any materials from our website without permission.<br /><br />

      <strong>6. Limitation of Liability</strong> <br />
      GeoGuard is not liable for any damages, losses, or injuries resulting from your use of the website or services, including but not limited to:<br />
      - Delays in receiving alerts<br />
      - Inaccurate flood data or predictions<br />
      - Service interruptions or technical issues<br /><br />

      <strong>7. Termination</strong> <br />
      We reserve the right to suspend or terminate your access to GeoGuard at any time, without notice, for violation of these terms or for other reasons at our discretion.<br /><br />

      <strong>8. Modifications to Terms</strong> <br />
      We may update these Terms of Service from time to time. Continued use of the website after changes are made will constitute your acceptance of the new terms.<br /><br />

      <strong>Contact Us:</strong> If you have any questions or concerns about these Terms of Service, please contact us at r.rendon.528550@umindanao.edu.ph.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog}>Close</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default RegisterPage;
