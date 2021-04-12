/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import { getTitanPrice } from '../../subgraphs/api';
import {
  networkId,
} from '../../titan/contracts';
import {
  getWinners,
  getWinnersInfo,
  getCollectedLotteryAmount,
  getLotteryTotalPaidOut,
  getLotteryFee,
  getLotteryLimit
} from '../../titan/vault';
import { bnToDec } from '../../titan/utils';
import { Row, Col } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader';
import Form from '../../components/Form';
import 'react-notifications/lib/notifications.css';
import Page from '../../components/Page';
import './index.css';


function Lottery() {
  const address = useSelector(state => state.authUser.address);
  const currentNetworkId = useSelector(state => state.authUser.networkId);

  BigNumber.config({
    DECIMAL_PLACES: 18,
    FORMAT: {
      // string to prepend
      prefix: '',
      // decimal separator
      decimalSeparator: '.',
      // grouping separator of the integer part
      groupSeparator: ',',
      // primary grouping size of the integer part
      groupSize: 3,
    }
  });

  const [titanPrice, setTitanPrice] = useState(0);
  const [winners, setWinners] = useState(0);
  const [lotteryAmount, setLotteryAmount] = useState(new BigNumber(0));
  const [winnersInfo, setWinnersInfo] = useState([]);
  const [poolValue, setPoolValue] = useState(new BigNumber(0));
  const [totalPaidOut, setTotalPaidOut] = useState(new BigNumber(0));
  const [totalPaidOutValue, setTotalPaidOutValue] = useState(new BigNumber(0));
  const [lotteryFee, setLotteryFee] = useState(0);
  const [lotteryLimit, setLotteryLimit] = useState(0);

  const [timerID, setTimerID] = useState(0);

  const fetchAllDataFromContract = useCallback(async (firstFlag = false, transactionType = '') => {
    setTitanPrice(await getTitanPrice());
    setWinners(await getWinners());
    setLotteryAmount(await getCollectedLotteryAmount());
    setWinnersInfo(await getWinnersInfo());
    setTotalPaidOut(await getLotteryTotalPaidOut());
    setLotteryFee(await getLotteryFee());
    setLotteryLimit(await getLotteryLimit());

  }, [address]);

  useEffect(() => {
    if (address) {

      if (timerID > 0)
        clearInterval(timerID);

      let tempTimerID = setInterval(async () => {
        fetchAllDataFromContract();
      }, 120000);

      setTimerID(tempTimerID);
      fetchAllDataFromContract(true);
    }
  }, [address])


  useEffect(() => {
    setPoolValue(new BigNumber(titanPrice).times(lotteryAmount));
    setTotalPaidOutValue(new BigNumber(titanPrice).times(totalPaidOut))
  }, [titanPrice, lotteryAmount, totalPaidOut])


  return (
    <Page>

      <PageHeader
        title='TITAN LOTTERY'
      />

      { networkId === currentNetworkId ?
        (
          <>
            <Row>
              <Col xs={12} sm={12}>
                <Form
                  title='How it works'
                >
                  <span className="numberSpan">
                    We take {lotteryFee}% from the collected taxfees and put it inside this lottery pool, each time the pool reaches a value of {lotteryLimit} USD a random LP staker gets selected as the winner. Winner takes all!
                  </span>
                </Form>
              </Col>
            </Row>
            <Row style={{ paddingTop: 15 }}>
              <Col xs={12} sm={4}>
                <Form
                  title='Current Pool'
                >
                  <span className="numberSpan">${bnToDec(poolValue).toFixed(2)} ({bnToDec(lotteryAmount).toFixed(4)} TITAN)</span>
                </Form>
              </Col>
              <Col xs={12} sm={4}>
                <Form
                  title='Total Winners'
                >
                  <span className="numberSpan">{winners}</span>
                </Form>
              </Col>
              <Col xs={12} sm={4}>
                <Form
                  title='Total Paid Out'
                >
                  <span className="numberSpan">${bnToDec(totalPaidOutValue).toFixed(2)} ({bnToDec(totalPaidOut).toFixed(4)} TITAN)</span>
                </Form>
              </Col>
            </Row>

            <PageHeader
              title='WINNERS'
            />

            <Row>
              <Col xs={12} md={12}>
                <Form
                  title=''
                >
                  <Row>
                    <Col xs={4} md={4}>
                      <Row className="winner-title">
                        <Col xl={12}>
                          <p>Address</p>
                        </Col>
                      </Row>
                      {
                        winnersInfo.map((element, index) => (
                          <Row className="">
                            <Col xl={12}>
                              {element.address}
                            </Col>
                          </Row>
                        ))
                      }
                    </Col>
                    <Col xs={4} md={4}>
                      <Row className="winner-title">
                        <Col xl={12}>
                          <p>Transaction Time</p>
                        </Col>
                      </Row>
                      {
                        winnersInfo.map((element, index) => (
                          <Row>
                            <Col xl={12}>
                              {element.timestamp}
                            </Col>
                          </Row>
                        ))
                      }
                    </Col>
                    <Col xs={4} md={4}>
                      <Row className="winner-title">
                        <Col xl={12}>
                          <p>Price </p>
                        </Col>
                      </Row>
                      {
                        winnersInfo.map((element, index) => (
                          <Row>
                            <Col xl={12}>
                              {bnToDec(element.amount).toFixed(4)} TITAN (${bnToDec(new BigNumber(titanPrice).times(element.amount)).toFixed(2)})
                          </Col>
                          </Row>
                        ))
                      }
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </>
        ) :
        (
          <>
            <Row>
              <Col xs={12}>
                <Form
                  title='Warning'
                >
                  <Row>
                    <Col xs={12} className='pt-3'>
                      <span>Unable to connect wallet</span><br />
                      <span>Please change your MetaMask to access the {networkId === '1' ? 'Main' : 'Ropsten'} Ethereum Network.</span>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </>
        )
      }
    </Page >
  );
}

export default Lottery;