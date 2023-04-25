import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import axios from 'axios';
import { getToken, checkManager } from '../Utils/Common';


import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';



export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const [Orders, setOrders] = React.useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const [loading, setLoading] = React.useState(false);
    const manager = checkManager();
    const [myOrders, setmyOrders] =  React.useState(null);


    React.useEffect(() => {

    }, []);

    const handleClickOpen = async () => {

        let config = {
            headers: {
                Authorization: "basic " + token
            },

           
        }
        await axios.get('http://localhost:4000/users/getOrdersLibrary', config, {
            headers: {
                Authorization: "basic " + token
            },

     
        }).then(async response => {
            setOrders(response.data.data.message.info);
            sessionStorage.setItem('Order', JSON.stringify(response.data.data.message.info));


            setLoading(false);
            window.location.assign('/manager/Orders');

        }).catch(error => {

        });

        setOpen(true);
    };


    const handleClickOpenCustomer = async () => {

        let config = {
            headers: {
                Authorization: "basic " + token
            },

           
        }
        await axios.get('http://localhost:4000/users/getOrdersCustomer', config, {
            headers: {
                Authorization: "basic " + token
            },

     
        }).then(async response => {
            setmyOrders(response.data.data.message.info);
            sessionStorage.setItem('myOrders', JSON.stringify(response.data.data.message.info));


            setLoading(false);
            window.location.assign('/OrderHistory');

        }).catch(error => {

        });

        setOpen(true);
    };









    return (
        <div>

            <Button variant="outlined" onClick={manager ? handleClickOpen : handleClickOpenCustomer}>
                < KeyboardBackspaceIcon></KeyboardBackspaceIcon>          </Button>
            
        </div>
    );
}
