import React from 'react';
import './button.css';


function Button({ children, onClickHandler, disabled }) {
    return (
        <>
            {disabled ?
                (
                    <div className="wbutton">
                        {children}
                    </div>
                ) :
                (
                    <div className="ybutton" onClick={(e) => onClickHandler(e)}>
                        {children}
                    </div>
                )
            }
        </>
    );
}

export default Button;