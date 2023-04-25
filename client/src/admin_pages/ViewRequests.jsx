import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import {getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { makeStyles,TableBody, TableRow, TableCell } from '@material-ui/core';
import CheckIcon from '@mui/icons-material/Check';
import ResponsiveDialog from '../Admin_Components/Popup_3';
import { Toolbar,InputAdornment } from '@material-ui/core';
import Input from '../Admin_Components/Input';
import { Search } from '@material-ui/icons';
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
    { id: 'Query_ID', label: 'Query ID' },
    { id: 'Name', label: ' Manager name' },
    { id: 'Email', label: 'Email' },
    { id: 'Subject', label: 'Subject' },
    { id: 'Description', label: 'Description' },
    { id: 'actions', label: 'Complete' }

]
const ViewRequests = (props) => {
    const [requests, setRequests] = useState(JSON.parse(sessionStorage.getItem('requests')));
    const [loading, setLoading] = useState(false);
    const [Categories, setCategories] = useState(JSON.parse(sessionStorage.getItem('Categories')));
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    //const [records,setRecords] = useState(requests)
    const classes = useStyles();
    const token = getToken();

    

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getQueriesManager', config, {
            }).then(async response => {
                setRequests(response.data.data.message.Queries);
               // setRecords(requests);
                sessionStorage.setItem('requests', JSON.stringify(response.data.data.message.Queries));
                console.table(response.data.data.message.Queries)
                setLoading(false);
                // window.location.assign('/admin/Requests');
            }).catch(error => {

            });

        };

        fetchPosts();

        
    }, []);

    const handleCategories = async () => {
        setLoading(true);
        let config = {
            headers: {
                Authorization: "basic " + token
            }
        }
        await axios.get('http://localhost:4000/users/getCategory', config, {
        }).then(async response => {
            setCategories(response.data.data.message.Categories);
            console.log(Categories);
            sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
           
            setLoading(false);
            window.location.assign('/admin/Categories');

        }).catch(error => {

        });

    }

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


    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(requests, headCells,filterFn);

    return (
        <div>
            <div className='container mt-5'>

                <div className='oopar'><h1 className='text-primary mb-3'>Requests</h1></div>
                <div className='sp'>
                    
                    <Button className='categorycreate' variant="outlined" onClick={handleCategories} size="large" disableElevation>
                    Create Category
                </Button>

                </div>

                <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search manager Name"
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
                            <TableRow key={item.Query_ID}>
                                <TableCell> {item.Query_ID} </TableCell>
                                <TableCell> {item.Name} </TableCell>
                                <TableCell> {item.Email} </TableCell>
                                <TableCell> {item.Subject} </TableCell>
                                <TableCell> {item.Description} </TableCell>
                                <TableCell>
                                    <ResponsiveDialog
                                        request={item.Query_ID}
                                        flag={item.Viewed_Flag}
                                    >
                                        <CheckIcon fontSize="small" />
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

export default ViewRequests;
