import React from 'react';
import {Row, Col} from 'react-bootstrap';
import Input from '../Input';
import Button from '../Button';
import './setctrl.css';


function SetCtrl({label, name, balance, currentVal, onChangeHandler, btnLabel, onClickHandler}) {
    
    return (
        <Row className='mt-2 mb-2'>
            <Col xs={12}>
                <span className="textSpan">{label}: {balance}</span>
            </Col>
            <Col sm={8} xs={8} className='mt-2'>
                <Input name={name} value={currentVal} onChangeHandler={onChangeHandler}/>
            </Col>
            <Col sm={4} xs={4} className='mt-2'>
                <Button onClickHandler={onClickHandler} color='yellow'>{btnLabel}</Button>
            </Col>
        </Row>
    );
}

export default SetCtrl;