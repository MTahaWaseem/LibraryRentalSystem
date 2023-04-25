import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession, setUserIDSession, getUser, removeUserSession, removeUserIDSession } from "../Utils/Common";
import ReactDOM from 'react-dom';
import '../Admin_Components/Registerform.css'

const Register = (props) => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword,setcpass] = useState('');
    const [address,setAddress] = useState('');
    const [contact,setContact] = useState(''); 

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
         axios.post("http://localhost:4000/users/register", {
            name: name,
            email: email,
            password: password,
            address: address,
            contact : contact
         }).then(async response => {
            window.location.assign("/login");
         }).catch(error => {
            setLoading(false);
            if (error.response.status === 500) {
                setError(error.response.data.data.message || "Enter a valid email");
            }
        })
        // axios.post("http://localhost:4000/users/login", {
        //     email: email,
        //     password: password
        // }).then(async response => {
        //     setLoading(false);
        //     setError(null);
        //     setLoading(true);
        //     const token = response.data.data.message.token;
        //     setUserSession(token);
        //     let config = {
        //         headers: {
        //             Authorization: "basic " + token
        //         }
        //     }

        //     await axios.get("http://localhost:4000/users/user-profile", config, {
        //     }).then(response => {
        //         setLoading(false);
        //         // console.log(response.data.data.result.profile[0]);
        //         setUserIDSession(response.data.data.result.profile[0]);

        //     }).catch(error => {
        //         setLoading(false);
        //         console.log("errors >>> ", error)
        //     }// console.log('error >>>', error);
        //     )
        //     if (response.data.data.message.Type == 2)
        //         props.history.push('/dashboard');
        //     else {
        //         console.log("This isnt customer");
        //         removeUserIDSession();
        //         removeUserSession();
        //     }
        // }).catch(error => {
        //     setLoading(false);
        //     if (error.response.status === 500) {
        //         setError(error.response.data.data.message)
        //     }
        // }
        // )
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
                                    <i className="fas fa-user-circle"></i>
                                    <h2>Register</h2>
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
                                            <button type="button" id="button" className="row" onClick={handleRegister} value={loading ? 'Loading...' : 'Register'} disabled={loading} >Register</button>
                                        </div>
                                        
                                        <div className="form-group">
                                        

                                        <div id="alternativeLogin" className="container">
                                        <a href="/login"><small>Already a user?</small> </a>     
                                        </div>
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

export default Register;