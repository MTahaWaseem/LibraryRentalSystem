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
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { getToken } from '../Utils/Common';


export default function ResponsiveDialog2(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const Books = props.library;
    const Flag = props.flag;
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
            Book_ID: Books

        }
        await axios.patch("http://localhost:4000/users/setBookFlag", config, {
            headers: {
                Authorization: "basic " + token
            },
            flag: '1',
            Book_ID: Books

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Book Deleted!",
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
            Book_ID: Books

        }
        await axios.patch("http://localhost:4000/users/setBookFlag", config, {
            headers: {
                Authorization: "basic " + token
            },
            flag: '0',
            Book_ID: Books

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Book Unblocked!",
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
            <Button size='medium' variant="outlined" color='error' onClick={handleClickOpen}>
                <DeleteIcon />
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Update Delete Flag"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose whether Book needs to be Deleted or Not.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                {Flag == '1' 
                    ? 
                    <Button autoFocus color="error" onClick={handleBlock} disabled>Delete </Button> 
                    : 
                    <Button autoFocus color="error" onClick={handleBlock} >Delete</Button> }
                    
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
