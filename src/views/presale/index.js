/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import {
    bnMultipledByDecimals,
    bnDivdedByDecimals,
    getBNBBalance,
    bnToDec
} from '../../main/utils';
import {
    getBalance
} from '../../main/token';
import {
    getStartTime,
    getEndTime,
    getPresaleStatus,
    getPresaleCap,
    getPrice,
    getUnclimedPurchasedToken,
    getPurchasedToken,
} from '../../main/presale';
import {
    networkId,
    presaleContract,
} from '../../main/contracts';
import { Row, Col } from 'react-bootstrap'
import { NotificationManager } from 'react-notifications';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Form from '../../components/Form';
import Button from '../../components/Button';
import BetCtrl from '../../components/BetCtrl';
import ConfirmModal from '../../components/ConfirmModal';
import 'react-notifications/lib/notifications.css';
import { css } from "@emotion/core";
import ClockLoader from "react-spinners/ClockLoader";
import { sendTransaction, mobileSendTransaction, customizedDate } from '../../main/utils';
import { isMobile } from 'react-device-detect';
import './index.css';

const override = css`
  z-index: 100;
  border-color: red;
`;

function Presale() {
    const address = useSelector(state => state.authUser.address);
    const currentNetworkId = useSelector(state => state.authUser.networkId);

    const [userBNBBalance, setUserBNBBalance] = useState(new BigNumber(0));
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [isOn, setIsOn] = useState(false);
    const [presaleAmount, setPresaleAmount] = useState(new BigNumber(0));
    const [lockedAmount, setLockedAmount] = useState(new BigNumber(0));
    const [purchasedToken, setPurchasedToken] = useState(new BigNumber(0));
    const [price, setPrice] = useState(new BigNumber(1));

    const [value, setValue] = useState(0);

    const [progress, setProgress] = useState(false);

    const [userBalance, setUserBalance] = useState(new BigNumber(0));

    const [timerID, setTimerID] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    let transactionType = '';

    const fetchAllDataFromContract = useCallback(async () => {
        setIsOn(await getPresaleStatus())
        setUserBalance(await getBalance(address));
        setUserBNBBalance(await getBNBBalance(address));
        setLockedAmount(await getUnclimedPurchasedToken());
        setPurchasedToken(await getPurchasedToken(address));
    }, [address]);

    useEffect(() => {
        if (address) {
            if (timerID > 0)
                clearInterval(timerID);

            let tempTimerID = setInterval(async () => {
                fetchAllDataFromContract();
            }, 20000);

            setTimerID(tempTimerID);
            fetchAllDataFromContract();
        }
    }, [address])

    useEffect(async () => {
        if (address) {
            setStartTime(await getStartTime());
            setEndTime(await getEndTime());
            setPresaleAmount(await getPresaleCap());
            setPrice(await getPrice());
        }
    }, [address]);


    const onChangeHandler = (event) => {
        setValue(event.target.value);
    };

    const transactionDone = () => {
        setValue(0);
        setProgress(false);
        fetchAllDataFromContract();
    }

    const transactionError = (err) => {
        setProgress(false);
    }

    const onPurchase = async (event) => {
        if (address == null || progress || !value)
            return;

        const purchaseAmount = bnMultipledByDecimals(new BigNumber(value));

        setProgress(true);

        const encodedABI = presaleContract.contract.methods.purchase().encodeABI();

        transactionType = 'purchase';

        if (isMobile)
            await mobileSendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError, purchaseAmount.toString(10));
        else
            await sendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError, purchaseAmount.toString(10));
    }

    useEffect(async () => {
        if (isConfirmed === true) {
            setIsConfirmed(false);
        }
    }, [isConfirmed]);

    return (
        <>
            {progress &&
                <div className="clockContainer">
                    <ClockLoader
                        css={override}
                        size={100}
                        color={"#007bff"}
                        loading={progress}
                    />
                </div>
            }
            <Page>
                <PageHeader
                    title='PRESALE STATS'
                />
                {networkId === currentNetworkId ?
                    (
                        <>
                            <Row>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Presale Token'
                                    >
                                        <span className="numberSpan">
                                            {bnDivdedByDecimals(presaleAmount.multipliedBy(price)).toFormat(0)} MUSK ({bnDivdedByDecimals(presaleAmount).toFormat(2)}BNB)
                                        </span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Your Locked Token'
                                    >
                                        <span className="numberSpan">
                                            {bnDivdedByDecimals(purchasedToken, 9).toFormat(0)} MUSK ({bnDivdedByDecimals(purchasedToken.dividedBy(price), 9).toFormat(4)}BNB)
                                        </span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Round Time'
                                    >
                                        <span className="numberSpan">
                                            {customizedDate(startTime * 1000)} {" ~ "} {customizedDate(endTime * 1000)}
                                        </span>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Total Locked Token'
                                    >
                                        <span className="numberSpan">{bnDivdedByDecimals(lockedAmount, 9).toFormat(0)} MUSK ({bnDivdedByDecimals(lockedAmount.dividedBy(price), 9).toFormat(4)}BNB)</span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Your MUSK Balance'
                                    >
                                        <span className="numberSpan">{bnDivdedByDecimals(userBalance, 9).toFormat(0)} MUSK</span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='MUSK Price'
                                    >
                                        <span className="numberSpan">1BNB = {price.toFormat(0)} MUSK</span>
                                    </Form>
                                </Col>
                            </Row>

                            <PageHeader
                                title='MUSK-BNB BUY'
                            />

                            <Row>
                                <Col xs={0} md={3} />
                                <Col xs={12} md={6} style={{ "lineHeight": "1.3" }}>
                                    <Form
                                        title={'BUY MUSK'}
                                    >
                                        <Row className="vaultDiv">
                                            <Col xs={12}>
                                                <Row>
                                                    <Col md={12}>
                                                        <BetCtrl
                                                            label='My BNB Balance'
                                                            name='stakeAmount'
                                                            balance={userBNBBalance}
                                                            currentVal={value}
                                                            onChangeHandler={onChangeHandler}
                                                        />
                                                    </Col>
                                                    <Col md={12}>
                                                        <Button
                                                            onClickHandler={onPurchase}
                                                            disabled={!isOn}
                                                        >
                                                            BUY
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col xs={0} md={3} />
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
                                                <span>Please change your MetaMask to access the {networkId === '56' ? 'Test' : 'Main'} BSC Network.</span>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </>
                    )
                }
                {
                    showConfirmModal &&
                    <ConfirmModal title={modalTitle} content={modalContent} setShowConfirmModal={setShowConfirmModal} setIsConfirmed={setIsConfirmed} />
                }
            </Page >
        </>
    );
}

export default Presale;