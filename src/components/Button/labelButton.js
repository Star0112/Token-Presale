import React from 'react';
import './button.css';


function LabelButton({ children, onClickHandler }) {
    return (
        <div className="labelButton"
            onClick={() => onClickHandler()}
        >
            {children}
        </div>
    );
}

export default LabelButton;