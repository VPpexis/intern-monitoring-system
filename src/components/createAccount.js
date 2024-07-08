import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { CssBaseline } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Firebase from '../scripts/Firebase.js';

const defaultTheme = createTheme();


/* 
Admin Create Account
  In-charge of creating new intern accounts in the database.
*/
export default function CreateAccount() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const firebase_instance = new Firebase();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');

        if (email && password && firstName && lastName) {
            try {
                await firebase_instance.pushAccount(email, password, firstName, lastName);
                setShowSuccess(true);
                setShowError(false);
            } catch (error) {
                console.error("Error creating account: ", error);
                setShowError(true);
                setShowSuccess(false);
            }
        } else {
            setShowError(true);
            setShowSuccess(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/dashboard');
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create Account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="given-name"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                        />
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                            {showSuccess && <Typography sx={{ color: 'green' }}>Account Created</Typography>}
                            {showError && <Typography sx={{ color: 'red' }}>All fields must not be empty.</Typography>}
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2}}
                        >
                            Create Account
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 0, mb: 2}}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
