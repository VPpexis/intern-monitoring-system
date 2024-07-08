import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Firebase from '../scripts/Firebase.js';
import CalculateTotalHours from '../scripts/calculateTotalHours.js';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Divider,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

/* 
Intern DashBoard:
  Intern dashboard. Shows the dashboard for the intern. Intern can clock-in and clock-out.
*/
const Dashboard = () => {
  const { userID } = useParams();
  const [records, setRecords] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [anchorEl, setAnchorEl] = useState(null);
  const [dates, setDates] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const firebase = new Firebase();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  useEffect(() => {
    generateDates(currentMonth, currentYear);

    const fetchDates = async () => {
      if (!effectRan.current) {
        const cloud_dates = await firebase.getDates(userID);
        const cloud_userInfo = await firebase.getUserInfo(userID);

        if (cloud_dates) {
          const newRecords = Object.entries(cloud_dates).map(([key, value]) => ({
            date: key,
            timeIn: value.timeIn,
            timeOut: value.timeOut,
            totalHours: value.totalHours,
          }));
          setRecords(newRecords);
          setUserInfo(cloud_userInfo);
        }
      }
    };

    fetchDates();
    return () => { effectRan.current = true; };
  }, [currentMonth, currentYear, userID, firebase]);

  const generateDates = (month, year) => {
    const date = new Date(year, month, 1);
    const datesArray = [];

    while (date.getMonth() === month) {
      datesArray.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    setDates(datesArray);
  };

  const handleClockInOut = async () => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    setRecords(prevRecords => {
      const recordIndex = prevRecords.findIndex(record => record.date === dateString);
      let updatedRecords;

      if (recordIndex >= 0) {
        // Record found, update the timeOut field
        updatedRecords = [...prevRecords];
        const currentRecord = updatedRecords[recordIndex];

        if (!currentRecord.timeOut) {
          currentRecord.timeOut = now.toLocaleTimeString('PST');
          currentRecord.totalHours = CalculateTotalHours(currentRecord.timeIn, currentRecord.timeOut);

          firebase.pushTimeInOut(userID, { timeOut: currentRecord.timeOut, totalHours: currentRecord.totalHours }, dateString);
          const totalHoursRendered = updatedRecords.reduce((total, record) => total + (parseInt(record.totalHours) || 0), 0);
          firebase.pushTotalHoursRendered(userID, totalHoursRendered);
        }
      } else {
        // Record not found, create a new record
        const newRecord = { date: dateString, timeIn: now.toLocaleTimeString('PST'), timeOut: null, totalHours: null };
        updatedRecords = [...prevRecords, newRecord];
        firebase.pushTimeInOut(userID, { timeIn: newRecord.timeIn }, dateString);
      }

      return updatedRecords;
    });
  };

  const handleMonthChange = (event) => {
    setCurrentMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setCurrentYear(event.target.value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setRecords([]);
    navigate('/');
  };

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
      <Box sx={{ mt: 10 }} />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timing In/Out Dashboard
        </Typography>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Box sx={{ mb: 2 }} display="flex">
          <Stack>
            <Typography>Account Information: </Typography>
            <Box ml={5}>
              <Stack direction={"row"}>
                <Typography mr={1} component={'div'} fontWeight={'bold'}>First Name: </Typography>
                <Typography>{userInfo.firstName}</Typography>
              </Stack>
              <Stack direction={'row'}>
                <Typography mr={1} component={'div'} fontWeight={'bold'}>Last Name: </Typography>
                <Typography>{userInfo.lastName}</Typography>
              </Stack>
              <Stack direction={'row'}>
                <Typography mr={1} component={'div'} fontWeight={'bold'}>Hours to be Rendered: </Typography>
                <Typography mr={2}>{userInfo.hoursToBeRendered}</Typography>
              </Stack>
              <Stack direction={'row'}>
                <Typography mr={1} component={'div'} fontWeight={'bold'}> Hours Rendered: </Typography>
                <Typography>{userInfo.hoursRendered}</Typography>
              </Stack>
              <Stack direction={'row'}>
                <Typography mr={1} component={'div'} fontWeight={'bold'}>Hours Left: </Typography>
                <Typography>{userInfo.hoursToBeRendered - userInfo.hoursRendered}</Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Button variant="contained" onClick={handleClockInOut} sx={{ mb: 2 }}>
            Clock In/Out
          </Button>
        </Box>
        <FormControl sx={{ mb: 2, minWidth: 120, mr: 2 }} size="small">
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={currentMonth}
            label="Month"
            onChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ mb: 2, minWidth: 120 }} size="small">
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={currentYear}
            label="Year"
            onChange={handleYearChange}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell>Lunch Break</TableCell>
                <TableCell>Time Out</TableCell>
                <TableCell>Total Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dates.map((date_data, index) => {
                var parseDate = ((data_date) => {
                  const localDate = new Date(data_date.getTime() - (data_date.getTimezoneOffset() * 60 * 1000));
                  return localDate.toISOString().split('T')[0];
                })(date_data);
                const dateString = parseDate;
                const dayString = date_data.toLocaleDateString('en-HK', { weekday: 'long' });
                const record = records.find(record => record.date === dateString);
                const totalHours = record && record.timeIn && record.timeOut ? parseInt(record.totalHours) : '-';
                return (
                  <TableRow key={index}>
                    <TableCell>{dateString}</TableCell>
                    <TableCell>{dayString}</TableCell>
                    <TableCell>{record?.timeIn || '-'}</TableCell>
                    <TableCell>12:00PM - 01:00PM</TableCell>
                    <TableCell>{record?.timeOut || '-'}</TableCell>
                    <TableCell>{totalHours}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Dashboard;
