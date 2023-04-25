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
import Notification from './Notifications';

import axios from 'axios';
import { getToken } from '../Utils/Common';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';


export default function ResponsiveDialog2(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');


    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const Order_ID = props.Order_ID;
    const Status = props.Status;
    //console.log(Library);



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleprogress = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },
            status: 'In Progress',
            Order_ID: Order_ID

        }
        await axios.patch("http://localhost:4000/users/updateOrderStatusManager", config, {
            headers: {
                Authorization: "basic " + token
            },
            status: 'In progress',
            Order_ID: Order_ID

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Order status set to 'In progress'",
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
        }, 1000);


    };
    const handledispatch = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },
            status: 'Dispatched',
            Order_ID: Order_ID

        }
        await axios.patch("http://localhost:4000/users/updateOrderStatusManager", config, {
            headers: {
                Authorization: "basic " + token
            },
            status: 'Dispatched',
            Order_ID: Order_ID

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Dispatched",
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
        }, 1000);

    };

    return (
        <div>
            <Button size='medium' variant="outlined"  onClick={handleClickOpen}>
                <DeliveryDiningIcon/>
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
                    {"Update Status"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose Status for Order.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                {Status == 'In Progress' 
                    ? 
                    <Button autoFocus color="error" onClick={handleprogress} disabled>In Progress </Button> 
                    : 
                    <Button autoFocus color="error" onClick={handleprogress} >In Progress</Button> }
                    
                    {Status == 'In Progress' 
                    ? 
                    <Button onClick={handledispatch} autoFocus > Dispatched </Button> 
                    : 
                    <Button onClick={handledispatch} autoFocus disabled> Dispatched </Button>  }
                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
