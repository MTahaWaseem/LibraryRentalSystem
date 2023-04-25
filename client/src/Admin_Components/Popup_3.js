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
import Notification from '../Admin_Components/Notifications';
import axios from 'axios';
import { getToken, checkAdmin, checkManager } from '../Utils/Common';

export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const request = props.request;
    const Flag = props.flag;
    console.log(request);
    //console.log(Library);


    const admin = checkAdmin();
    console.log(admin);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleBlockManager = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },
            Query: request
        }

        await axios.patch("http://localhost:4000/users/statusQuery", config, {
            headers: {
                Authorization: "basic " + token
            },

            Query: request

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Request catered!",
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

    }

    const handleBlockAdmin = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },
            Query: request
        }


        await axios.patch("http://localhost:4000/users/setQueryManager", config, {
            headers: {
                Authorization: "basic " + token
            },

            Query: request

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Request catered!",
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



    }







    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                <CheckIcon />
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Confirm"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm as catered?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button autoFocus color='error' onClick={handleClose} > Close </Button>
                    <Button autoFocus onClick={admin ? handleBlockAdmin : handleBlockManager} > Confirm </Button>

                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
