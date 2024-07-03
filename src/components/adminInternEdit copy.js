// src/components/adminInternEdit.js

import * as React from 'react';
import { useParams } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle.js';
import { Container,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
 } from '@mui/material';

const AdminInternEdit = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        //navigate('/admin');
    }

    React.useEffect(() => {
        
    }, []);

    return (
        <Container>
            <AppBar>
                <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Dashboard
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                >
                    <Avatar>
                    <AccountCircle />
                    </Avatar>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
                </Toolbar>
            </AppBar>
        </Container>
    );
}

export default AdminInternEdit;