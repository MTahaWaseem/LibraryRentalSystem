import React, { useState } from 'react';
import axios from 'axios';
import {getToken, getUser} from "../Utils/Common";
import ReactDOM from 'react-dom';
import '../Components/Registerform.css'
import Notification from '../Components/Notifications';

const RegisterManager = (props) => {
    const user = getUser();
    const token = getToken();
    

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword,setcpass] = useState('');
    const [address,setAddress] = useState('');
    const [contact,setContact] = useState(''); 
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''});

    const handleRegister = async() => {
        if(email === "" ){
            setError("Enter valid email!");
        }
        else if(name === "" ){
            setError("Enter Name!");
        }
        else if(password === "" || cpassword === "" ){
            setError("Enter Password and Confirm Password fields!");
        }
        else if(address === ""){
            setError("Enter an address!");
        }
        else if(contact === ""){
            setError("Enter a contact no.!");
        }
        else if (password != cpassword){
            setError("Passwords do not match!");
        }
        else{
        setError(null);
        setLoading(true);
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            name: name,
            email: email,
            password: password,
            address: address,
            contact : contact
        }
         axios.post("http://localhost:4000/users/RegisterManager", config, {
            headers: {
                Authorization: "basic " + token
            },
            name: name,
            email: email,
            password: password,
            address: address,
            contact : contact
         }).then(response => {
             sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
             window.location.assign("/admin/CreateLibrary");
             setNotify({
                 isOpen: true,
                 message: 'Manager Registered Successfully!',
                 type: 'success'
             })
             
            
            
         }).catch(error => {
            // console.log("lol");
            setLoading(false);
            if (error.response.status === 500) {
                setError(error.response.data.data.message || "Enter a valid email");
                setNotify({
                    isOpen: true,
                    message: error.response.data.data.message || "Enter a valid email",
                    type: 'error'
                })
            }
        })
        
    }
    }
    return (
        <div>
            <div className="login-form py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card shadow-sm">
                                <span className="shape"></span>
                                <div className="card-header text-center ">
                                    
                                    <h2>Make Manager for new library!</h2>
                                </div>
                                <div className="card-body py-4">
                                    <form action="#">
                                        <div className="row">
                                            <label >Name</label>
                                            <input type="text"  value={name} onChange={e => setName(e.target.value)}
                                             placeholder="Full Name" /><br />
                                        </div>
                                        <div className="row">
                                            <label >Email</label>
                                            <input type="text"  value={email} onChange={e => setEmail(e.target.value)} 
                                            placeholder="Email" /><br />
                                        </div>
                                        <div className="row">
                                            <label >Password </label>
                                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} 
                                             placeholder="Password"  /><br />
                                        </div>
                                        <div className="row">
                                            <label >Confirm Password</label>
                                            <input type="password"  value={cpassword} onChange={e => setcpass(e.target.value)} 
                                            placeholder="Confirm Password"  /><br />
                                        </div>
                                        <div className="row">
                                            <label >Address</label>
                                            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                                            placeholder="Address"  /><br />
                                        </div>
                                        <div className="row">
                                            <label >Contact</label>
                                            <input type="number"  value={contact} onChange={e => setContact(e.target.value)}
                                             placeholder="Contact"  />
                                        </div>
                                        <br /><br />
                                        <div className="form-group">    
                                        <div className="error"> 
                                            {error && <><h5 style={{ color: 'red' }}>{error}</h5></>} </div>
                                            
                                            <button type="button"id="button" className="row" onClick={handleRegister} value={loading ? 'Loading...' : 'Register'} disabled={loading} >Create Manager</button>
                                        </div>
                                        
                                        <div className="form-group">
                                        

                                        <Notification 
                                            notify={notify}
                                            setNotify={setNotify}/>
                                        </div> 
                                        
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterManager;