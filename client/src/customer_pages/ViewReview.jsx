import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme} from '@mui/material/styles';
import EditOutlined from '@material-ui/icons/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import Notification from '../Admin_Components/Notifications.js';
import axios from 'axios';
import { checkManager, getToken,setUserIDSession,setUserSession } from '../Utils/Common';
import Input from '../Admin_Components/Input.js';
import { InputAdornment } from '@mui/material';
import { Toolbar } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ResponsiveDialog from '../Admin_Components/Popup_review.js';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
   
    
    
    paperbox: {
        backgroundColor: "#FFFFFF",
        background: "#ffffff",
        marginTop: "50rem",
       
        
    },
    add: {
        // backgroundColor: "#FFFFFF",
        // background: "#ffffff",
        marginLeft: "50rem",
       
        
    },
     
}))


export default function ViewReview(props) {

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
    const [currentBookReviews, setCurrentBookReviews] = React.useState(props.child);
    const classes = useStyles();
    const reviews = props.child;
    //console.log(Phone);
// console.log(reviews.length);
    React.useEffect(() => {
        
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            book : currentBook.Book_ID
        }
        const fetchstuff = async () => {
        await axios.patch('http://localhost:4000/users/getOneBook', config, {
            headers: {
                Authorization: "basic " + token
            },
            book : currentBook.Book_ID
                
            }).then(async response => {
             //   console.table(response.data.data.result.book);
                setCurrentBook(response.data.data.result.data[0]);
                sessionStorage.setItem('CurrentBook', JSON.stringify(response.data.data.result.data[0]));
                // window.location.assign('/ViewBook');
    
            }).catch(error => {
    
            });
        // window.location.assign("/ViewBook")
       await  axios.patch('http://localhost:4000/users/getreviewsinglebook', config, {
            headers: {
                Authorization: "basic " + token
            },
            book : currentBook.Book_ID
                
            }).then(async response => {
            //    console.table(response.data.data.message.Reviews);
                setCurrentBookReviews(response.data.data.message.Reviews);
                sessionStorage.setItem('CurrentBookReviews', JSON.stringify(response.data.data.message.Reviews));
                // window.location.assign('/ViewBook');
    
            }).catch(error => {
                if (error.response.status === 500)
                sessionStorage.setItem('CurrentBookReviews', "No reviews");
            });
        }
        fetchstuff();
      }, []);
    
      
      


 





    return (
        <div>
            <br/><br/>
            <Box
sx={{
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '3rem',
    marginTop: '0rem',
    marginBottom: '3rem',
    alignSelf:"center",
    '& > :not(style)': {
        m: 1,
        width: "100rem",
        height: "auto",
        maxWidth: "100rem",
        minWidth:"20rem",
        padding:"2rem"
    },
}}
> <Paper className = {classes.paperbox} elevation={4}>
<ResponsiveDialog></ResponsiveDialog>
 <div className='booktitle'> <h1 ><center>Reviews </center></h1> </div>
 
 
{ (reviews.length < '1' ) ? <h3><u>No reviews to show!</u></h3> : Object.values(reviews).map( item => {
    console.log(reviews.length);
   return ( <><Toolbar> <div className='bookde'> <h5 ><center><b> Rating: {item.Rating} / 10 </b></center></h5> </div></Toolbar> 
   <Toolbar> <div className='bookde'> <h5 ><center><b> Name: {item.Name}  </b></center></h5> </div></Toolbar>  
   <Toolbar><div className='bookdesc'> <h6 > <b>Review:</b> <br></br><br></br>{item.Review} </h6> </div> </Toolbar><hr></hr>
   <br/> </>)
   

   })
} 

</Paper>
   
{/* 
<Toolbar> <div className='bookde'> <h5 ><center><b> Rating: {currentBookReviews.Rating} / 10 </b></center></h5> </div></Toolbar> 
<Toolbar> <div className='bookde'> <h5 ><center><b> Name: {currentBookReviews.Name}  </b></center></h5> </div></Toolbar>  
<Toolbar><div className='bookdesc'> <h6 > <b>Review:</b> <br></br><br></br>{currentBookReviews.Review} </h6> </div> </Toolbar> */}


</Box>
           
        </div>
    )
}