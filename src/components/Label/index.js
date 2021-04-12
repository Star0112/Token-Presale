import React from 'react';
import {Row, Col} from 'react-bootstrap';

function Label({label, balance}) {
    return (
        <Row className=''>
            <Col xl={12}>
                <span className="">{label}: {balance}</span>
            </Col>
        </Row>
    );
}

export default Label;