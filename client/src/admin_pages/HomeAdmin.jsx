import React,{useState} from 'react';
import './HomeAdmin.css'
import axios from 'axios';
import { getToken } from '../Utils/Common';





const HomeAdmin = () => {
  const [libraries, setLibraries] = useState(JSON.parse(sessionStorage.getItem('libraries')));
  const [Users, setUsers] = useState(JSON.parse(sessionStorage.getItem('Users')));
  const [requests, setRequests] = useState(JSON.parse(sessionStorage.getItem('requests')));
  const [loading, setLoading] = useState(false);
  const token = getToken();

  
  const fetchUsers = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/getUsers', config, {
    }).then(async response => {
        setUsers(response.data.data.message.Customers);
        sessionStorage.setItem('Users', JSON.stringify(response.data.data.message.Customers));
        //console.log(libraries);
        setLoading(false);
        window.location.assign('/admin/Users')
        
    }).catch(error => {

    });

};
  const fetchlibraries = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/getLibraries', config, {
    }).then(async response => {
        setLibraries(response.data.data.message.libraries);
        sessionStorage.setItem('libraries', JSON.stringify(response.data.data.message.libraries));
        setLoading(false);
        window.location.assign('/admin/Libraries');
        
    }).catch(error => {
  
    });
  
  };

  const fetchrequest = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/getQueriesManager', config, {
    }).then(async response => {
        setRequests(response.data.data.message.Queries);
        sessionStorage.setItem('requests', JSON.stringify(response.data.data.message.Queries));
        setLoading(false);
        window.location.assign('/admin/Requests');
        
    }).catch(error => {
  
    });
  
  };
  return (
    <div className='HomeAdmin'>
      
        
        {/* <div class="container-homeadmin"><img class="cover" src="./img/undraw.png" /></div> */}
        <div className="zone blue grid-wrapper">
        
        
          <div className="boxfirst zone"><a href="/admin/RegisterManager" className="mylink">
          <img src="https://cdn0.iconfinder.com/data/icons/audio-video-industry-1/240/Add_to_library-256.png"></img>
          <h2>Create Library</h2></a>
          </div> 
          
          <div className="box zone"><a  onClick={fetchUsers} className="mylink2">
          <img src="https://cdn2.iconfinder.com/data/icons/linkedin-ui/48/jee-100-256.png"></img>
          <h2>Users</h2></a>
          </div>
         
          <div className="boxlast zone"><a onClick={fetchlibraries} className="mylink3">
          <img src="https://cdn1.iconfinder.com/data/icons/education-outlines/100/15-256.png"></img>
          <h2>Libraries</h2></a>
          </div>
          
          <div className="boxrequest zone"><a onClick={fetchrequest} className="mylink4">
          <img src="https://cdn-icons-png.flaticon.com/512/901/901533.png"></img>
          <h2>Requests</h2></a>
          </div>
          
          
        </div>
        
        
    </div>


  )
}

export default HomeAdmin;