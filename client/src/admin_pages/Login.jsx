import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession, setUserIDSession, getUser, removeUserSession, removeUserIDSession } from "../Utils/Common";
import ReactDOM from 'react-dom';
import '../Admin_Components/LoginForm.css'
import { BookSharp } from '@material-ui/icons';

const Login = (props) => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Books, setBooks] = useState();
    const[libraries, setLibraries] = useState();
    const cart = ["lol"];
    const CURRENTCARTLIBRARY = "empty";
    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        
       
        await axios.post("http://localhost:4000/users/login", {
            email: email,
            password: password
        }).then(async response => {
            sessionStorage.setItem("cart",JSON.stringify(cart));
            sessionStorage.setItem("CURRENTCARTLIBRARY",JSON.stringify(CURRENTCARTLIBRARY));
            setLoading(false);
            setError(null);
            setLoading(true);
            const token = response.data.data.message.token;
            setUserSession(token);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }

            await axios.get("http://localhost:4000/users/user-profile", config, {
            }).then(response => {
                setLoading(false);
                // console.log(response.data.data.result.profile[0]);
                setUserIDSession(response.data.data.result.profile[0]);

            }).catch(error => {
                setLoading(false);
                console.log("errors >>> ", error)
            }// console.log('error >>>', error);
            )
            if (response.data.data.message.Type == 2){
            await axios.get('http://localhost:4000/users/getBooks', {
            }).then(async response => {
                setBooks(response.data.data.result.data);
                sessionStorage.setItem('Books', JSON.stringify(response.data.data.result.data));
                //window.location.assign('/manager/Books');
                
            }).catch(error => {
          
            });
            await axios.get('http://localhost:4000/users/getLibrariesGeneral', {
            }).then(async response => {
               // console.table(response.data.data.message.libraries);
                setLibraries(response.data.data.message.libraries);
                console.table(libraries);
                sessionStorage.setItem('Libraries', JSON.stringify(response.data.data.message.libraries));
                //window.location.assign('/manager/Books');
                
            }).catch(error => {
          
            });
            
            await axios.get('http://localhost:4000/users/getCategory', {
            }).then(async response => {
                // console.table(response.data.data.message.Categories)
                sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
                setLoading(false);
                //window.location.assign('/manager/Books');
    
            }).catch(error => {
    
            });
            window.location.assign('/Home');}
            else if(response.data.data.message.Type == 1){
                window.location.assign('/manager/home');
            }
            else if (response.data.data.message.Type == 0) {
            window.location.assign('/admin/home');
            }
        }).catch(error => {
            setLoading(false);
            if (error.response.status === 500 || error.response.status === 400 ) {
                setError(error.response.data.data.message)
            }
        }
        )
        

    }

    return (

        <div>
            <br/> <br/> <br/>
             <div className="login-form py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card shadow-sm">
                                <span className="shape"></span>
                                <div className="card-header text-center ">
                                    <br/>
                                    <h2>Login</h2>
                                </div>
                                <div className="card-body py-4">
                                    <form action="#">
                                        <div className="row">
                                            <label >Email</label>
                                            <input type="text"  value={email} onChange={e => setEmail(e.target.value)}
                                                placeholder="Email" /><br />
                                        </div>
                                        <div className="row">
                                            <label >Password </label>
                                            <input type="password"  value={password} onChange={e => setPassword(e.target.value)}
                                                placeholder="Password" /><br />
                                        </div>
                                        <div id="alternativeLogin" className="container">


                                           
                                        
                                            <a href="/register"><small>Don't have an account?</small> </a>
                                            <br /><br />
                                        </div>
                                        <div className="form-group">
                                            <div className='error'>
                                            {error && <><h5 style={{ color: 'red' }}>{error}</h5></>}

                                            </div>
                                            <button type="button" id="button" className="row" onClick={handleLogin} value={loading ? 'Loading...' : 'Login'} disabled={loading} >Login</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div> 
            {/* <div id="container">
                 <LoginForm /> 
            </div>  */}
            
        </div>

    )
}


export default Login;