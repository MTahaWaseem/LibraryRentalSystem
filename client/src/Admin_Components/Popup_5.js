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



export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [subject, setsubject] = React.useState("");
    const [description, setdescription] = React.useState("");
    const [error, setError] = React.useState("");
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
 


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
        setdescription(e.target.value);
       
    }

    const handleClick = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },

            description: description,
            subject: subject

        

        }
        await axios.post("http://localhost:4000/users/RequestCategory", config, {
            headers: {
                Authorization: "basic " + token
            },

            description: description,
            subject: subject


        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Request made successfully",
                type: 'success'
            })
            setOpen(false);
            setTimeout(function () {

            }, 500);


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

            <Button variant="outlined" onClick={handleClickOpen}>
                Request Admin           </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Enter Request"}
                </DialogTitle>
                <DialogContent>
                   
                    <Toolbar>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="subject"
                            label="Enter Subject"
                            type="email"
                            fullWidth
                            variant="standard"
                            onChange={handleAdd}
                        />
                   
                    </Toolbar>
                    <Toolbar>
                      
                        <TextField
                            autoFocus
                            margin="dense"
                            id="description"
                            label="Enter Description"
                            type="email"
                            fullWidth
                            variant="standard"
                            onChange={handleAdd1}
                        />
                    </Toolbar>
                    {error && <><h5 style={{ color: 'red' }}>{error}</h5></>}
                </DialogContent>
                <DialogActions>

                    <Button autoFocus color='error' onClick={handleClose} > Close </Button>
                    <Button autoFocus onClick={handleClick} > Create </Button>


                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
