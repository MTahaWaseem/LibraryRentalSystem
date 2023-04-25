import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from "../Utils/Common";
import { makeStyles,TableBody, TableRow, TableCell } from '@material-ui/core';
import useTable from '../Admin_Components/useTable';
import ResponsiveDialog from '../Admin_Components/Popup_2';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { Toolbar, InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Input from '../Admin_Components/Input';

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
    {id:'User_ID', label: 'User ID'},
    {id:'Name', label: 'Name'},
    {id:'Email', label: 'Email'},
    {id:'Address', label: 'Address'},
    {id:'Contact', label: 'Contact'},
    {id:'Delete_Flag', label: 'Blocked'},
    {id:'actions', label: 'Update'},

]
const ViewUsers = (props) => {
    const [Users, setUsers] = useState(JSON.parse(sessionStorage.getItem('Users')));
    const [loading, setLoading] = useState(false);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const token = getToken();
    const classes = useStyles();
//    const[records,setRecords]= useState(Users);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getUsers', config, {
            }).then(async response => {
                setUsers(response.data.data.message.Customers);
               // setRecords(Users);
                sessionStorage.setItem('Users', JSON.stringify(response.data.data.message.Customers));
                //console.log(libraries);
                setLoading(false);
            }).catch(error => {

            });

        };

        fetchUsers();
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
    } = useTable(Users, headCells,filterFn);
    return (
        <div>
            <div className='container mt-5'>
                <h1 className='text-primary mb-3'>Users</h1> <br></br>
                <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search User Name"
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
                        <TableRow key={item.User_ID}>
                            <TableCell> {item.User_ID} </TableCell>
                            <TableCell> {item.Name} </TableCell>
                            <TableCell> {item.Email} </TableCell>
                            <TableCell> {item.Address} </TableCell>
                            <TableCell> {item.Contact} </TableCell>
                            <TableCell> {item.Delete_Flag == '1' ? "Yes" : "No"} </TableCell>
                            <TableCell> 
                            <ResponsiveDialog 
                                user = {item.User_ID}
                                flag = {item.Delete_Flag}>
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

export default ViewUsers;
