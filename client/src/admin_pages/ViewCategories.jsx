import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { makeStyles,TableBody, TableRow, TableCell,Toolbar,InputAdornment } from '@material-ui/core';
import ResponsiveDialog from '../Admin_Components/Popup_4';
import { Search } from '@material-ui/icons';
import Input from '../Admin_Components/Input';


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
    {id:'Category_ID', label: 'Category ID'},
    {id:'Name', label: 'Name'}

]
const ViewCategories = (props) => {
    const [Categories, setCategories] = useState(JSON.parse(sessionStorage.getItem('Categories')));
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1);
    const [recordForEdit,setRecordForEdit] = useState(null);
    const [openPopup, setOpenPopup] = useState(false)
    const token = getToken();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const classes = useStyles();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getCategory', config, {
            }).then(async response => {
                setCategories(response.data.data.message.Categories);
                sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
                console.table(response.data.data.message.Categories)
                setLoading(false);
               // window.location.assign('/admin/Requests');
            }).catch(error => {

            });

        };

        fetchPosts();
    }, []);

    
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(Categories, headCells, filterFn);
    
    const handleSearch = e => {
        let target = e.target;
        
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.Name.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }
    return (
        <div>
            <div className='container mt-5'>

            <h1 className='text-primary mb-3'>Categories</h1>
            <div className='cp'><ResponsiveDialog fullWidth='true'></ResponsiveDialog></div>
            <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search Category Name"
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
                        <TableRow key={item.Category_ID}>
                            <TableCell> {item.Category_ID} </TableCell>
                            <TableCell> {item.Name} </TableCell>
                           
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

export default ViewCategories;
