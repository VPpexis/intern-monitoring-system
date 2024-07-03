// src/components/adminInternEdit.js

/*
TODO:
    1. Add Total Hours To be Rendered Widget
    2. Add Editable Button for the Total Hours To Be Rendered
    3. Add Overall Renedered Hours
    4. Add Overall Hours To Be Rendered Left
*/
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Firebase from '../scripts/Firebase.js';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Stack
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Dashboard = () => {
  const { userID } = useParams();
  const [records, setRecords] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [anchorEl, setAnchorEl] = useState(null);
  const [dates, setDates] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [timeValue, setTimeValue] = useState('');
  const [editTextField ,setEditTextField] = useState(0);
  const firebase = new Firebase();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  useEffect(() => {
    generateDates(currentMonth, currentYear);

    const fetchDates = async () => {
      if (!effectRan.current) {
        const cloud_dates = await firebase.getDates(userID);
        const cloud_userInfo = await firebase.getUserInfo(userID);
        //console.log(cloud_dates);
        if (cloud_dates) {
            for (const [key, value] of Object.entries(cloud_dates)) {
                setRecords(prevRecords => [...prevRecords, { date: key, timeIn: value.timeIn, timeOut: value.timeOut, totalHours: value.totalHours }]);
                setUserInfo(cloud_userInfo);
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
    } else {
      timeInDate.setHours(hoursIn);
    }
    timeInDate.setMinutes(minutesIn);
    timeInDate.setSeconds(secondsIn);

    const timeOutDate = new Date();
    if (timeOutMeridian === 'PM') {
      timeOutDate.setHours(hoursOut + 12);
    } else {
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

  const handleHomeClick = () => {
    setRecords([]);
    navigate('intern-monitoring-system/admin/dashboard');
  }

  const handleCreateAccountClick = () => {
    navigate('intern-monitoring-system/admin/create-account');
  }

  const handleCellClick = (record, field) => {
    if (record) {
      setSelectedRecord(record);
      setSelectedField(field);
      var now = new Date();
      if (record[field].split(' ')[1] === 'PM' && parseInt(record[field].split(':')[0]) < 12) {
        now.setHours(parseInt(record[field].split(':')[0]) + 12);
      } else {
        now.setHours(record[field].split(':')[0]);
      }
      
      now.setMinutes(record[field].split(':')[1]);
      now.setMilliseconds(0);
      console.log(now.toTimeString());
      setTimeValue(now);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleTimeChange = (event) => {
    console.log('handleTimeChange', event.hour());
    const now = new Date();
    try{
    now.setHours(event.hour());
    console.log('setHours');
    now.setMinutes(event.minute());
    setTimeValue(now);
    }catch(e){};
  };

  const handleEditClick = (e) => {
    setEditDialogOpen(true);
  };

  const handleEditTextField = async (e) => {
    console.log(e.target.value);
    await setEditTextField(e.target.value);
  }

  const handleDialogSave = () => {
    console.log(selectedField);
    const updatedRecords = records.map(record => {
      if (record.date === selectedRecord.date) {
        const updatedRecord = { ...record, [selectedField]: timeValue.toLocaleTimeString('PST') };
        if (selectedField === 'timeIn' && updatedRecord.timeOut) {
            updatedRecord.totalHours = calculateTotalHours(updatedRecord.timeIn, updatedRecord.timeOut);
            const totalHoursRendered = records.reduce((total, record) => total + parseFloat(record.totalHours), 0).toFixed(2);
            firebase.pushTotalHoursRendered(userID, totalHoursRendered);
            console.log('totalHoursRendered', totalHoursRendered);
        } else if (selectedField === 'timeOut' && updatedRecord.timeIn) {
            updatedRecord.totalHours = calculateTotalHours(updatedRecord.timeIn, updatedRecord.timeOut);
            const totalHoursRendered = records.reduce((total, record) => total + parseFloat(record.totalHours), 0).toFixed(2);
            firebase.pushTotalHoursRendered(userID, totalHoursRendered);
        }
        console.log(updatedRecord.totalHours);
        firebase.pushTimeInOut(userID, { [selectedField]: timeValue.toLocaleTimeString('PST') }, record.date);
        firebase.pushTimeInOut(userID, { totalHours: updatedRecord.totalHours }, record.date);
        
        return updatedRecord;
      }
      return record;
    });

    setRecords(updatedRecords);
    handleDialogClose();
  };

  const handleEditDialogSave = async () => {
    console.log('Saved');
    console.log(editTextField)
    await setUserInfo({ ...userInfo, hoursToBeRendered: editTextField });
    firebase.pushHoursToBeRendered(userID, editTextField);
    handleEditDialogClose();
    };

  return (
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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Time In/Out Dashboard
        </Typography>
        <Divider  sx={{ mt: 2, mb : 1 }} />
        <Box sx={{ mb: 2 }} display="flex">
            <Stack>
            <Typography>Account Information: </Typography>
            <Box ml={5}>
                <Stack direction={"row"}>
                    <Typography mr={1} component={'div'} fontWeight={'bold'}>First Name: </Typography>
                    <Typography>{userInfo.firstName}</Typography>
                </Stack>
                <Stack direction={"row"}>
                    <Typography mr={1} component={'div'} fontWeight={'bold'}>Last Name: </Typography>
                    <Typography>{userInfo.lastName}</Typography>
                </Stack>
                <Stack direction = {"row"}>
                    <Typography mr={1} component={'div'} fontWeight={'bold'}>Hours to Be Rendered: </Typography>
                    <Typography mr={2}>{userInfo.hoursToBeRendered}</Typography>
                    <span
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={handleEditClick}
                >
                    Edit
                </span>
                </Stack>
                <Stack direction = {"row"}>
                    <Typography mr={1} component={'div'} fontWeight={'bold'}>Hours Rendered: </Typography>
                    <Typography>{userInfo.hoursRendered}</Typography>
                </Stack>
                <Stack direction = {"row"}>
                    <Typography mr={1} component={'div'} fontWeight={'bold'}>Hours Left: </Typography>
                    <Typography>{userInfo.hoursToBeRendered - userInfo.hoursRendered}</Typography>
                </Stack>
            </Box>
            </Stack>
        </Box>
        <Divider  sx={{ mb : 2 }} />
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
                const record = records.find(record => record.date === dateString);
                const totalHours = record && record.timeIn && record.timeOut && record.totalHours
                  ? record.totalHours
                  : '-';
                return (
                  <TableRow key={index}>
                    <TableCell>{dateString}</TableCell>
                    <TableCell>{date_data.toLocaleDateString('default', { weekday: 'long' })}</TableCell>
                    <TableCell onClick={() => handleCellClick(record, 'timeIn')} style={{ cursor: 'pointer' }}>
                      {record?.timeIn || '-'}
                    </TableCell>
                    <TableCell>12:00PM - 01:00PM</TableCell>
                    <TableCell onClick={() => handleCellClick(record, 'timeOut')} style={{ cursor: 'pointer' }}>
                      {record?.timeOut || '-'}
                    </TableCell>
                    <TableCell>{totalHours}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Hours</DialogTitle>
        <DialogContent>
            <TextField type="number" InputProps={{ inputProps: { min: 0 }}} onChange={handleEditTextField}></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Time</DialogTitle>
        <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimeField']}>
                    <TimeField
                        autoFocus
                        margin="dense"
                        label="Time"
                        fullWidth
                        value={dayjs(timeValue)}
                        onChange={(newValue) => handleTimeChange(newValue)}
                    />
                </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
