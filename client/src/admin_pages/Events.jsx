import React, { useState } from 'react';
import axios from 'axios';
import Events  from '../Admin_Components/Events.js';


const Eventpage = (props) => {
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    //const events = sessionStorage.getItem(events);
    //const events = JSON.parse(sessionStorage.getItem('events'))
    // const events = [
    //     {Title: 'Enigma', subtext: 'Best event', category: 'Entertainment'},
    //     {Title: 'Probattle', subtext: 'lol', category: 'Studious'}
    // ]
    //console.log(events);

    const event2 = JSON.parse(sessionStorage.getItem('events'));

    console.log(event2);
    // const handleEvents = async() => {
        
    //     setLoading(true);

    //      await axios.get("http://localhost:4000/users/getEvents",{
    //     }).then( response => {
    //         setLoading(false);
    //         const events = response.data.data.message.results;
    //         console.log(events);
    //        sessionStorage.setItem('events', JSON.stringify(events));

    //     }).catch(error => {
    //         setLoading(false);
    //         console.log("errors >>> ", error)
    //     }// console.log('error >>>', error);
    //     )
        
        
    // }
   // const events = JSON.parse(sessionStorage.getItem(events));
    const getEvents = event2.map((sol) => <Events TITLE={sol.TITLE} EVENT_SUBTEXT={sol.EVENT_SUBTEXT} EVENT_CATEGORY={sol.EVENT_CATEGORY} EVENT_IMAGE_THUMB={sol.EVENT_IMAGE_THUMB}/>);
    return(  
        <div><h1><center>Events</center> </h1> 
            <br /><br />
        
            {
                getEvents
            }
             
           
        </div>
    )
}

export default Eventpage;