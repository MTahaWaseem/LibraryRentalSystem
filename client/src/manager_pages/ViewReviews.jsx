import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles,Paper ,Toolbar, InputAdornment } from '@material-ui/core';
import {  getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ResponsiveDialog from '../Admin_Components/Popup_m_r';
import Input from '../Admin_Components/Input';
import { Search } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(0),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '50%',
        marginLeft: '835px',
        marginBottom: "20px"
    }
}))

const headCells = [
    {id:'Book_ID', label: 'Book ID'},
    {id:'Title', label: 'Book Title'},
    {id:'User_ID', label: 'User ID'},
    {id:'Review', label: 'Review'},
    {id:'Rating', label: 'Rating'},
    {id:'actions', label: 'Delete'}

]
const ViewReviews = (props) => {
    const [Reviews, setReviews] = useState(JSON.parse(sessionStorage.getItem('Reviews')));
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1);
    const [recordForEdit,setRecordForEdit] = useState(null);
    const [openPopup, setOpenPopup] = useState(false)
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const token = getToken();
    const classes = useStyles();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/seeReviewsLibrary', config, {
            }).then(async response => {
                setReviews(response.data.data.message.Reviews);
                sessionStorage.setItem('Reviews', JSON.stringify(response.data.data.message.Reviews));
                console.log(Reviews);
                setLoading(false);
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
    } = useTable(Reviews, headCells, filterFn);
    
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
                <h1 className='text-primary mb-3'>Book Reviews</h1><br></br>
               

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
            <TblContainer>
                <TblHead />
                {<TableBody>
                    {recordsAfterPagingAndSorting().map(item => (
                        <TableRow key={item.Book_ID}>
                            <TableCell> {item.Book_ID} </TableCell>
                            <TableCell> {item.Title} </TableCell>
                            <TableCell> {item.User_ID} </TableCell>
                            <TableCell> {item.Review} </TableCell>
                            <TableCell> {item.Rating} </TableCell>
                             { <TableCell> 
                            <ResponsiveDialog 
                                Book_ID = {item.Book_ID}
                                User_ID = {item.User_ID}
                                >
                                    <EditOutlinedIcon fontSize="small" /> 
                            </ResponsiveDialog>
                            </TableCell> }
                            
                        </TableRow>
                    ))}
                </TableBody> }
            </TblContainer>
            <br />
            <TblPagination />
           
            
            </div>
        </div>
    )
}

export default ViewReviews;
