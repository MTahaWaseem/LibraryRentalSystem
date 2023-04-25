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
    const [cart, setCart] = React.useState(JSON.parse(sessionStorage.getItem('cart')));
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const Books = props.library;
    const Flag = props.flag;
    
    //console.log(Library);
    const CURRENTCARTLIBRARY = "empty";


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleOrder = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },
            books: cart

        }
        await axios.post("http://localhost:4000/users/order", config, {
            headers: {
                Authorization: "basic " + token
            },
            
            books: cart

        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Order placed Successfully",
                type: 'success'
            })

            let cart2=[]
       let cartDetails=[];
       let fulldetails=[];
                // cart2.splice(0, cart2.length);
                // cartDetails.splice(0,cartDetails.length);
                // fulldetails.splice(0,fullDetails.length);
       sessionStorage.setItem("cart", JSON.stringify(cart2));
       sessionStorage.setItem("cartdetails", JSON.stringify(cartDetails));
       sessionStorage.setItem("fulldetails", JSON.stringify(fulldetails));
       sessionStorage.setItem("CURRENTCARTLIBRARY",JSON.stringify(CURRENTCARTLIBRARY));
       setTimeout(function () {
        window.location.assign("/Home");
    }, 1000);
        }).catch(error => {
            // console.log("lol");
            setLoading(false);
            
                // setError(error.response.data.data);
                setNotify({
                    isOpen: true,
                    message: error.response.data.data,
                    type: 'error'
                })
            
        })

        // setOpen(false);

        // setTimeout(function () {
        //    window.location.reload(false);
        // }, 1500);


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
            <Button style={{
          maxWidth: "150px",
          maxHeight: "100px",
          minWidth: "150px",
          minHeight: "50px"
        }} size='large' variant="contained" color='primary' onClick={handleClickOpen}>
                ORDER
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Order confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to order the books in your cart for rental?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                
                
                <Button autoFocus color='error' onClick={handleClose} > Close </Button>
                <Button autoFocus onClick={handleOrder} > Order </Button>
                    
                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}