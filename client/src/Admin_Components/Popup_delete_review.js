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


export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const Book_ID = props.bookID;

    console.log(Book_ID)


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleDelete = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },
            data:{
                Book_ID: Book_ID
            }
           
        }
        await axios.delete("http://localhost:4000/users/deleteReview", config, {
            headers: {
                Authorization: "basic " + token
            },
            data:{
                Book_ID: Book_ID
            }

        }).then(response => {
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Review Deleted!",
                type: 'error'
            })


        }).catch(error => {
            setLoading(false);
            if (error.response.status === 500) {
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
        }, 500);


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
                    {"Delete Review"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this review?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>                  
                    
                    <Button autoFocus onClick={handleClose} > Close </Button>
                    <Button autoFocus color = "error" onClick={handleDelete} > Delete </Button>
                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
