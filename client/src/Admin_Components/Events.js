import React from "react";

export default class Events extends React.Component{
    
    constructor(props){
        //let events = JSON.parse(sessionStorage.getItem('events'));
        super(props);
       // console.log("check");
        //console.log(props.Title);
        //console.log(props.TITLE);console.log("comp");
        
        this.state = {
            
            Title: props.TITLE,
            subtext:  props.EVENT_SUBTEXT,
            category:  props.EVENT_CATEGORY,
            Image: props.EVENT_IMAGE_THUMB

        }
    
    }  
    

    render(){
        return(
            <div>
                <h1>Title: {this.state.Title} </h1>
                <h2>subtext:{this.state.subtext} </h2>
                <h2>caetgory:{this.state.category} </h2>
                <img src={this.state.Image} alt="W3Schools.com"></img>
            </div>
        );
    }
}