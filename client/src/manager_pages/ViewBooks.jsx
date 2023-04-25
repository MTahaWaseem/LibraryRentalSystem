import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { makeStyles,TableBody, TableRow, TableCell,Toolbar,InputAdornment } from '@material-ui/core';
import ResponsiveDialog from '../Admin_Components/Popup_6.js';
import { Search } from '@material-ui/icons';
import Input from '../Admin_Components/Input';
import ResponsiveDialog2 from '../Admin_Components/Popup_delete';
import ResponsiveDialog3 from '../Admin_Components/Popup_edit'
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(0),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '50%',
        marginLeft: '10px',
        marginBottom: "20px"
    }
}))

const headCells = [
    {id:'Book_ID', label: 'Book ID'},
    {id:'Title', label: 'Title'},
    {id:'Category_ID', label: 'Category ID'},
    {id:'Price', label: 'Price'},
    {id:'Quantity', label: 'Quantity'},
    {id:'Delete_Flag', label: 'Deleted'},
    {id:'Edit', label: 'Edit '},
    {id:'Delete', label: 'Delete'}
]
const ViewBooks = (props) => {
    const [Books, setBooks] = useState(JSON.parse(sessionStorage.getItem('Books')));
    const [loading, setLoading] = useState(false);
    const token = getToken();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const classes = useStyles();

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getBooksLibrary', config, {
            }).then(async response => {
                setBooks(response.data.data.result.data);
                sessionStorage.setItem('Books', JSON.stringify(response.data.data.result.data));
                setLoading(false);
                //window.location.assign('/manager/Books');
                
            }).catch(error => {
          
            });
          
          };
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
                sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
                setLoading(false);
                //window.location.assign('/manager/Books');
                
            }).catch(error => {
          
            });
          
          };
        fetchBooks();
        fetchCategories();
    }, []);

    
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(Books, headCells, filterFn);
    
    const handleSearch = e => {
        let target = e.target;
        
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.Title.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }
    return (
        <div>
            <div className='container mt-5'>

            <h1 className='text-primary mb-3'>Books</h1>
            <div className='bp'><ResponsiveDialog fullWidth='true'></ResponsiveDialog></div>
            <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search Book Name"
                    InputProps={{
                        startAdornment: (<InputAdornment position='start'>
                            <Search />
                            </InputAdornment>)
                    }}
                    onChange={handleSearch}
                    /></div>
                </Toolbar>
                
                
            <nbsp></nbsp>
            <TblContainer>
                <TblHead />
                <TableBody>
                    {recordsAfterPagingAndSorting().map(item => (
                        <TableRow key={item.Book_ID}>
                            <TableCell>{item.Book_ID} </TableCell>
                            <TableCell> {item.Title} </TableCell>
                            <TableCell> {item.Category_ID} </TableCell>
                            <TableCell> {item.Price} </TableCell>
                            <TableCell> {item.Quantity} </TableCell>
                            <TableCell> { item.Delete_Flag == '1' ? "Yes" : "No"} </TableCell>
                            <TableCell>
                            <ResponsiveDialog3
                                Book_ID = {item.Book_ID}

                            />
                            </TableCell>
                            <TableCell>
                            <ResponsiveDialog2 
                                library = {item.Book_ID}
                                flag = {item.Delete_Flag}
                                >
                                    <DeleteIcon fontSize="small" /> 
                            </ResponsiveDialog2>
                            
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TblContainer>
            <br />
            <TblPagination />            
            </div>
        </div>
    )
}

export default ViewBooks;
