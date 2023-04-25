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
        marginLeft: '835px',
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

const ViewQueries = (props) => {
    const [Queries, setQueries] = useState(JSON.parse(sessionStorage.getItem('Queries')));
    const [loading, setLoading] = useState(false);
    const [Categories, setCategories] = useState(JSON.parse(sessionStorage.getItem('Categories')));
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    //const [records,setRecords] = useState(Queries)
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
            await axios.get('http://localhost:4000/users/getQueries', config, {
            }).then(async response => {
                setQueries(response.data.data.message.Queries);
               // setRecords(Queries);
                sessionStorage.setItem('Queries', JSON.stringify(response.data.data.message.Queries));
                console.table(response.data.data.message.Queries)
                setLoading(false);
                // window.location.assign('/admin/Queries');
            }).catch(error => {
            });
        };

        fetchPosts();

        
    }, []);

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
    } = useTable(Queries, headCells,filterFn);

    return (
        <div>
            <div className='container mt-5'>

                <div className='oopar'><h1 className='text-primary mb-3'>Queries</h1></div>
               

                <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search by Name"
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

export default ViewQueries;
