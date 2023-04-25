import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EditOutlined from '@material-ui/icons/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import Notification from '../Admin_Components/Notifications.js';
import axios from 'axios';
import { checkManager, getToken,setUserIDSession,setUserSession } from '../Utils/Common';
import Input from '../Admin_Components/Input.js';
import { InputAdornment } from '@mui/material';
import { Toolbar } from '@material-ui/core';
// import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ResponsiveDialog from '../Admin_Components/Popup_password.js';
//import useState from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const useStyles = makeStyles(theme => ({
    
    box: {
        width: '100%',
        // marginLeft: '835px',
        // marginBottom: "20px"
    },
    box2: {
        width: '93%',
        marginLeft: '1rem',
        // marginBottom: "20px"
    }
}))
const Contact = (props) => {
    const [myOrders, setmyOrders] = React.useState(JSON.parse(sessionStorage.getItem('myOrders')));
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [Name, setName] = React.useState(JSON.parse(sessionStorage.getItem('user')).Name);
    const [Email, setEmail] = React.useState(JSON.parse(sessionStorage.getItem('user')).Email);
    const [lname, setlname] = React.useState(JSON.parse(sessionStorage.getItem('Library')))
    const [Address, setAddress] = React.useState(JSON.parse(sessionStorage.getItem('user')).Address);
    const [Phone, setPhone] = React.useState(JSON.parse(sessionStorage.getItem('user')).Contact);
    const [Type, setType] = React.useState(JSON.parse(sessionStorage.getItem('user')).Type);
    const token = getToken();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const cm = checkManager();
    const [myReviews, setmyReviews] = React.useState("");
    const classes = useStyles();
    const [libraries,setLibraries] = React.useState(JSON.parse(sessionStorage.getItem("Libraries")));
    const [LibraryID, setLibraryID] = React.useState(null);
    const [Subject, setSubject] = React.useState("")
    const [Description, setDescription] = React.useState("")
    
    //console.log(Phone);

    React.useEffect(() => {
        const token = getToken();
        if (!token) {
          return;
        }
        axios.get(`http://localhost:4000/auth/verifyToken?token=${token}`).then(async response => {
          setUserSession(response.data.token)
          //setUserIDSession(response.data.user);
          let config = {
            headers: {
              authorization: "basic " + token
            }
          }
          await axios.get("http://localhost:4000/users/user-profile", config, {
          }).then(response => {

            // console.log(response.data.data.result.profile[0]);
            setUserIDSession(response.data.data.result.profile[0]);
            setName(response.data.data.result.profile[0].Name);
            setEmail(response.data.data.result.profile[0].Email);
            setPhone(response.data.data.result.profile[0].Contact);
            setAddress(response.data.data.result.profile[0].Address);
        }).catch(error => {
            // setAuthLoading(false);
            // console.log("errors >>> ", error)
          })
    
        //   setAuthLoading(false);
        }).catch(error => {
          
        //   removeUserSession();
        //   removeUserIDSession();
        //   setAuthLoading(false);
        }); 
       
      }, []);
    
      
      


    const checkmngr = async () => {
        return (Type == 1 ? true : false)
    };

    const checkcustomer = async () => {
        return (Type == 2 ? true : false)
    }



    const handleChangeDescription = e => {
        setDescription(e.target.value);
    }

    const handleChangeSubject = e => {
        setSubject(e.target.value);
    }
    const handleChangePhone = e => {
        setPhone(e.target.value);
    }

    const handleOrders = async () => {
        
        setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getOrdersCustomer', config, {
            }).then(async response => {
                setmyOrders(response.data.data.message.info);
                sessionStorage.setItem('myOrders', JSON.stringify(response.data.data.message.info));
                setLoading(false);
                window.location.assign('/OrderHistory');

            }).catch(error => {

            });

        
    };

    const handleReviews = async () => {

        setLoading(true);
        let config = {
            headers: {
                Authorization: "basic " + token
            }
        }
        await axios.get('http://localhost:4000/users/getMyReviews', config, {
        }).then(async response => {

            setmyReviews(response.data.data.message.Reviews);
            sessionStorage.setItem('myReviews', JSON.stringify(response.data.data.message.Reviews));
            
            console.table(response.data.data.message.Reviews)
            setLoading(false);
            window.location.assign('/MyReviews');

        }).catch(error => {

        });        
    };

    const handleContact = async () => {

        let config = {
            headers: {
                Authorization: "basic " + token
            },

            library: LibraryID,
            subject: Subject,
            description: Description
        }
        await axios.post('http://localhost:4000/users/CustomerContact', config, {
            headers: {
                Authorization: "basic " + token
            },

            library: LibraryID,
            subject: Subject,
            description: Description

        }).then(async response => {

            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Thank you for contacting us! ",
                type: 'success'
            })
            
            setTimeout(function () {
                window.location.assign("/Home");
            }, 1000);
            //window.location.assign('/manager/Books');

        }).catch(error => {
            setLoading(false);
            if (error.response.status === 500) {
                //setError(error.response.data.data.message || "Enter a valid email");
                setNotify({
                    isOpen: true,
                    message: error.response.data.data.message,
                    type: 'error'
                })
                setError(error.response.data.data.message)
            }
        });

        
    };
    const handleChangeLibraryID = event => {
        
        setLibraryID(event.target.value);
        // console.log(event.target.value);
        
       
    }
    return (
        <div>
            <Toolbar></Toolbar>

            <div className='mprof'> <h1 ><center> Contact Us</center></h1> </div>


         
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginLeft: '39rem',
                    marginTop: '5rem',
                    '& > :not(style)': {
                        m: 1,
                        width: 515,
                        height: 390,
                    },
                }}
            >    
                <Paper elevation={12} >
                    <Toolbar>
                        {/* <div className='myorders'>  <Button variant="contained" onClick={handleOrders}> My Orders </Button></div> */}
                         {/* <div className='myreviews'> <Button  variant="contained" onClick={handleReviews}> My Reviews   </Button></div> */}
                    </Toolbar>
                    <Toolbar>
                        <div className='Subject'>  <TextField className={classes.box}id="outlined-search" label="Subject" type="search"  onChange={handleChangeSubject} value={Subject} /></div>
                       
                    <FormControl variant="standard"  sx={{ m: 1, minWidth: 200, tabSize: "250px", background: "#FFFF", marginLeft:"3rem"}}>
                    <InputLabel id="demo-simple-select-filled-label">Library</InputLabel>
                    <Select
                        className={classes.box}
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={LibraryID}
                        onChange={handleChangeLibraryID}
                    >
                       {/* <MenuItem value="">All</MenuItem> */}
                                {
                                    libraries.map(item => (
                                        <MenuItem value={item.Library_ID}>{item.Name}</MenuItem>
                                    ))
                                }
                    </Select>
                    
                </FormControl>
                        {/* <div className='ISBNe'> <TextField disabled id="outlined-read-only-input" label="Email" defaultValue={Email} InputProps={{ readOnly: true, }} helperText="*Not Changeable" /></div> */}
                    </Toolbar>

                    <nbsp></nbsp><nbsp></nbsp><nbsp></nbsp>
                                <br/>
                    <Toolbar>
                        {/* <div className='Address'>  <TextField id="outlined-search" label="Address" type="search" value={Address} InputLabelProps={{ shrink: true, }} onChange={handleChangeAddress} /> </div> */}
                        {/* <div className='Contact'> <TextField id="outlined-read-only-input" label="Contact" type="search" InputLabelProps={{ shrink: true, }} onChange={handleChangePhone} value={Phone} />    </div> */}
                        <TextField
                    className={classes.box2}
          id="outlined-multiline-static"
          label="Description"
          multiline
          rows={6}
          placeholder="Enter Query here"
          onChange={handleChangeDescription}
        />

                    </Toolbar>

                   
                 
                   <br/>     
                    
                        
                    
                    <Toolbar> <div className='updatepass'><Button  onClick={handleContact} > Contact </Button></div></Toolbar>
                    



                </Paper>
            </Box>



            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    )
}



export default Contact;