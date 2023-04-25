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
import Notification from './Notifications';
import axios from 'axios';
import { getToken } from '../Utils/Common';
import Input from './Input';
import { InputAdornment } from '@mui/material';
import { Toolbar, TextField } from '@material-ui/core';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { ClassNames } from '@emotion/react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    
    box: {
        width: '100%',
        // marginLeft: '835px',
        // marginBottom: "20px"
    }
}))
export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [subject, setsubject] = React.useState("");
    const [review, setReview] = React.useState("");
    const [error, setError] = React.useState("");
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [rating, setRating] = React.useState('');
    const [bookid, setBookID] = React.useState(JSON.parse(sessionStorage.getItem("CurrentBook")).Book_ID);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const classes = useStyles();
    
 


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };
    

    const handleAdd = e => {
        setsubject(e.target.value);
        
    }

    const handleAdd1 = e => {
        setReview(e.target.value);
       
    }
    const handleChangeRating = e => {
        setRating(e.target.value);
    //    console.log(rating)
    // console.log(bookid);
    }

    const handleClick = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },

            // description: description,
            review: review,
            rating: rating,
            Book_ID: bookid,


        

        }
        await axios.post("http://localhost:4000/users/giveReview", config, {
            headers: {
                Authorization: "basic " + token
            },

            // description: description,
            review: review,
            rating: rating,
            Book_ID: bookid,


        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Review Posted successfully!",
                type: 'success'
            })
            setOpen(false);
            setTimeout(function () {
                window.location.reload(false);
            }, 1000);


        }).catch(error => {
            // console.log("lol");
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
        })

    }


    return (
        <div>
          <div className='add'>  <Fab color="primary" 
          aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab></div>
           
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Give Review"}
                </DialogTitle>
                <DialogContent>
                   
                    <Toolbar>
                    <Typography component="legend">Rating</Typography>
                    <Rating name="customized-10" defaultValue={2} max={10} value={rating} onChange={handleChangeRating} />
                   
                    </Toolbar>
                    <Toolbar>
                    <TextField
                    className={classes.box}
          id="outlined-multiline-static"
          label="Review"
          multiline
          rows={6}
          placeholder="Enter Review here"
          onChange={handleAdd1}
        />
                        {/* <TextField
                            autoFocus
                            margin="dense"
                            id="description"
                            label="Enter Review"
                            type="email"
                            fullWidth
                            variant="standard"
                            onChange={handleAdd1}
                        /> */}
                    </Toolbar>
                    {error && <><h5 style={{ color: 'red' }}>{error}</h5></>}
                </DialogContent>
                <DialogActions>

                    <Button autoFocus color='error' onClick={handleClose} > Close </Button>
                    <Button autoFocus onClick={handleClick} > Post </Button>


                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
