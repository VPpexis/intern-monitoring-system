// src/components/adminDashboard.js
/*
TODO:
1. Add navigation for each account to allow edit of details.
2. Add Intern Information widget.
*/ 
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Firebase from '../scripts/Firebase.js';
import AccountCircle from '@mui/icons-material/AccountCircle.js';
import { Container,
        AppBar,
        Toolbar,
        Typography,
        Box,
        IconButton,
        Menu,
        MenuItem,
        Avatar,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        Button,
        TableHead,
        TableRow,
        Paper,
        } from '@mui/material';
import { styled } from '@mui/system';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        //backgroundColor: theme.palette.action.hover,
    },
}))

/* 
Admin DashBoard:
  In-charge of Admin Dashboard. It shows the list of all accounts.
*/
const AdminDashboard = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [data, setData] = React.useState([]);
    const navigate = useNavigate();
    const firebase = new Firebase();

    const tempData = [
        {name: 'John Doe', hoursToBeRendered: 160, totalHoursRendered: 128, hoursLeft: 40 },
        {name: 'Jane Smith', hoursToBeRendered: 160, totalHoursRendered: 128, hoursLeft: 40 },
        {name: 'Alice Johnson', hoursToBeRendered: 160, totalHoursRendered: 128, hoursLeft: 40 },
    ]

    const handleRowClick = (e) => {
        console.log('Selected: ', e);
        navigate(`/admin/edit/${e.id}`);
    }
    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleHomeClick = () => {
        navigate('/admin/dashboard');
    }

    const handleCreateAccountClick = () => {
        navigate('/admin/create-account');
    }

    const handleLogout = () => {
        navigate('/admin');
    }

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                var tempData = await firebase.getAllInternUsers();
                tempData.map((row, index) => {
                    tempData[index]['hoursLeft'] = row['hoursToBeRendered'] - row['hoursRendered'];
                    return tempData;
                })
                setData(tempData);
            } catch (error) {
                console.error('Error fetching intern data: ', error);
            }
        };
        
        fetchData();
    }, []);
    return(
        <Container>
            <AppBar sx={{ }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'right' }}>
            <Typography variant="h6" sx={{  }} mr={2}>
            Intern Monitoring System
            </Typography>
            <Button color="inherit" onClick={handleHomeClick}>Home</Button>
            <Button color="inherit" onClick={handleCreateAccountClick}>Create Account</Button>
            </Box>
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
            <Box sx={{ mt: 10 }} />
            <Box sx={{ my: 4 }} >
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Dashboard
                </Typography>
            </Box>
            <Box>
                <Typography variant="h5" component="h1" gutterBottom>
                    Intern List
                </Typography>
                <TableContainer component={Paper}>
                    <Table size='small' aria-label='hours table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Last Name</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell align='right'>Hours to be Rendered</TableCell>
                                <TableCell align='right'>Total Hours Rendered</TableCell>
                                <TableCell align='right'>Hours Left</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <StyledTableRow
                                    key={row.id}
                                    hover
                                    onClick={() => handleRowClick(row)}
                                    >
                                        <TableCell component='th' scope='row'>
                                            {row.lastName}
                                        </TableCell>
                                        <TableCell component='th' scope='row'>
                                            {row.firstName}
                                        </TableCell>
                                        <TableCell align='right'>{row.hoursToBeRendered}</TableCell>
                                        <TableCell align='right'>{row.hoursRendered}</TableCell>
                                        <TableCell align='right'>{ row.hoursLeft ? row.hoursLeft: '' }</TableCell>
                                    </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default AdminDashboard;