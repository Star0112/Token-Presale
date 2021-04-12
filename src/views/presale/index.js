/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import {
    bnMultipledByDecimals,
    bnDivdedByDecimals,
    getBNBBalance,
    bnToDec
} from '../../fpen/utils';
import {
    getBalance
} from '../../fpen/token';
import {
    getStartTime,
    getEndTime,
    getPresaleStatus,
    getPresaleCap,
    getPrice,
    getUnclimedPurchasedToken,
    getPurchasedToken,
} from '../../fpen/presale';
import {
    networkId,
    presaleContract,
} from '../../fpen/contracts';
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
import { sendTransaction, mobileSendTransaction } from '../../fpen/utils';
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

    const [values, setValues] = useState({
        stakeAmount: '0',
        unstakeAmount: '0',
        claimAmount: '0',
    });

    const [progress, setProgress] = useState(false);

    const [marketcap, setMarketcap] = useState(0);
    const [userBalance, setUserBalance] = useState(new BigNumber(0));
    const [minDepositAmount, setMinDepositAmount] = useState(new BigNumber(0));

    const [timerID, setTimerID] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    let transactionType = '';

    const fetchAllDataFromContract = useCallback(async (firstFlag = false, transactionType = '') => {
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
            fetchAllDataFromContract(true);
        }
    }, [address])

    useEffect(async () => {
        setStartTime(await getStartTime());
        setEndTime(await getEndTime());
        setPresaleAmount(await getPresaleCap());
        setPrice(await getPrice());
    }, []);


    const onChangeHandler = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    const transactionDone = () => {
        setValues({
            stakeAmount: '0',
            unstakeAmount: '0',
            claimAmount: '0',
        });
        setProgress(false);
        fetchAllDataFromContract(false, transactionType);
    }

    const transactionError = (err) => {
        setProgress(false);
    }

    const onStake = async (event) => {
        if (address == null || progress || values.stakeAmount === '' || !values)
            return;

        const stakeAmount = bnMultipledByDecimals(new BigNumber(values.stakeAmount));

        if (stakeAmount.lt(minDepositAmount)) {
            NotificationManager.warning(`Minimum deposit amount is ${bnToDec(minDepositAmount).toFixed(1)} ETH`);
            return;
        }

        setProgress(true);

        const encodedABI = presaleContract.contract.methods.stake().encodeABI();

        transactionType = 'stake';

        if (isMobile)
            await mobileSendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError, stakeAmount.toString(10));
        else
            await sendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError, stakeAmount.toString(10));
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
                                            {bnDivdedByDecimals(presaleAmount.multipliedBy(price)).toFormat(0)} fpen ({bnDivdedByDecimals(presaleAmount).toFormat(2)}BNB)
                                        </span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Your Locked Token'
                                    >
                                        <span className="numberSpan">
                                            {bnDivdedByDecimals(purchasedToken.multipliedBy(price)).toFormat(0)} fpen ({bnDivdedByDecimals(purchasedToken).toFormat(4)}BNB)
                                        </span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Round Time'
                                    >
                                        <span className="numberSpan">
                                            {
                                                `${new Date(startTime * 1000).getFullYear()}/${new Date(startTime * 1000).getMonth() + 1}/${new Date(startTime * 1000).getDay()}
                                                ${new Date(startTime * 1000).getHours()}:${new Date(startTime * 1000).getMinutes()}:${new Date(startTime * 1000).getSeconds()} ~ `
                                            }
                                        </span>
                                        <span className="numberSpan">
                                            {
                                                `${new Date(endTime * 1000).getFullYear()}/${new Date(endTime * 1000).getMonth() + 1}/${new Date(endTime * 1000).getDay()}
                                                ${new Date(endTime * 1000).getHours()}:${new Date(endTime * 1000).getMinutes()}:${new Date(endTime * 1000).getSeconds()}`
                                            }
                                        </span>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Total Locked Token'
                                    >
                                        <span className="numberSpan">{bnDivdedByDecimals(lockedAmount, 9).toFormat(0)} fpen ({bnDivdedByDecimals(presaleAmount.dividedBy(price)).toFormat(4)}BNB)</span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Your fpen Balance'
                                    >
                                        <span className="numberSpan">{bnDivdedByDecimals(userBalance, 9).toFormat(0)} fpen</span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='fpen Price'
                                    >
                                        <span className="numberSpan">1BNB = {price.toFormat(0)} fpen</span>
                                    </Form>
                                </Col>
                            </Row>

                            <PageHeader
                                title='fpen-BNB BUY'
                            />

                            <Row>
                                <Col xs={0} md={4} />
                                <Col xs={12} md={4} style={{ "lineHeight": "1.3" }}>
                                    <Form
                                        title={'BUY fpen'}
                                    >
                                        <Row className="vaultDiv">
                                            <Col xs={12}>
                                                <Row>
                                                    <Col md={12}>
                                                        <BetCtrl
                                                            label='My BNB Balance'
                                                            name='stakeAmount'
                                                            balance={userBNBBalance}
                                                            currentVal={values.stakeAmount}
                                                            onChangeHandler={onChangeHandler}
                                                        />
                                                    </Col>
                                                    <Col md={12}>
                                                        <Button
                                                            onClickHandler={onStake}
                                                            color='yellow'
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
                                <Col xs={0} md={4} />
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
                                                <span>Please change your MetaMask to access the {networkId === '56' ? 'Main' : 'Test'} BSC Network.</span>
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