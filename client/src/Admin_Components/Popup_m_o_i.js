import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import axios from 'axios';
import { getToken , checkManager} from '../Utils/Common';


import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';



export default function ResponsiveDialog3(props) {
    const [open, setOpen] = React.useState(false);

    const [error, setError] = React.useState("");
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const [CurrentOrder, setCurrentOrder] = React.useState(null);
    const [CurrentOrderItem, setCurrentOrderItem] = React.useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const Order_ID = props.Order_ID;
    const [loading, setLoading] = React.useState(false);
    const manager = checkManager();


    React.useEffect(() => {

    }, []);

    const handleClickOpen = async () => {
        
        let config = {
            headers: {
                Authorization: "basic " + token
            },

            order: Order_ID
        }
        await axios.patch('http://localhost:4000/users/getOrder_ItemsManager', config, {
            headers: {
                Authorization: "basic " + token
            },

            order: Order_ID
        }).then(async response => {
            setCurrentOrder(response.data.data.message.order_items);
            sessionStorage.setItem('CurrentOrder', JSON.stringify(response.data.data.message.order_items));


            setLoading(false);
            window.location.assign('/manager/OrderItems');

        }).catch(error => {

        });

        setOpen(true);
    };


    const handleClickOpenCustomer = async () => {
       
        let config = {
            headers: {
                Authorization: "basic " + token
            },

            order: Order_ID
        }
        await axios.patch('http://localhost:4000/users/getOrder_ItemsCustomer', config, {
            headers: {
                Authorization: "basic " + token
            },

            order: Order_ID
        }).then(async response => {
            setCurrentOrderItem(response.data.data.message.order_items);
            sessionStorage.setItem('CurrentOrderItem', JSON.stringify(response.data.data.message.order_items));


            setLoading(false);
            window.location.assign('/OrderHistoryItems');

        }).catch(error => {

        });

        setOpen(true);
    };










    return (
        <div>

            <Button variant="outlined" onClick={manager ? handleClickOpen : handleClickOpenCustomer}>
                < FormatListBulletedIcon></FormatListBulletedIcon>          </Button>
           
            
        </div>
    );
}
