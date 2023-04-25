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
import { Toolbar } from '@material-ui/core';
import TextField from '@mui/material/TextField'


export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [subject, setsubject] = React.useState("");
    const [OldPassword, setOldPassword] = React.useState();
    const [NewPassword, setNewPassword] = React.useState();
    const [CPassword, setCPassword] = React.useState();

    const [description, setdescription] = React.useState("");
    const [error, setError] = React.useState("");
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    // 


    const handleClickOpen = () => {
        setOpen(true);
    };
    const checkpass = () => {
        return ((NewPassword === CPassword) ? true : false)
    };
    const checkpassword = checkpass();
    console.log(OldPassword);
    const handleClose = () => {
        setOpen(false);
        setError(null);
    };


    

    const handlecurrpass = e => {
        setOldPassword(e.target.value);

    }
    const handlenewpass = e => {
        setNewPassword(e.target.value);

    }
    const handlecpass = e => {
        setCPassword(e.target.value);

    }

    const handleClick = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },

            oldPassword: OldPassword,
            newPassword: NewPassword



        }
        await axios.patch("http://localhost:4000/users/updatePassword", config, {
            headers: {
                Authorization: "basic " + token
            },

            oldPassword: OldPassword,
            newPassword: NewPassword


        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Password updated succesfully",
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

            <Button variant="outlined" onClick={handleClickOpen} size="large">
                CHANGE PASSWORD           </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Change Password"}
                </DialogTitle>
                <DialogContent>

                    <Toolbar>
                        <div className='currpass'> <TextField
                            id="outlined-password-input"
                            label="Current Password"
                            type="password"
                            autoComplete="current-password"
                            onChange={handlecurrpass}
                        /></div>
                        <div className='newpass'><TextField
                            id="outlined-password-input"
                            label="New Password"
                            type="password"
                            autoComplete="current-password"
                            onChange={handlenewpass}
                        /></div>
                    </Toolbar>
                    <Toolbar>
                        {checkpassword ? <div className='cnpass'><TextField
                            color='success'
                            id="outlined-password-input"
                            label="Confirm Password"
                            type="password"
                            autoComplete="current-password"
                            onChange={handlecpass}
                        /></div> : <div className='cnpass'><TextField
                            error
                            id="outlined-password-input"
                            label="Confirm Password"
                            type="password"
                            autoComplete="current-password"
                            onChange={handlecpass}
                        /></div>}

                    </Toolbar>
                    {error && <><h5 style={{ color: 'red' }}>{error}</h5></>}
                    {!checkpassword ? <div className='error'><h5 style={{ color: 'red' }}>"Passwords dont match!"</h5></div> : ""}
                </DialogContent>
                <DialogActions>

                    <Button autoFocus color='error' onClick={handleClose} > Close </Button>

                    {checkpassword ? <Button autoFocus onClick={handleClick} > Update </Button> : <Button disabled autoFocus onClick={handleClick} > Update </Button> }
                    

                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );

    }
