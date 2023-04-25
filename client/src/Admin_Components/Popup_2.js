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
import Notification from '../Admin_Components/Notifications';
import axios from 'axios';
import { getToken } from '../Utils/Common';


export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const User = props.user;
    const Flag = props.flag;
    console.log(User);
    //console.log(Library);



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleBlock = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },
            flag: '1',
            user: User

        }
        await axios.patch("http://localhost:4000/users/setCustomerFlag", config, {
            headers: {
                Authorization: "basic " + token
            },
            flag: '1',
            user: User

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "User Blocked!",
                type: 'error'
            })


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
            }
        })

        setOpen(false);

        setTimeout(function () {
            window.location.reload(false);
        }, 1500);


    };
    const handleUnblock = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },
            flag: '0',
            user: User

        }
        await axios.patch("http://localhost:4000/users/setCustomerFlag", config, {
            headers: {
                Authorization: "basic " + token
            },
            flag: '0',
            user: User

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "User Unblocked!",
                type: 'success'
            })


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
            }
        })

        setOpen(false);

        setTimeout(function () {

           window.location.reload(false);
        }, 1500);

    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                <EditOutlined />
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Update Block Flag"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose whether library needs to be blocked or unblocked.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {Flag == '1' 
                    ? 
                    <Button autoFocus color="error" onClick={handleBlock} disabled>Block </Button> 
                    : 
                    <Button autoFocus color="error" onClick={handleBlock} >Block </Button> }
                    
                    {Flag == '1' 
                    ? 
                    <Button onClick={handleUnblock} autoFocus > Unblock </Button> 
                    : 
                    <Button onClick={handleUnblock} autoFocus disabled> Unblock </Button>  }
                    
                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
