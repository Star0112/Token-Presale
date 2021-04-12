/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import {
    bnMultipledByDecimals,
    bnDivdedByDecimals,
    getETHBalance,
    bnToDec
} from '../../fpen/utils';
import { getCirculatingSupply, getTotalSupply, getBalance } from '../../fpen/token';
import {
    getTotalStakedAmount,
    getUserTotalStakedAmount,
    getMinimumDepositAmount,
    getSwapReward,
    getTitanReward,
    getRestTimeForTitanRewards,
    getRestTimeForSwapRewards,
    getIsEnalbledLock,
    getStakedUserInfo,
    getBurnFee,
    getEarlyUnstakeFee
} from '../../fpen/vault';
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
import Label from '../../components/Label';
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

    const [values, setValues] = useState({
        stakeAmount: '0',
        unstakeAmount: '0',
        claimAmount: '0',
    });

    const [progress, setProgress] = useState(false);

    const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
    const [circulatingSupply, setCirculatingSupply] = useState(new BigNumber(0));
    const [tvl, setTVL] = useState(new BigNumber(0));

    const [titanPrice, setTitanPrice] = useState(0);
    const [marketcap, setMarketcap] = useState(0);
    const [totalStakedAmount, setTotalStakedAmount] = useState(new BigNumber(0));
    const [userBalance, setUserBalance] = useState(new BigNumber(0));
    const [userTotalStakedAmount, setUserTotalStakedAmount] = useState(new BigNumber(0));
    const [minDepositAmount, setMinDepositAmount] = useState(new BigNumber(0));
    const [userETHBalance, setUserETHBalance] = useState(new BigNumber(0));
    const [userSwapReward, setUserSwapReward] = useState({});
    const [userTitanReward, setUserTitanReward] = useState({});
    const [isEnabledLock, setIsEnalbledLock] = useState(true);
    const [stakedUserInfo, setStakedUserInfo] = useState({});

    const [userWethAvailableReward, setUserWethAvailableReward] = useState(new BigNumber(0));
    const [userWbtcAvailableReward, setUserWbtcAvailableReward] = useState(new BigNumber(0));
    const [userYfiAvailableReward, setUserYfiAvailableReward] = useState(new BigNumber(0));

    const [userWethPendingReward, setUserWethPendingReward] = useState(0);
    const [userWbtcPendingReward, setUserWbtcPendingReward] = useState(0);
    const [userYfiPendingReward, setUserYfiPendingReward] = useState(0);

    const [pendingTitanValue, setPendingTitanValue] = useState(new BigNumber(0));
    const [availableTitanValue, setAvailableTitanValue] = useState(new BigNumber(0));

    const [timerID, setTimerID] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isTreasury, setIsTreasury] = useState(false);
    const [isUnstake, setIsUnstake] = useState(false);
    const [burnFee, setBurnFee] = useState(0);
    const [earlyUnstakeFee, setEarlyUnstakeFee] = useState(0);

    const [apy, setApy] = useState(0);

    let transactionType = '';

    const fetchAllDataFromContract = useCallback(async (firstFlag = false, transactionType = '') => {
        setTotalSupply(await getTotalSupply());
        setCirculatingSupply(await getCirculatingSupply());
        setTotalStakedAmount(await getTotalStakedAmount());
        setUserBalance(await getBalance(address));
        setUserTotalStakedAmount(await getUserTotalStakedAmount(address));
        setUserETHBalance(await getETHBalance(address));
        setUserSwapReward(await getSwapReward(address));
        setUserTitanReward(await getTitanReward(address));
        setIsEnalbledLock(await getIsEnalbledLock());
        setStakedUserInfo(await getStakedUserInfo(address));
    }, [address]);

    useEffect(() => {
        if (address) {
            if (timerID > 0)
                clearInterval(timerID);

            let tempTimerID = setInterval(async () => {
                fetchAllDataFromContract();
            }, 13000);

            setTimerID(tempTimerID);
            fetchAllDataFromContract(true);
        }
    }, [address])

    useEffect(() => {
        const bnTitanPrice = new BigNumber(titanPrice);
        setPendingTitanValue(bnTitanPrice.times(userTitanReward.pending));
        setAvailableTitanValue(bnTitanPrice.times(userTitanReward.available));
    }, [userTitanReward, titanPrice]);

    useEffect(async () => {
        if (userSwapReward.pending && userSwapReward.pending.isGreaterThan(new BigNumber(0))) {

        } else {
            setUserWethPendingReward(new BigNumber(0));
            setUserWbtcPendingReward(new BigNumber(0));
            setUserYfiPendingReward(new BigNumber(0));
        }

        if (userSwapReward.available && userSwapReward.available.isGreaterThan(new BigNumber(0))) {

        } else {
            setUserWethAvailableReward(new BigNumber(0));
            setUserWbtcAvailableReward(new BigNumber(0));
            setUserYfiAvailableReward(new BigNumber(0));
        }

    }, [userSwapReward]);

    useEffect(async () => {
        setMinDepositAmount(await getMinimumDepositAmount());
        setBurnFee(await getBurnFee());
        setEarlyUnstakeFee(await getEarlyUnstakeFee());
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

    const onClaimAvailableTITANReward = async (event) => {
        if (address == null || progress)
            return;

        const available = userTitanReward.available;

        if (!available || available.lte(new BigNumber(0))) {
            NotificationManager.warning(`There are no available TITAN rewards.`);
            return;
        }

        setProgress(true);

        const encodedABI = presaleContract.contract.methods.claimTitanAvailableReward().encodeABI();
        transactionType = 'claimTitanAvailableReward';

        if (isMobile)
            await mobileSendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
        else
            await sendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
    }

    const onShowConfirmModalForTITAN = async () => {
        if (!address) {
            return
        }
        const restTime = await getRestTimeForTitanRewards(address);
        setShowConfirmModal(true);
        setModalTitle('Notes');
        setIsTreasury(true);
        setIsUnstake(false);
        setModalContent('Early withdraw will burn ' + burnFee + '% of rewards. Approximately, you should wait for ' + restTime + " in order to get rewards without fee.");
    }

    const onShowConfirmModalForQuarterly = async () => {
        if (!address) {
            return
        }
        const restTime = await getRestTimeForSwapRewards(address);
        setShowConfirmModal(true);
        setModalTitle('Notes');
        setIsTreasury(false);
        setIsUnstake(false);
        setModalContent('Early withdraw will burn ' + burnFee + '% of rewards. Approximately, you should wait for ' + restTime + " in order to get rewards without fee.");
    }

    const onShowConfirmModalForUnstake = async () => {
        if (isEnabledLock) {
            if (stakedUserInfo.isLocked) {
                setShowConfirmModal(true);
                setModalTitle('Notes');
                setModalContent('Approximately pool has been locked till ' + stakedUserInfo.endOfLock + '. If you want to unstake early, ' + earlyUnstakeFee + '% of LP token will go to DAO treasury, and ' + burnFee + '% of pending rewards will be burned.');
            }
        }
        setIsUnstake(true);
    }

    useEffect(async () => {
        if (isConfirmed === true) {
            if (isTreasury) {
                await onClaimTitanReward();
            } else if (isUnstake) {
                await onUnstake();
                setIsUnstake(false);
            } else {
                await onClaimSwapReward();
            }
            setIsConfirmed(false);
        }
    }, [isConfirmed]);


    const onClaimTitanReward = async (event) => {
        const rewards = userTitanReward.pending.plus(userTitanReward.available);
        if (address == null || progress)
            return;

        if (!rewards || rewards.lte(new BigNumber(0))) {
            NotificationManager.warning(`There are no TITAN rewards.`);
            return;
        }

        setProgress(true);

        const encodedABI = presaleContract.contract.methods.claimTitanReward().encodeABI();
        transactionType = 'claimTitanReward';

        if (isMobile)
            await mobileSendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
        else
            await sendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
    }

    const onClaimAvailableSwapReward = async (event) => {
        if (address == null || progress)
            return;

        const available = userSwapReward.available;
        if (!available || available.lte(new BigNumber(0))) {
            NotificationManager.warning(`There are no available WETH/WBTC/YFI rewards.`);
            return;
        }

        setProgress(true);

        const encodedABI = presaleContract.contract.methods.claimSwapAvailableReward().encodeABI();
        transactionType = 'claimSwapAvailableReward';

        if (isMobile)
            await mobileSendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
        else
            await sendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
    }

    const onClaimSwapReward = async (event) => {
        const rewards = userSwapReward.pending.plus(userSwapReward.available);
        if (address == null || progress)
            return;

        if (!rewards || rewards.lte(new BigNumber(0))) {
            NotificationManager.warning(`There are no WETH/WBTC/YFI rewards.`);
            return;
        }

        setProgress(true);

        const encodedABI = presaleContract.contract.methods.claimSwapReward().encodeABI();
        transactionType = 'claimSwapReward';

        if (isMobile)
            await mobileSendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
        else
            await sendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
    }

    const onUnstake = async (event) => {
        if (address == null || progress || values.unstakeAmount === '' || !values)
            return;

        const unstakeAmount = bnMultipledByDecimals(new BigNumber(values.unstakeAmount));
        const userTotalStakedAmountBn = bnMultipledByDecimals(userTotalStakedAmount);

        if (unstakeAmount.gt(userTotalStakedAmountBn) || unstakeAmount.lte(new BigNumber(0))) {
            NotificationManager.warning(`Invalid amount to unstake.`);
            return;
        }

        setProgress(true);

        const encodedABI = presaleContract.contract.methods.unstake(unstakeAmount.toString(10)).encodeABI();
        transactionType = 'unstake';

        if (isMobile)
            await mobileSendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
        else
            await sendTransaction(address, presaleContract.address, encodedABI, transactionDone, transactionError);
    }

    return (
        <>
            {progress &&
                <div className="clockContainer">
                    <ClockLoader
                        css={override}
                        size={100}
                        color={"#eb5757"}
                        loading={progress}
                    />
                </div>
            }
            <Page>
                <PageHeader
                    title='POOL STATS'
                />
                {networkId === currentNetworkId ?
                    (
                        <>
                            <Row>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Total Supply'
                                    >
                                        <span className="numberSpan">{bnDivdedByDecimals(totalSupply).toFormat(4)} TITAN</span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Circulating Supply'
                                    >
                                        <span className="numberSpan">{bnDivdedByDecimals(circulatingSupply).toFormat(4)} TITAN</span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Total Value Locked'
                                    >
                                        <span className="numberSpan">$ {tvl.toFormat(2)} ({bnDivdedByDecimals(totalStakedAmount).toFormat(4)} LP)</span>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Your TITAN Balance'
                                    >
                                        <span className="numberSpan">{bnDivdedByDecimals(userBalance).toFormat(4)} TITAN</span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='Market Cap'
                                    >
                                        <span className="numberSpan">$ {new BigNumber(marketcap).toFormat(2)}</span>
                                    </Form>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form
                                        title='TITAN Price'
                                    >
                                        <span className="numberSpan">$ {new BigNumber(titanPrice).toFormat(2)}</span>
                                    </Form>
                                </Col>
                            </Row>

                            <PageHeader
                                title='TITAN-ETH LP VAULT'
                            />

                            <Row>
                                <Col xs={12} md={4} style={{ "lineHeight": "1.3" }}>
                                    <Form
                                        title={'Stake (APY: ' + new BigNumber(apy).dp(2, 0).toString(10) + '%)'}
                                    >
                                        <Row className="vaultDiv">
                                            <Col xs={12}>
                                                <Row>
                                                    <Col md={12}>
                                                        <BetCtrl
                                                            label='My ETH'
                                                            name='stakeAmount'
                                                            balance={userETHBalance}
                                                            currentVal={values.stakeAmount}
                                                            onChangeHandler={onChangeHandler}
                                                        />
                                                    </Col>
                                                    <Col md={12}>
                                                        <Button onClickHandler={onStake} color='yellow'>Deposit & Stake</Button>
                                                    </Col>
                                                    {/* <Col md={12}>
                                                    <Label
                                                        label='Staked'
                                                        balance={userTotalStakedAmount.toFormat(4) + ' LP'}
                                                    />
                                                </Col> */}
                                                    {/* <Col md={12}>
                                                        <Label
                                                            label='Rank (Users)'
                                                            balance={userRank + ' (' + totalUsers + ')'}
                                                        />
                                                        </Col> */}
                                                    <Col md={12}>
                                                        <BetCtrl
                                                            label='Staked LP'
                                                            name='unstakeAmount'
                                                            balance={userTotalStakedAmount}
                                                            currentVal={values.unstakeAmount}
                                                            onChangeHandler={onChangeHandler}
                                                        />
                                                    </Col>
                                                    <Col md={12}>
                                                        <Button onClickHandler={onShowConfirmModalForUnstake} color='yellow'>Claim & Unstake</Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Form
                                        title='TITAN Rewards'
                                    >
                                        <Row className="vaultDiv">
                                            <Col xl={12}>
                                                <Row>
                                                    <Col xl={12}>
                                                        <Label
                                                            label='Pending TITAN'
                                                            balance={userTitanReward.pending ? bnDivdedByDecimals(userTitanReward.pending).toFormat(4) + ' ($ ' + bnDivdedByDecimals(pendingTitanValue).toFormat(2) + ')' : 0 + '($0)'}
                                                        />
                                                    </Col>
                                                    <Col xl={12}>
                                                        <Label
                                                            label='Available TITAN'
                                                            balance={userTitanReward.available ? bnDivdedByDecimals(userTitanReward.available).toFormat(4) + ' ($ ' + bnDivdedByDecimals(availableTitanValue).toFormat(2) + ')' : 0 + '($0)'}
                                                        />
                                                    </Col>
                                                    <Col xl={12}>
                                                        <Button onClickHandler={onClaimAvailableTITANReward} color='yellow'>Claim Available</Button>
                                                    </Col>
                                                    <Col xl={12}>
                                                        <Button onClickHandler={onShowConfirmModalForTITAN} color='yellow'>Claim Early</Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Form
                                        title='YFI/WBTC/WETH Rewards'
                                    >
                                        <Row className="vaultDiv">
                                            <Col xs={12}>
                                                <Row>
                                                    <Col xs={6} md={6}>
                                                        <Label label='Pending' />
                                                        <Label
                                                            label='WETH'
                                                            balance={userWethPendingReward ? userWethPendingReward.toFixed(4) : 0}
                                                        />
                                                        <Label
                                                            label='WBTC'
                                                            balance={userWbtcPendingReward ? userWbtcPendingReward.toFixed(4) : 0}
                                                        />
                                                        <Label
                                                            label='YFI'
                                                            balance={userYfiPendingReward ? userYfiPendingReward.toFixed(4) : 0}
                                                        />
                                                    </Col>
                                                    <Col xs={6} md={6}>
                                                        <Label label='Available' />
                                                        <Label
                                                            label='WETH'
                                                            balance={userWethAvailableReward ? userWethAvailableReward.toFormat(4) : 0}
                                                        />
                                                        <Label
                                                            label='WBTC'
                                                            balance={userWbtcAvailableReward ? userWbtcAvailableReward.toFormat(4) : 0}
                                                        />
                                                        <Label
                                                            label='YFI'
                                                            balance={userYfiAvailableReward ? userYfiAvailableReward.toFormat(4) : 0}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={12}>
                                                        <Button onClickHandler={onClaimAvailableSwapReward} color='yellow'>Claim Available</Button>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Button onClickHandler={onShowConfirmModalForQuarterly} color='yellow'>Claim Early</Button>
                                                    </Col>
                                                </Row>
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
                {
                    showConfirmModal &&
                    <ConfirmModal title={modalTitle} content={modalContent} setShowConfirmModal={setShowConfirmModal} setIsConfirmed={setIsConfirmed} />
                }
            </Page >
        </>
    );
}

export default Presale;