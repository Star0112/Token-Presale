import React, { Component } from 'react';
import { connect } from "react-redux";
import { NotificationContainer } from 'react-notifications';
import { isMobile } from 'react-device-detect';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { setAddress, setNetworkId, setError } from "./redux/actions";
import Layout from './layout';
import Presale from './views/presale';
import { providerUrl, Web3, connector } from './main/web3';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);

    if (isMobile) {
      if (connector.connected) {
        this.props.setAddressRequest(connector._accounts[0]);
        this.props.setNetworkIdRequest(connector._chainId.toString(10));
      }
    } else {
      window.web3 = null;
      // modern broswers
      if (typeof window.ethereum !== "undefined") {
        window.web3 = new Web3(window.ethereum);
        window.web3.eth.net.getId((err, netId) => {

          this.handleNetworkChanged(`${netId}`);
          window.ethereum.on("accountsChanged", (accounts) =>
            this.handleAddressChanged(accounts)
          );
          window.ethereum.on("chainChanged", (netId) =>
            this.handleNetworkChanged(netId)
          );
          this.props.setAddressRequest(window.ethereum.selectedAddress);
        });
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.web3 = null;
      }
    }
  }

  handleAddressChanged = (accounts) => {
    if (typeof window.ethereum !== "undefined") {
      this.props.setAddressRequest(window.ethereum.selectedAddress);
    }
  };

  handleNetworkChanged = (networkId) => {
    this.props.setNetworkIdRequest(networkId);
    switch (networkId) {
      case "1":
        if (providerUrl.includes("mainnet")) {
          this.props.setErrorRequest(false);
        } else {
          this.props.setErrorRequest(true);
        }
        break;
      case "3":
        if (providerUrl.includes("ropsten")) {
          this.props.setErrorRequest(false);
        } else {
          this.props.setErrorRequest(true);
        }
        break;
      default:
        this.props.setErrorRequest(true);
    }
  };

  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path="/presale" exact>
              <Presale />
            </Route>
            <Redirect to="/presale" />
          </Switch>
          <NotificationContainer />
        </Layout>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAddressRequest: (address) => dispatch(setAddress(address)),
    setNetworkIdRequest: (networkId) => dispatch(setNetworkId(networkId)),
    setErrorRequest: (error) => dispatch(setError(error)),
  };
};

export default connect(null, mapDispatchToProps)(App);
