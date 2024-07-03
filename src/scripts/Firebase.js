// src/scripts/firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase, 
        ref, 
        push, 
        orderByChild,
        query,
        get,
        set,
        equalTo } from 'firebase/database';



class Firebase {
    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyC_5EQoLzeT6m3AWjnuqTMu8EjSF_CUSY4",
            authDomain: "borcelisinternsystem.firebaseapp.com",
            databaseURL: "https://borcelisinternsystem-default-rtdb.firebaseio.com",
            projectId: "borcelisinternsystem",
            storageBucket: "borcelisinternsystem.appspot.com",
            messagingSenderId: "281978820189",
            appId: "1:281978820189:web:c099d2c7d23de024141fb4",
            measurementId: "G-NRBSPJC6RD"
          };

        initializeApp(firebaseConfig);
        this.database = getDatabase();
    }

    async pushAccount(user, pass, firstName, lastName) {
        const usersRef = ref(this.database, 'users/interns');
        //const ref = this.database.ref('/users/interns');

        return push(usersRef,{
            user: user,
            pass: pass,
            firstName: firstName,
            lastName: lastName
        });
    }

    async pushTimeInOut(userID, timedata, date) {
        console.log(`users/interns/${userID}/date`);
        
        if (timedata.hasOwnProperty('timeIn')) {
            const usersRef = ref(this.database, `users/interns/${userID}/dates/${date}/timeIn`);
            return set(usersRef, timedata.timeIn)
        }
        if (timedata.hasOwnProperty('timeOut')) {
            const usersRef = ref(this.database, `users/interns/${userID}/dates/${date}/timeOut`);
            return set(usersRef, timedata.timeOut);
        
        } if (timedata.hasOwnProperty('totalHours')) {
            const usersRef = ref(this.database, `users/interns/${userID}/dates/${date}/totalHours`);
            return set(usersRef, timedata.totalHours);
        } else {
            console.error("No valid key found in timedata");
        }
    }

    async pushTotalHoursRendered(userID, hours) {
        const usersRef = ref(this.database, `users/interns/${userID}/hoursRendered`);
        console.log(typeof hours)
        return set(usersRef, parseFloat(hours));
    }

    async pushHoursToBeRendered(userID, hours) {
        const usersRef = ref(this.database, `users/interns/${userID}/hoursToBeRendered`);
        return set(usersRef, parseFloat(hours));
    }

    async loginInternAccount(user, pass) {
        //const ref = this.database.ref('/users/interns');
        //const snapshot = await ref.orderByChild('user').equalTo(user).once('value');

        const usersRef = ref(this.database, 'users/interns');
        const userQuery = query(usersRef, orderByChild('user'), equalTo(user));
        const snapshot = await get(userQuery);
        const userData = snapshot.val();

        if (userData) {
            const userId = Object.keys(userData)[0];
            const user = userData[userId];
            if (user.pass === pass) {
                console.log("Login Success...");
                return userId;
            }
        }
        return false;
    }

    async loginAdminAccount(user, pass) {
        const usersRef = ref(this.database, 'users/admin');
        const snapshot = await get(usersRef);
        const userData = snapshot.val();
        console.log(userData);

        if (userData) {
            if (userData.user === user && userData.pass === pass) {
                console.log("Login Success...");
                return true;
            }
        }
    }

    async getDates(userID) {
        const usersRef = ref(this.database, `users/interns/${userID}/dates`);
        const snapshot = await get(usersRef);
        const dates = snapshot.val();
        return dates;
    }

    async getUserInfo(userID) {
        const usersRef = ref(this.database, `users/interns/${userID}`);
        const snapshot = await get(usersRef);
        const userData = snapshot.val();
        return {
            firstName: userData.firstName,
            lastName: userData.lastName,
            hoursToBeRendered: userData.hoursToBeRendered,
            hoursRendered: userData.hoursRendered};
    }

    async getAllInternUsers() {
        const usersRef = ref(this.database, 'users/interns');
        const snapshot = await get(usersRef);
        const usersData = snapshot.val();

        if (!usersData){
            return [];
        }

        const interns = Object.keys(usersData).map(key => {
            const { firstName, lastName, hoursToBeRendered, hoursRendered } = usersData[key];
            return {
                id: key,
                firstName,
                lastName,
                hoursToBeRendered,
                hoursRendered
            };
        });
        return interns;
    }
}

export default Firebase;