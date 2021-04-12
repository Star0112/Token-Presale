import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Nav,
    Navbar,
    Button,
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import config from '../../config';
import { NotificationManager } from 'react-notifications';
import { isMobile } from 'react-device-detect';
import { connector } from "../../fpan/web3";
import { setAddress, setNetworkId } from "../../redux/actions";

import logo from '../../images/logo.png';
import './header.css';

function Header() {

    const dispatch = useDispatch();
    const address = useSelector(state => state.authUser.address);
    // const networkId = useSelector(state => state.authUser.networkId);

    const onConnectClick = async () => {
        if (isMobile) {
            // Check if connection is already established
            if (!connector.connected) {
                // create new session
                connector.createSession();
            } else {
                console.log(connector._accounts[0]);
                console.log(connector._chainId.toString(10));
            }

            // Subscribe to connection events
            connector.on("connect", (error, payload) => {
                if (error) {
                    throw error;
                }

                // Get provided accounts and chainId
                const { accounts, chainId } = payload.params[0];
                dispatch(setAddress(accounts[0]));
                dispatch(setNetworkId(chainId.toString(10)));
            });

            connector.on("session_update", (error, payload) => {
                if (error) {
                    throw error;
                }

                // Get updated accounts and chainId
                // const { accounts, chainId } = payload.params[0];
            });

            connector.on("disconnect", (error, payload) => {
                if (error) {
                    throw error;
                }

                // Delete connector
            });

            return;
        }
        if (typeof window.ethereum === 'undefined') {
            NotificationManager.warning('Please install MetaMask!');
            return;
        }
        if (window.ethereum.networkVersion !== config.networkId) {
            if (config.networkId === '1')
                NotificationManager.warning('Please select main net to proceed!');
            else if (config.networkId === '3')
                NotificationManager.warning('Please select ropsten net to proceed!');
            return;
        }
        if (window.ethereum.selectedAddress !== null) {
            NotificationManager.warning('MetaMask was already connected.');
            return;
        }
        if (window.ethereum.selectedAddress === null) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (err) {
                //console.log('err :>> ', err);
            }
        }
    };


    return (
        <Navbar collapseOnSelect expand="lg">
            <Navbar.Brand href="/"><img src={logo} style={{ width: 50, height: 50 }} alt='TITAN Logo' /></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <NavLink className="menu-item" to="/presale" activeStyle={{ 'color': "#007bff" }}>PRESALE</NavLink>
                    {/* <Nav.Link className="menu-item" href="https://cryptoexploit.com/introducing-titan-token-your-premiere-crypto-stake-token/" activeStyle={{ 'color': "#007bff" }} target='_blank' rel="noreferrer">ABOUT</Nav.Link> */}
                </Nav>
                <Nav>
                    <Nav.Link href="#">
                        {
                            address === null ?
                                (<Button variant="outline-warning" style={{ whiteSpace: 'nowrap' }} onClick={() => onConnectClick()}>Wallet Connect</Button>) :
                                (<Button variant="outline-info"
                                    onClick={e => {
                                        window.open(`https://etherscan.io/address/${address}`, '_blank');
                                    }}>
                                    {`${address.substring(0, 7)}...${address.substring(address.length - 5, address.length)}`}
                                </Button>)
                        }
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );

}

export default Header;