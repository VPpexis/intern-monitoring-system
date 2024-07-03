import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { CssBaseline } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Firebase from '../scripts/Firebase.js';

const defaultTheme = createTheme();

export default function CreateAcount() {
    const [showText, setShowText] = useState(false);
    const [showText2, setShowText2] = useState(true);
    const [data, setData] = useState({});
    const firebase_instance = new Firebase();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log({ 
            email: data.get('email'),
            password: data.get('password'),
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
        });
        console.log(data.values());
        firebase_instance.pushAccount(data.get('email'), data.get('password'), data.get('firstName'), data.get('lastName'));
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

                        Sign In
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
                            autoFocus
                        ></TextField>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="firstName"
                            autoFocus
                        ></TextField>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lastName"
                            autoFocus
                        ></TextField>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            autoComplete="current-password"
                        ></TextField>
                        <Box sx={{ mt: 1 , alignItems: 'center', display: 'flex'}}>
                            {showText && <Typography sx={{ color: 'green', Itemaligns: 'center'}}> Account Created</Typography>}
                            {showText2 && <Typography sx={{ color: 'red', Itemaligns: 'center'}}> All Fields must not be empty.</Typography>}
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2}}
                            onClick={handleSubmit}
                        >
                                Sign In
                        </Button>
                        <Button
                            type="cancel"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 0, mb: 2}}
                            onClick={handleCancel}
                        >
                                cancel
                        </Button>
                        <Grid Container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
