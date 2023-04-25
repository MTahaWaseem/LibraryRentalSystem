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
import { checkManager, getToken, setUserIDSession, setUserSession } from '../Utils/Common';
import Input from '../Admin_Components/Input.js';
import { InputAdornment } from '@mui/material';
import { Toolbar } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ResponsiveDialog from '../Admin_Components/Popup_password.js';
import { makeStyles } from '@material-ui/core';
import ViewReview from './ViewReview.jsx';
import ResponsiveDialog3 from '../Admin_Components/Popup_cart.js';

const useStyles = makeStyles(theme => ({



    paperbox: {
        backgroundColor: "#FFFFFF",
        background: "#ffffff",
        marginTop: "50rem",


    },

}))


const ViewBook = (props) => {

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
    const [currentBook, setCurrentBook] = React.useState(JSON.parse(sessionStorage.getItem('CurrentBook')))
    const [currentBookReviews, setCurrentBookReviews] = React.useState(sessionStorage.getItem('CurrentBookReviews'));
    const classes = useStyles();
    // const bookreviews = [
    //     {currentBook},
    //     {currentBookReviews}
    // ]
    //console.log(Phone);

    React.useEffect(() => {
        console.log(currentBookReviews);
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            book: currentBook.Book_ID
        }
        const fetchstuff = async () => {
            await axios.patch('http://localhost:4000/users/getOneBook', config, {
                headers: {
                    Authorization: "basic " + token
                },
                book: currentBook.Book_ID

            }).then(async response => {
                //   console.table(response.data.data.result.book);
                setCurrentBook(response.data.data.result.data[0]);
                sessionStorage.setItem('CurrentBook', JSON.stringify(response.data.data.result.data[0]));
                // window.location.assign('/ViewBook');

            }).catch(error => {

            });
            // window.location.assign("/ViewBook")
            await axios.patch('http://localhost:4000/users/getreviewsinglebook', config, {
                headers: {
                    Authorization: "basic " + token
                },
                book: currentBook.Book_ID

            }).then(async response => {
                //    console.table(response.data.data.message.Reviews);
                setCurrentBookReviews(response.data.data.message.Reviews);
                sessionStorage.setItem('CurrentBookReviews', JSON.stringify(response.data.data.message.Reviews));
                // window.location.assign('/ViewBook');

            }).catch(error => {
                if (error.response.status === 500) {
                    sessionStorage.setItem('CurrentBookReviews', "");
                    setCurrentBookReviews('');
                }
            });
        }
        fetchstuff();
    }, []);





    const checkmngr = async () => {
        return (Type == 1 ? true : false)
    };

    const checkcustomer = async () => {
        return (Type == 2 ? true : false)
    }



    const handleChangeAddress = e => {
        setAddress(e.target.value);
    }

    const handleChangeName = e => {
        setName(e.target.value);
    }
    const handleChangePhone = e => {
        setPhone(e.target.value);
    }

    const handleUpdate = async () => {

        let config = {
            headers: {
                Authorization: "basic " + token
            },

            name: Name,
            address: Address,
            contact: Phone
        }
        await axios.patch('http://localhost:4000/users/updateProfile', config, {
            headers: {
                Authorization: "basic " + token
            },

            name: Name,
            address: Address,
            contact: Phone

        }).then(async response => {

            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Profile updated successfully",
                type: 'success'
            })

            setTimeout(function () {
                window.location.reload(false);
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

    return (
        <div>
            <br /><br />


            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginLeft: '3rem',
                    marginTop: '0rem',
                    marginBottom: '3rem',
                    alignSelf: "center",
                    '& > :not(style)': {
                        m: 1,
                        width: "100rem",
                        height: "auto",
                        maxWidth: "100rem",
                        minWidth: "20rem",
                        padding: "2rem"
                    },
                }}
            > <Paper className={classes.paperbox} elevation={4}>
                    {console.log(currentBook != undefined)}
                    {(currentBook != undefined) ? <> <div className='booktitle'> <h1 ><center>{currentBook.Title}</center></h1> </div>
                        <Toolbar>
                            <div ><img className='bookimg' src={currentBook.Book_Image} ></img></div>

                            <Toolbar> <div className='bookauth'> <h5 ><center><b> Author: </b> {currentBook.Author}</center></h5> </div></Toolbar>
                            <Toolbar> <div className='bookde'> <h5 ><center><b> Description: </b></center></h5> </div></Toolbar>
                            <Toolbar> <div className='bookdesc'> <h6 > {currentBook.Description} </h6> </div></Toolbar>

                        </Toolbar>   <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                marginLeft: '80rem',
                                marginTop: '0rem',
                                '& > :not(style)': {
                                    m: 1,
                                    width: "100rem",
                                    height: "auto",
                                    maxWidth: "100rem",
                                    minWidth: "20rem",
                                    padding: "2rem"
                                },
                            }}> <Toolbar> <div className='cart'><ResponsiveDialog3></ResponsiveDialog3></div>  <Toolbar><h2 align="right"> <b>Price:</b> {currentBook.Price} </h2></Toolbar> </Toolbar>
                        </Box>
                    </> : <></>}


                </Paper>
            </Box>

            <ViewReview
                child={currentBookReviews}></ViewReview>



            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    )
}



export default ViewBook;