import React from 'react';
import './page.css';


function Page({ children }) {
    return (
        <div className="page">
            {children}
        </div>
    );
}

export default Page;