import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles,Paper ,Toolbar, InputAdornment } from '@material-ui/core';
import {  getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ResponsiveDialog from '../Admin_Components/Popup';
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
    {id:'Library_ID', label: 'Library ID'},
    {id:'Name', label: 'Name'},
    {id:'Manager_ID', label: 'Manager ID'},
    {id:'Manager_Name', label: 'Manager Name'},
    {id:'Block_Flag', label: 'Blocked'},
    {id:'actions', label: 'Update'}

]
const ViewLibraries = (props) => {
    const [libraries, setLibraries] = useState(JSON.parse(sessionStorage.getItem('libraries')));
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
            await axios.get('http://localhost:4000/users/getLibraries', config, {
            }).then(async response => {
                setLibraries(response.data.data.message.libraries);
                sessionStorage.setItem('libraries', JSON.stringify(response.data.data.message.libraries));
                console.log(libraries);
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
    } = useTable(libraries, headCells, filterFn);
    
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
                <h1 className='text-primary mb-3'>Libraries</h1><br></br>
               

                <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search Library Name"
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
                        <TableRow key={item.Library_ID}>
                            <TableCell> {item.Library_ID} </TableCell>
                            <TableCell> {item.Name} </TableCell>
                            <TableCell> {item.Manager_ID} </TableCell>
                            <TableCell> {item.Manager_Name} </TableCell>
                            <TableCell> { item.Block_Flag == '1' ? "Yes" : "No"} </TableCell>
                            <TableCell> 
                            <ResponsiveDialog 
                                library = {item.Library_ID}
                                flag = {item.Block_Flag}
                                >
                                    <EditOutlinedIcon fontSize="small" /> 
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

export default ViewLibraries;
