/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import { Row, Col } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader';
import Form from '../../components/Form';
import 'react-notifications/lib/notifications.css';
import Page from '../../components/Page';
import './index.css';


function Lottery() {

  return (
    <Page>
      <PageHeader
        title='TITAN FAQ'
      />
      <Row>
        <Col xs={12} sm={12}>
          <Form
            title='1. What is DeFi Staking?'
          >
            <span className="numberSpan">
              DeFi (Decentralized Finance) is a way of providing financial services to users through smart contracts. Existing DeFi projects aim to provide higher annualized earnings for specific currencies.
            </span>
          </Form>
        </Col>
        <Col xs={12} sm={12}>
          <Form
            title='2. About Titan DeFi Staking'
          >
            <span className="numberSpan">
              There's a relatively high threshold for users of DeFi products. Titan DeFi Staking acts on behalf of users to participate in certain DeFi products, obtains and distributes realized earnings, and helps users to participate in DeFi products with a single click.
            </span>
          </Form>
        </Col>
        <Col xs={12} sm={12}>
          <Form
            title='3. What are the advantages of DeFi Staking?'
          >
            <div className="numberSpan">
              - Easy to use: You don't need to manage private keys, acquire resources, make trades, or perform other complicated tasks to participate in DeFi Staking. Titan’s one-stop service allows users to obtain generous online rewards without having to keep an on-chain wallet.
            </div>
            <div className="numberSpan">
              -  Funds are safe: Titan selects only the best DeFi projects in the industry and monitors the DeFi system in real-time while it's running in order to reduce the risks associated with such projects.
            </div>
            <div className="numberSpan">
              -  Higher earnings: DeFi Staking does away with the exorbitant fees that come with trading capital. With the consistent level of risk, users are able to earn the highest possible returns in the best way.
            </div>
          </Form>
        </Col>
        <Col xs={12} sm={12}>
          <Form
            title='4. Does Titan bear the losses if an on-chain contract is attacked during DeFi Staking?'
          >
            <div className="numberSpan">
              No. Titan only acts as a platform to showcase projects and provide users with related services, such as accessing funds on behalf of the user and distributing earnings, etc.Titan does not bear any liability for losses incurred as a result of on-chain contract security.
            </div>
          </Form>
        </Col>
        <Col xs={12} sm={12}>
          <Form
            title='5. After I participate in DeFi Staking, how is the earnings cycle calculated?'
          >
            <div className="numberSpan">
              Once funds are successfully allocated to Locked Staking, earnings are calculated beginning at 00:00 (UTC) the following day. The minimum earnings calculation period is one day; earnings for a period of less than one day will not be included in the earnings distribution.
            </div>
          </Form>
        </Col>
      </Row>
    </Page >
  );
}

export default Lottery;