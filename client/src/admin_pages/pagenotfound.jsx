import React from 'react';
import '../Admin_Components/pagenotfound.css'

const PageNotFound = () => {

    return (
        <div>
        <div className='containerlol'>
            <h1>404</h1>
            </div>
            <div id='container'>
            <p>Oops! Something is wrong.</p>
            <a className="button" href="/"><i className="icon-home"></i> Click here to go to Home Page!</a>
            </div>
        </div>
    )
}

export default PageNotFound;
