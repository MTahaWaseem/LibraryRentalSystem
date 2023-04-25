import React, { useState, useEffect } from 'react'
import { Grid,makeStyles } from '@material-ui/core';

//import Controls from "../../components/controls/Controls";
//import { useForm, Form } from '../../components/useForm';
//import * as employeeService from "../../services/employeeService";
import Button from './Button';


// const genderItems = [
//     { id: 'male', title: 'Male' },
//     { id: 'female', title: 'Female' },
//     { id: 'other', title: 'Other' },
// ]

// const initialFValues = {
//     id: 0,
//     fullName: '',
//     email: '',
//     mobile: '',
//     city: '',
//     gender: 'male',
//     departmentId: '',
//     hireDate: new Date(),
//     isPermanent: false,
// }

export default function EmployeeForm(props) {
    const { addOrEdit, recordForEdit } = props

    // const validate = (fieldValues = values) => {
    //     let temp = { ...errors }
    //     if ('fullName' in fieldValues)
    //         temp.fullName = fieldValues.fullName ? "" : "This field is required."
    //     if ('email' in fieldValues)
    //         temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
    //     if ('mobile' in fieldValues)
    //         temp.mobile = fieldValues.mobile.length > 9 ? "" : "Minimum 10 numbers required."
    //     if ('departmentId' in fieldValues)
    //         temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "This field is required."
    //     setErrors({
    //         ...temp
    //     })

    //     if (fieldValues == values)
    //         return Object.values(temp).every(x => x == "")
    // }

    // const {
    //     values,
    //     setValues,
    //     errors,
    //     setErrors,
    //     handleInputChange,
    //     resetForm
    // } = useForm(initialFValues, true, validate);

    // const handleSubmit = e => {
    //     e.preventDefault()
    //     if (validate()) {
    //         addOrEdit(values, resetForm);
    //     }
    // }

    // useEffect(() => {
    //     if (recordForEdit != null)
    //         setValues({
    //             ...recordForEdit
    //         })
    // }, [recordForEdit])

    const useStyles = makeStyles(theme => ({
        root: {
            '& .MuiFormControl-root': {
                width: '80%',
                margin: theme.spacing(1)
            }
        }
    }))
    function Form(props) {

        const classes = useStyles();
        const { children, ...other } = props;
        return (
            <form className={classes.root} autoComplete="off" {...other}>
                {props.children}
            </form>
        )
    }
    return (
        <Form 
        // onSubmit={handleSubmit}
        >
            <Grid container>
                <Grid item xs={6}>
                    <div >
                        <Button
                            type="submit"
                            text="Block" />
                            <br />
                        <Button 
                            text="Unblock"
                            color="default"
                            // onClick={resetForm} 
                        />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}