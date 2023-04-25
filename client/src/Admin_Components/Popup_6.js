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
import TextField from '@mui/material/TextField';
import BasicSelect from './BasicSelect';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [Category, setCategory] = React.useState("");
    const [error, setError] = React.useState("");
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [Title, setTitle] = React.useState(null);
    const [Author, setAuthor] = React.useState(null);
    const [CategoryID, setCategoryID] = React.useState(null);
    const [Description, setDescription] = React.useState(null);
    const [ISBN, setISBN] = React.useState(null);
    const [Quantity, setQuantity] = React.useState(null);
    const [Price, setPrice] = React.useState(null);
    const [URL, setURL] = React.useState(null);
    const Categories = JSON.parse(sessionStorage.getItem("Categories"));
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    //const request = props.request;
    //const Flag = props.flag;
    //console.log(request);
    //console.log(Library);



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };


    const handleAdd = e => {
        setCategory(e.target.value);
        console.log(Category);
    }

    const handleChangeTitle = e => {
        setTitle(e.target.value);
    }

    const handleChangeISBN = e => {
        setISBN(e.target.value);
    }
    const handleChangeAuthor = e => {
        setAuthor(e.target.value);
    }
    const handleChangeDescription = e => {
        setDescription(e.target.value);
    }
    const handleChangeCategoryID = event => {
        setCategoryID(event.target.value);
    }
    const handleChangeQuantity = e => {
        setQuantity(e.target.value);
    }
    const handleChangePrice = e => {
        setPrice(e.target.value);
    }
    const handleChangeURL = e => {
        setURL(e.target.value);
    }

    const handleClick = async () => {
        setLoading(true);

        let config = {
            headers: {
                Authorization: "basic " + token
            },

            title: Title,
            description: Description,
            ISBN: ISBN,
            author: Author,
            category: CategoryID,
            quantity: Quantity,
            price: Price,
            url: URL


        }
        await axios.post("http://localhost:4000/users/createBook", config, {
            headers: {
                Authorization: "basic " + token
            },

            title: Title,
            description: Description,
            ISBN: ISBN,
            author: Author,
            category: CategoryID,
            quantity: Quantity,
            price: Price,
            url: URL



        }).then(response => {
            //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
            //window.location.assign("/admin/CreateLibrary");
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Book added successfully",
                type: 'success'
            })
            setOpen(false);
            setTimeout(function () {
                window.location.reload(false);
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

            <Button variant="outlined" onClick={handleClickOpen}>
                ADD BOOKS            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Add Book"}
                </DialogTitle>
                <DialogContent>
                    <div className='Title'>
                        <Toolbar>
                            <TextField id="outlined-search" label="Book Title" type="search" InputLabelProps={{ shrink: true, }} onChange={handleChangeTitle} />
                            <div className='ISBN'> <TextField id="outlined-search" label="ISBN" type="search" InputLabelProps={{ shrink: true, }} onChange={handleChangeISBN} /></div>
                        </Toolbar>
                    </div>
                    <nbsp></nbsp><nbsp></nbsp><nbsp></nbsp>
                    <div className='Author'>
                        <Toolbar>
                            <TextField id="outlined-search" label="Book Author" type="search" InputLabelProps={{ shrink: true, }} onChange={handleChangeAuthor} />
                            <div className='Description'> <TextField id="outlined-search" label="Description" type="search" InputLabelProps={{ shrink: true, }} onChange={handleChangeDescription} />    </div>
                        </Toolbar>
                    </div>

                    <div className='CID'>
                        <Toolbar>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label" InputLabelProps={{ shrink: true, }}>Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={CategoryID}
                                    label="Category"
                                    onChange={handleChangeCategoryID}
                                >
                                    <MenuItem value={null}>none</MenuItem>
                                    {
                                        Categories.map(item => (
                                            <MenuItem value={item.Category_ID}>{item.Name}</MenuItem>
                                        ))
                                    }
                                     
                                    
                                </Select>
                            </FormControl>
                            {/* <TextField id="outlined-search" label="Category_ID" type="search" InputLabelProps={{shrink: true, }} onChange={handleChangeCategoryID} /> */}
                            <div className='Quantity'> <TextField id="outlined-search" label="Quantity" type="search" InputLabelProps={{ shrink: true, }} onChange={handleChangeQuantity} /></div>
                        </Toolbar>
                    </div>

                    <div className='Price'>
                        <Toolbar>
                            <TextField
                                id="outlined-number"
                                label="Price"

                                type="number"
                                InputLabelProps={
                                    {
                                        shrink: true,
                                    }
                                }
                                onChange={handleChangePrice}
                            />

                        <div className='URL'><TextField id="outlined-search" label="Image URL" type="search" InputLabelProps={{ shrink: true, }} onChange={handleChangeURL} />
                        </div>
                        </Toolbar>
                    </div>
                    {error && <><h5 style={{ color: 'red' }}>{error}</h5></>}
                </DialogContent>
                <DialogActions>

                    <Button autoFocus color='error' onClick={handleClose} > Close </Button>
                    <Button autoFocus onClick={handleClick} > Add </Button>


                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
