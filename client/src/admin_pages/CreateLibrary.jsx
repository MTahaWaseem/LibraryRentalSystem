import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession, setUserIDSession, getUser, removeUserSession, removeUserIDSession, getToken } from "../Utils/Common";
import ReactDOM from 'react-dom';
import '../Admin_Components/LoginForm.css'
import Notification from '../Admin_Components/Notifications';

const CreateLibrary = (props) => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [Name, setName] = useState('');
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''});
    const manager = JSON.parse(sessionStorage.getItem('Manager_ID'));
    const token = getToken();
    const handleCreate = async () => {
        setError(null);
        setLoading(true);
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            name: Name,
            manager: manager
        }
        axios.post("http://localhost:4000/users/CreateLibrary",config, {
            headers: {
                Authorization: "basic " + token
            },
            name: Name,
            manager: manager
        }).then(async response => {
            setLoading(false);
            setError(null);
            setLoading(true);
            // console.log(response.data.data.message)
            setNotify({
                isOpen: true,
                message: response.data.data.message,
                type: 'success'
            })
            setTimeout(function () {
                window.location.assign("/admin/home");
            }, 1500);

            
        }).catch(error => {
            setLoading(false);
            if (error.response.status === 500 || error.response.status === 400 ) {
               setError(error.response.data.data.message)
                setNotify({
                    isOpen: true,
                    message: error.response.data.data.message,
                    type: 'error'
                })
            }
        }
        )

    }

    return (

        <div>
            <br/><br/><br/><br/><br/><br/>
             <div className="login-form py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card shadow-sm">
                                <span className="shape"></span>
                                <div className="card-header text-center bg-transparent">
                                    <br/>
                                    <h2>Enter Name of library</h2>
                                </div>
                                <div className="card-body py-4">
                                    <form action="#">
                                        <div className="row">
                                            <label >
                                                Name:
                                            </label>
                                            <input type="text"  value={Name} onChange={e => setName(e.target.value)}
                                                placeholder="Enter Here" /><br />
                                        </div>
                                        


                                        <Notification 
                                            notify={notify}
                                            setNotify={setNotify}/>
                                           
                                        
                                            
                                        
                                        <div className="form-group">
                                            <div className='error'>
                                            {error && <><h5 style={{ color: 'red' }}>{error}</h5></>}

                                            </div>
                                            <button type="button" id="button" className="row" onClick={handleCreate} value={loading ? 'Loading...' : 'Create'} disabled={loading} >Create</button>
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


export default CreateLibrary;