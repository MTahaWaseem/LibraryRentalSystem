import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { makeStyles, TableBody, TableRow, TableCell } from '@material-ui/core';
import CheckIcon from '@mui/icons-material/Check';
import ResponsiveDialog from '../Admin_Components/Popup_delete_review';

import { Toolbar, InputAdornment } from '@material-ui/core';
import Input from '../Admin_Components/Input';
import { Search } from '@material-ui/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
//import UpdateIcon from '@mui/icons-material/Update';

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
    { id: 'Book_Image', label: 'Book Image' },
    { id: 'Title', label: 'Title' },
    { id: 'Review', label: 'Review' },
    { id: 'Rating', label: 'Rating' },
    { id: 'action2', label: 'Delete' },
]

const MyReviews = (props) => {

    const [myReviews, setmyReviews] = useState(JSON.parse(sessionStorage.getItem('myReviews')));

    const [loading, setLoading] = useState(false);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

    const classes = useStyles();
    const token = getToken();

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getMyReviews', config, {
            }).then(async response => {

                setmyReviews(response.data.data.message.Reviews);
                sessionStorage.setItem('myReviews', JSON.stringify(response.data.data.message.Reviews));
                console.table(response.data.data.message.Reviews)
                setLoading(false);

            }).catch(error => {

            });

        };
        fetchReviews();
    }, []);


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

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(myReviews, headCells, filterFn);

    return (
        <div>
            <div className='container mt-5'>

                <div className='oopar'><h1 className='text-primary mb-3'>My Reviews</h1></div>

                <Toolbar>
                    <div className='inp'><Input
                        className={classes.searchInput}
                        placeholder="Search Book Title"
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
                    <TableBody>
                        {recordsAfterPagingAndSorting().map(item => (
                            <TableRow key={item.Title}>
                                <TableCell> {<img src={item.Book_Image} width="160" height="228"></img>} </TableCell>
                                <TableCell> {item.Title} </TableCell>
                                <TableCell> {item.Review} </TableCell>
                                <TableCell> {item.Rating}/10</TableCell>

                                <TableCell>
                                    <ResponsiveDialog
                                        bookID={item.Book_ID}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </ResponsiveDialog>
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

export default MyReviews;
