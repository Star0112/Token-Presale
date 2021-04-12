import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './layout.css';

function Layout({children}) {
    return (
        <div className="layout">
            <Header/>
                {children}
            <Footer/>
        </div>
    );
}

export default Layout;