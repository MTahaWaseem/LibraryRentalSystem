import React from "react";
import { Button, makeStyles } from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 0,
        margin: theme.spacing(0.5)
    },
    secondary: {
        backgroundColor: '#A9BDF2',
        opacity: '100%',
        '& .MuiButton-label':{
            color: '#4776EE',
        }
    },
    primary:{
        backgroundColor: theme.palette.primary.light,
        '& .MuiButton-label':{
            color: theme.palette.secondary.main,
        }
    }
}))
export default function ActionButton(props) {

    const { color, children, onClick } = props;
    const classes = useStyles();
    return (
        <Button
            className={`${classes.root} ${classes[color]}`}
            onClick={onClick}>
            {children}
        </Button>
    )
}