// src/Dashboard.js
/*
TODO:
1. Add total Hours
*/
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Firebase from '../scripts/Firebase.js';
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
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Dashboard = () => {
  const { userID } = useParams();
  const [records, setRecords] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [anchorEl, setAnchorEl] = useState(null);
  const [dates, setDates] = useState([]);
  const firebase = new Firebase();
  const navigate = useNavigate();
  const effectRan  = useRef(false);

  useEffect(() => {
    generateDates(currentMonth, currentYear);
    
    const fetchDates = async () => {
      if (!effectRan.current) {
        const cloud_dates = await firebase.getDates(userID);
        console.log(cloud_dates);
        if(cloud_dates) {
          for (const [key, value] of Object.entries(cloud_dates)) {
            setRecords(prevRecords => [...prevRecords, { date: key, timeIn: value.timeIn, timeOut: value.timeOut, totalHours: value.totalHours }]);
          }

          for (let i = 0; i < cloud_dates.length; i++) {
            console.log(cloud_dates);
            
          }
        }
      }
    }
    fetchDates();
    return () => effectRan.current = true;
  }, [currentMonth, currentYear, userID]);

  const generateDates = (month, year) => {
    const date = new Date(year, month, 1);
    const datesArray = [];

    while (date.getMonth() === month) {
      datesArray.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    setDates(datesArray);
  };

  const handleClockInOut = () => {
    console.log(records);
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const dateString = now.toISOString().split('T')[0]; // get YYYY-MM-DD format
    console.log(userID);
    setRecords(prevRecords => {
      const recordIndex = prevRecords.findIndex(record => record.date === dateString);
      if (recordIndex >= 0) {
        // Record found, update the timeIn and timeOut fields
        const updatedRecords = [...prevRecords];
        if (updatedRecords[recordIndex].timeOut) {
          // Record already has timeOut, update the timeIn field
          return updatedRecords;
        } else {
          // Record found, update the timeOut field
          updatedRecords[recordIndex].timeOut = now.toLocaleTimeString('PST');
          updatedRecords[recordIndex].totalHours = calculateTotalHours(updatedRecords[recordIndex].timeIn, updatedRecords[recordIndex].timeOut);
          if (updatedRecords[recordIndex].timeIn.split(' ')[1] === 'AM' && updatedRecords[recordIndex].timeOut.split(' ')[1] === 'PM'){
            updatedRecords[recordIndex].totalHours = updatedRecords[recordIndex].totalHours - 1;
          }
          console.log(updatedRecords[recordIndex].totalHours, updatedRecords[recordIndex].timeIn, updatedRecords[recordIndex].timeOut);
          firebase.pushTimeInOut(userID, { timeOut: now.toLocaleTimeString('PST') }, dateString);
          firebase.pushTimeInOut(userID, { totalHours: updatedRecords[recordIndex].totalHours }, dateString);

          const totalHoursRendered = updatedRecords.reduce((total, record) => total + parseFloat(record.totalHours), 0).toFixed(2);
          firebase.pushTotalHoursRendered(userID, totalHoursRendered);
          console.log('totalHoursRendered', totalHoursRendered);
          console.log("timeout",dateString);
          return updatedRecords;
        }
      } else {
        // Record not found, create a new record
        console.log("timein", dateString, now.toLocaleTimeString('PST'), userID);
        console.log(firebase.pushTimeInOut(userID, { timeIn: now.toLocaleTimeString('PST') }, dateString));
        return [...prevRecords, { date: dateString, timeIn: now.toLocaleTimeString('PST'), timeOut: null, totalHours: null }];
      }
 
    });

  };

  const calculateTotalHours = (timeIn, timeOut) => {
    const timeInMeridian = timeIn.split(' ')[1];
    const timeOutMeridian = timeOut.split(' ')[1];
    timeIn = timeIn.split(' ')[0];
    timeOut = timeOut.split(' ')[0];
    const [hoursIn, minutesIn, secondsIn] = timeIn.split(':').map(Number);
    const [hoursOut, minutesOut, secondsOut] = timeOut.split(':').map(Number);
    
    const timeInDate = new Date();
    if (timeInMeridian === 'PM') {
      timeInDate.setHours(hoursIn + 12);
    }else{
      timeInDate.setHours(hoursIn);
    }
    timeInDate.setMinutes(minutesIn);
    timeInDate.setSeconds(secondsIn);

    const timeOutDate = new Date();
    if (timeOutMeridian === 'PM') {
      timeOutDate.setHours(hoursOut + 12);
    }else{
      timeOutDate.setHours(hoursOut);
    }
    timeOutDate.setMinutes(minutesOut);
    timeOutDate.setSeconds(secondsOut);
    const diff = Math.abs((timeOutDate - timeInDate)) / (1000 * 60 * 60);
    
    return diff.toFixed(2);
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
    // Handle logout logic here
    setRecords([]);
    navigate('intern-monitoring-system/');
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
                var day = date_data;
                day = day.toLocaleDateString('en-HK', { weekday: 'long' });
                const record = records.find(record => record.date === dateString);
                const totalHours = record && record.timeIn && record.timeOut && record.totalHours
                  ? record.totalHours
                  : '-';
                return (
                  <TableRow key={index}>
                    <TableCell>{dateString}</TableCell>
                    <TableCell>{day}</TableCell>
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
