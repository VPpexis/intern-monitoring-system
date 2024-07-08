import * as React from 'react';
import { Container, AppBar, Toolbar, Box, Button, Avatar, Tooltip, IconButton,
    Menu, MenuItem, Typography
 } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Logout'];


/*
Navbar Component
Code for Navbar.
*/
export default function NavBarAdmin() {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (e) => {
        setAnchorElUser(e.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseNavMenu = () => {
        
    };

    return (
    <Container>
        <AppBar>
        <Container maxWidth='xl'>
            <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
                    {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >{page}</Button>
                    ))}
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleCloseNavMenu} sx={{ p: 0 }}>
                            <Avatar>
                                <AdbIcon />
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
        </AppBar>
    </Container>
    );
}