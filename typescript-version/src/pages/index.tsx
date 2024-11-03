import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import MuiCard, { CardProps } from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';
import themeConfig from 'src/configs/themeConfig';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';

interface State {
  password: string;
  showPassword: boolean;
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}));

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}));

const LoginPage = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const [user, setUser] = useState({
    firstName: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (user_id) {
      fetch(`http://localhost:8081/users/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((err) => console.log(err));
    }
  }, [user_id]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid Email.").required("Email is required."),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
      handleLogin(values);
    },
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log('Attempting to log in with values:', values);
    try {
      const response = await axios.post("http://localhost:8081/login", values);
      if (response.data.success) {
        console.log("Login successful!");
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("role", response.data.role); 
        axios.defaults.headers.common["Authorization"] = response.data.user_id;

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Signed in",
        });
        router.push('/admin/dashboard');
      } else {
        Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid account. Please try again.",
      }).then((result) => {
        if (result.isConfirmed) {
        formik.resetForm();
  }
});
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  });
  const router = useRouter();
  
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid sx={{ paddingTop: 2, paddingRight: 2 }}>
              <img src='/images/logos/GeoGuardMainLogo.png' alt="Logo" style={{ paddingTop: 5, paddingLeft: 12, height: '100px' }} />
            </Grid>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account to continue</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              id='email'
              label='Email'
              sx={{ marginBottom: formik.touched.email && formik.errors.email ? 1.5 : 4 }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <Typography variant='body1' sx={{ color: '#db4437', paddingTop: 1, paddingLeft: 3, marginBottom: 3 }}>
                {formik.errors.email}
              </Typography>
            ) : null}
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                id='password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formik.touched.password && formik.errors.password ? (
                <Typography variant='body1' sx={{ color: '#db4437', paddingTop: 1, paddingLeft: 3, marginBottom: 3 }}>
                  {formik.errors.password}
                </Typography>
              ) : null}
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox />} label='Remember Me' />
             {/*} <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
              </Link> */}
            </Box>
            <Button
              type="submit" 
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Login
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/register'>
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  );
};

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
