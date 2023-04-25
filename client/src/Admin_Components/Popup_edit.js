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
// import EditOutlined from '@material-ui/icons/EditOutlined';



export default function ResponsiveDialog3(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [Category, setCategory] = React.useState("");
    const [error, setError] = React.useState("");
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [Title, setTitle] = React.useState();
    const [Author, setAuthor] = React.useState();
    const [CategoryID, setCategoryID] = React.useState();
    const [Description, setDescription] = React.useState();
    const [ISBN, setISBN] = React.useState();
    const [Quantity, setQuantity] = React.useState();
    const [Price, setPrice] = React.useState();
    const [BookImage, setBookImage] = React.useState();
    const [CurrentBook, setCurrentBook] = React.useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const Book_ID = props.Book_ID;
   

    React.useEffect(() => {
  
    }, []);

    const handleClickOpen = async () => {
        
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            
            book : Book_ID
        }
        await axios.patch('http://localhost:4000/users/getOneBookLibrary', config, {
        headers: {
            Authorization: "basic " + token
        },
        
        book : Book_ID
        }).then(async response => {
            setCurrentBook(response.data.data.result.data);
            sessionStorage.setItem('CurrentBook', JSON.stringify(response.data.data.result.data));
            setAuthor(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Author);
            setPrice(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Price);
            setDescription(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Description);
            setCategoryID(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Category_ID);
            setQuantity(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Quantity);
            setISBN(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].ISBN);
            setTitle(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Title);
            setBookImage(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Book_Image)
           
            setLoading(false);
            //window.location.assign('/manager/Books');
            
        }).catch(error => {
      
        });

        setOpen(true);
    };

    const handleClickEdit = async () => {
        
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            
            Book_ID : Book_ID,
            title:Title,
            ISBN:ISBN,
            description:Description,
            quantity:Quantity
        }
        await axios.patch('http://localhost:4000/users/updateBook', config, {
        headers: {
            Authorization: "basic " + token
        },
        
        Book_ID : Book_ID,
        title:Title,
        ISBN:ISBN,
        description:Description,
        quantity:Quantity

        }).then(async response => {
            
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Book edited successfully",
                type: 'success'
            })
            setOpen(false);
            setTimeout(function () {
                window.location.reload(false);
            }, 500);
            //window.location.assign('/manager/Books');
            
        }).catch(error => {
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
        });

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
    const handleChangeCategoryID = e => {
        setCategoryID(e.target.value);
    }
    const handleChangeQuantity = e => {
        setQuantity(e.target.value);
    }
    const handleChangePrice = e => {
        setPrice(e.target.value);
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
            price: Price


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
            price: Price



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
                <EditOutlined></EditOutlined>          </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Edit Book"}
                </DialogTitle>
                <DialogContent>
                
                <Toolbar> <div className='bookimg2'><img src={BookImage}></img></div></Toolbar>
                    <div className='Titlee'>
                    <Toolbar>
                        <TextField id="outlined-search" label="Book Title" type="search"  InputLabelProps={{shrink: true, }} onChange={handleChangeTitle}value={Title} />
                        <div className='ISBNe'> <TextField disabled id="outlined-read-only-input" label="ISBN" defaultValue={ISBN} InputProps={{readOnly: true, }}helperText="*Not Changeable" /></div>
                    </Toolbar>
                    </div>
                    <nbsp></nbsp><nbsp></nbsp><nbsp></nbsp>
                    <div className='Authore'>
                    <Toolbar>
                        <TextField disabled id="outlined-search" label="Book Author" type="search" defaultValue={Author} InputLabelProps={{shrink: true, }} InputProps={{readOnly: true, }}helperText="*Not Changeable" />
                        <div className='Descriptione'> <TextField  id="outlined-read-only-input" label="Description" type="search" InputLabelProps={{shrink: true, }}onChange={handleChangeDescription} value={Description} />    </div>
                        
        
                    </Toolbar>
                    </div>
                   
                    <div className='CIDe'>
                    <Toolbar>
                        <TextField disabled id="outlined-search" label="Category_ID" type="search" defaultValue={CategoryID} InputLabelProps={{shrink: true, }} InputProps={{readOnly: true, }}helperText="*Not Changeable" />
                        <div className='Quantitye'> <TextField id="outlined-search" label="Quantity" type="search" InputLabelProps={{shrink: true, }} onChange={handleChangeQuantity} value={Quantity} /></div>
                    </Toolbar>
                    </div>
                    
                    <div className='Pricee'>
                    <Toolbar>
                        <TextField
                        disabled
                            value={Price}
                            id="outlined-number"
                            label="Price"
                            
                            type="number"
                            defaultValue={Price} 
                            InputLabelProps={{shrink: true, }}
                            InputProps={{readOnly: true, }}
                            helperText="*Not Changeable"
                        />
                    </Toolbar>
                    </div>
                    {error && <><h5 style={{ color: 'red' }}>{error}</h5></>}
                </DialogContent>
                <DialogActions>

                    <Button autoFocus color='error' onClick={handleClose} > Close </Button>
                    <Button autoFocus onClick={handleClickEdit} > Edit </Button>


                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
