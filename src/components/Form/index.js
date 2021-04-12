import React from 'react';
import './form.css';


function Form({ title, children }) {
    return (
        <div className="form">
            <h4>{title}</h4>
            {children}
        </div>
    );
}

export default Form;