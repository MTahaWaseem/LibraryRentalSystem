import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { getToken } from "../Utils/Common";
import useGrid from '../Admin_Components/useGrid';
import { TextField, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import { CheckBoxOutlineBlank, CompareArrowsOutlined, Search } from '@material-ui/icons';
import Input from '../Admin_Components/Input';
import ResponsiveDialog2 from '../Admin_Components/Popup_delete';
import ResponsiveDialog3 from '../Admin_Components/Popup_edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { width } from '@mui/system';
import ViewBook from "./ViewBook.jsx"
const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(0),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '100%',
        background: "rgb(255, 255, 255)",
        marginRight:"0rem"
        

    },
    select: {
        backgroundColor: "#FFFFFF",
        background: "#ffffff",
        color: "error",
        width:"100%",
        
    },
    selectbox: {
        backgroundColor: "#FFFFFF",
        background: "#ffffff",
       
        
    },
        box: {
        backgroundColor: '#4776EE',
    }
}))

const headCells = [
    { id: 'Book_ID', label: 'Book ID' },
    { id: 'Title', label: 'Title' },
    { id: 'Category_ID', label: 'Category ID' },
    { id: 'Price', label: 'Price' },
    { id: 'Quantity', label: 'Quantity' },
    { id: 'Delete_Flag', label: 'Deleted' },
    { id: 'Edit', label: 'Edit ' },
    { id: 'Delete', label: 'Delete' }
]
const Home = (props) => {
    const [Books, setBooks] = useState(JSON.parse(sessionStorage.getItem('Books')));
    const [loading, setLoading] = useState(false);
    const [Categories,setCategories] = useState(JSON.parse(sessionStorage.getItem('Categories')));
    const token = getToken();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [filterFnCID, setFilterFnCID] = useState({ fnc: items => { return items; } })
    const [filterFnLID, setFilterFnLID] = useState({ fnl: items => { return items; } })
    const classes = useStyles();
    const [textboxvalue, setTextBoxValues] = useState();
    const [CategoryID, setCategoryID] = React.useState(null);
    const [libraries,setLibraries] = React.useState(JSON.parse(sessionStorage.getItem('Libraries')));
    const [LibraryID,setLibraryID] = React.useState(null);
    const [currentBook, setCurrentBook] = React.useState();
    const [currentBookReviews2, setCurrentBookReviews] = React.useState();


    useEffect(() => {

       
       
        const fetchCategories = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getCategory', config, {
            }).then(async response => {
                // console.table(response.data.data.message.Categories)
                setCategories(response.data.data.message.Categories);
                sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
                setLoading(false);
                //window.location.assign('/manager/Books');

            }).catch(error => {

            });
            axios.get('http://localhost:4000/users/getBooks', {
            }).then(async response => {
                setBooks(response.data.data.result.data);
                sessionStorage.setItem('Books', JSON.stringify(response.data.data.result.data));
                // window.location.assign('/manager/Books');
    
            }).catch(error => {
    
            });
             axios.get('http://localhost:4000/users/getLibrariesGeneral', {
            }).then(async response => {
               // console.table(response.data.data.message.libraries);
                setLibraries(response.data.data.message.libraries);
                // console.table(libraries);
                
                sessionStorage.setItem('Libraries', JSON.stringify(response.data.data.message.libraries));
                // window.location.assign('/Books');
                
            }).catch(error => {
          
            });
        };
        
        fetchCategories();
    }, []);


    const {
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useGrid(Books, headCells, filterFn, filterFnCID, filterFnLID);

    const handleSearch = e => {
        let target = e.target;
        setTextBoxValues(target.value);
        console.log(textboxvalue);
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                   return items.filter(x => x.Title.toLowerCase().includes(target.value.toLowerCase()));
            }
        })
    }
    
    const handleChangeCategoryID = event => {
        setCategoryID(event.target.value);
        console.log(CategoryID);
        
        setFilterFnCID({
            fnc: items => {
                if (event.target.value == null)
                    return items;
                else
                    return items.filter(x => x.Category_ID.toString().includes(event.target.value.toString()))
            }
        })
       
    }
    const handleChangeLibraryID = event => {
        
        setLibraryID(event.target.value);
        // console.log(event.target.value);
        
        setFilterFnLID({
            fnl: items => {
                if (event.target.value == null)
                    return items;
                else
                    return items.filter(x => x.Library_ID.toString().includes(event.target.value.toString()))
            }
        })
    }
    const handleBookPage = async (event) => {
        setCurrentBook(event.target.value);
        console.log(event.target.value);
        // console.log(LibraryID);
        sessionStorage.setItem('CurrentBook', JSON.stringify(event.target.value));
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            book : event.target.value
        }
        
        await axios.patch('http://localhost:4000/users/getOneBook', config, {
            headers: {
                Authorization: "basic " + token
            },
            book : event.target.value
                
            }).then(async response => {
             //   console.table(response.data.data.result.book);
                setCurrentBook(response.data.data.result.data[0]);
                sessionStorage.setItem('CurrentBook', JSON.stringify(response.data.data.result.data[0]));
                // window.location.assign('/ViewBook');
    
            }).catch(error => {
    
            });
        // window.location.assign("/ViewBook")
        await axios.patch('http://localhost:4000/users/getreviewsinglebook', config, {
            headers: {
                Authorization: "basic " + token
            },
            book : event.target.value
                
            }).then(async response => {
               console.table(response.data.data.message.Reviews);
                setCurrentBookReviews(response.data.data.message.Reviews);
                await sessionStorage.setItem('CurrentBookReviews', JSON.stringify(response.data.data.message.Reviews));
                // window.location.assign('/ViewBook');
    
            }).catch(error => {
                if (error.response.status === 500)
                sessionStorage.setItem('CurrentBookReviews', "No reviews");
            });
        window.location.assign("/ViewBook")
    }
    return (

        <div>
            <br></br>
            <h1 className='text-primary mb-3'><center>Books</center></h1>
            <div className='container mt-5'>


                <Box
                    className={classes.box}
                    sx={{
                        display: 'flex',
                        padding: '1rem',
                        marginLeft: '0rem',
                        backgroundColor: '#4776EE',
                        marginTop: '00rem',
                        display: 'flex',
                        '& > :not(style)': {
                            m: 1,
                            width: 4000,
                            height: 55,
                        },
                    }}
                >
                    <div className='homesearch'><TextField
                        className={classes.searchInput}
                        id="filled-basic"
                        variant="filled"
                        label="Search Book Title"
                        value={textboxvalue}
                        onChange={handleSearch}
                    />

                    </div>
                   
                    <FormControl variant="filled"  sx={{ m: 1, minWidth: 120, tabSize: "250px", background: "#FFFF"}}>
                    
                        <InputLabel id="demo-simple-select-filled-label">Category</InputLabel>
                        <Select
                            className={classes.select}
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={CategoryID}
                            onChange={handleChangeCategoryID}
                        >
                           <MenuItem value="">All</MenuItem>
                                    {
                                        Categories.map(item => (
                                            <MenuItem value={item.Category_ID}>{item.Name}</MenuItem>
                                        ))
                                    }
                        </Select>
                        
                    </FormControl>
                    
                    <FormControl variant="filled"  sx={{ m: 1, minWidth: 120, tabSize: "250px", background: "#FFFF"}}>
                    
                    <InputLabel id="demo-simple-select-filled-label">Library</InputLabel>
                    <Select
                        className={classes.select}
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={LibraryID}
                        onChange={handleChangeLibraryID}
                    >
                       <MenuItem value="">All</MenuItem>
                                {
                                    libraries.map(item => (
                                        <MenuItem value={item.Library_ID}>{item.Name}</MenuItem>
                                    ))
                                }
                    </Select>
                    
                </FormControl>

                </Box>


<br/>
                {/* <Toolbar /> */}

                <nbsp></nbsp>
                <TblPagination />
                <br/>
                <ImageList cols={5} gap={50}>
                    {
                    recordsAfterPagingAndSorting().map((item) => (
                        item.Quantity==0 ? "":
                        <ImageListItem key={item.Book_Image}>
                            
                            <img
                                src={`${item.Book_Image}?w=248&fit=crop&auto=format`}
                                srcSet={`${item.Book_Image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.Title}
                                loading="lazy"
                                width="40px"
                                height="40px"
                                // value = {item.Book_ID}
                                // defaultValue = {item.Book_ID}
                                // onClick={handleBookPage}
                            />
                            {/* <ImageListItemBar position="below" value={item.Book_ID} title={item.Title} onClick={handleBookPage} /> */}
                        <Button defaultValue={item.Book_ID} value={item.Book_ID} onClick={handleBookPage}>{item.Title}</Button>
                        </ImageListItem>
                    ))}
                </ImageList>
                <br />
                


                {/* <Box sx={{ width: 500, height: 450, overflowY: 'scroll' }}> */}

                {/* </Box> */}




            </div>




        </div>
    )
}

export default Home;
