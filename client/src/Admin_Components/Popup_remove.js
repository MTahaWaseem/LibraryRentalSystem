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
    const Book = props.book;
    const CURRENTCARTLIBRARY = "empty";
    const Flag = props.flag;
    //console.log(Library);



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleBlock = async () => {
       let cart;
       let cartDetails;
       let fulldetails;
        cart = JSON.parse(sessionStorage.getItem('cart'))
        cartDetails = JSON.parse(sessionStorage.getItem('cartdetails'))
        fulldetails = JSON.parse(sessionStorage.getItem('fulldetails'))
        for (let i=0;i<cart.length;i++){
            if (cart[i].Book_ID == Book){
                cart.splice(i, 1);
                cartDetails.splice(i,1);
                fulldetails.splice(i,1);
            }
        }

        sessionStorage.setItem("cart", JSON.stringify(cart));
        sessionStorage.setItem("cartdetails", JSON.stringify(cartDetails));
        sessionStorage.setItem("fulldetails", JSON.stringify(fulldetails));
        if (cart.length < 1){
            sessionStorage.setItem("CURRENTCARTLIBRARY",JSON.stringify(CURRENTCARTLIBRARY))
        }

        window.location.assign("/Home");
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
                    {"Remove from cart"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to remove book from cart?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                
                    
                <Button onClick={handleClose} autoFocus > Close </Button> 

                    <Button autoFocus color="error" onClick={handleBlock} >Remove</Button> 
                    
                   
                   
                    
                  
                    
                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
