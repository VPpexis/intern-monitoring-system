
const CalculateTotalHours = (timeIn, timeOut) => {
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
    var diff = Math.abs((timeOutDate - timeInDate)) / (1000 * 60 * 60);
    //console.log('Time Diff: ', toString(parseInt(diff)));
    diff = parseInt(diff) == 0 ? '0': parseInt(diff).toString();
    //console.log('Prased Time Diff ', diff);
    return diff;
}

export default CalculateTotalHours;