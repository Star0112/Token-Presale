import React from 'react';
import './pageheader.css';


function PageHeader({title, content}) {
    return (
        <div className="pageheader">
            <h2>{title}</h2>
            <span className='content'>{content}</span>
        </div>
    );
}

export default PageHeader;