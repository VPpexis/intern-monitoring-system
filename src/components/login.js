// src/Login.js
import React from 'react';
import Firebase from '../scripts/Firebase.js';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/*
Intern DashBoard:
  Intern Login. Allows intern to login to their accounts.
*/
const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  
  const handleUsername = async (e) => {
    setEmail(e.target.value);
  }
  
  const handlePassowrd = async (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const firebase = new Firebase();
    console.log("Email: ", email, "   Password: ", password);

    try {
      const loginSuccess = await firebase.loginInternAccount(email, password);
      if (loginSuccess) {
        console.log('Login sucessful, UUID: ', loginSuccess);
        navigate(`dashboard/${loginSuccess}`);
      } else {
        console.log('Invalid username or password');
      }

    } catch (error) {
      console.error('Error Loggin in: ', error);
    }
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleUsername}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handlePassowrd}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
