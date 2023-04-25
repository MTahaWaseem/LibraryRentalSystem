import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { makeStyles,TableBody, TableRow, TableCell,Toolbar,InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Input from '../Admin_Components/Input';
import ResponsiveDialog from '../Admin_Components/Popup_m_i_b';


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
    {id:'Book_Image', label: 'Book Image'},
    {id:'Title', label: 'Title'},
    {id:'Author', label: 'Author'},
    {id:'Price', label: 'Price'},
    {id:'Quantity', label: 'Quantity'},
    {id:'Period', label: 'Period'},
    {id:'Line_Total', label: 'Line Total'}
   
]
const HistoryOrderItems = (props) => {
    const [CurrentOrderItem, setCurrentOrderItem] = useState(JSON.parse(sessionStorage.getItem('CurrentOrderItem')));
    const [loading, setLoading] = useState(false);
    const token = getToken();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const classes = useStyles();

    
        

    
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(CurrentOrderItem, headCells, filterFn);
    
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

            <h1 className='text-primary mb-3'>Order Items</h1>
            <div className='bp'><ResponsiveDialog fullWidth='true'></ResponsiveDialog></div>
            <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search Title"
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
                        <TableRow key={item.Book_Image}>
                            <TableCell> {item.Book_Image} </TableCell>
                            <TableCell> {item.Title} </TableCell>
                            <TableCell> {item.Author} </TableCell>
                            <TableCell> {item.Price} </TableCell>
                            <TableCell> {item.Quantity} </TableCell>
                            <TableCell> {item.Period} </TableCell>
                            <TableCell> {item.Line_Total} </TableCell>

                            
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

export default HistoryOrderItems;
