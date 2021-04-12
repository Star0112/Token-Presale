import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({title, content, setShowConfirmModal, setIsConfirmed}) {
    return (
        <StyledModal
            show={true}
            onHide={() => setShowConfirmModal(false)}
            centered
        >
            <Modal.Title>{title}</Modal.Title>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <Button primary="secondary" onClick = {() => { setShowConfirmModal(false); setIsConfirmed(false);}}>Cancel</Button>
                <Button primary="secondary" onClick = {() => { setShowConfirmModal(false); setIsConfirmed(true);}}>Confirm</Button>
            </Modal.Footer>
        </StyledModal>
    );
}

export const StyledModal = styled(Modal)`
    .modal-title {
        font-size: 25px;
        text-align: center;
        padding-top: 10px;
    }

    .modal-dialog {
       padding-right: 0px!important;
    }

    .modal-content {
        height: 100% !important;
        background-color: #0a132bbf;
        border-radius: 1.3rem;
        color: white;
    }

    .modal-header {
        border-bottom: 1px solid #515356;
    }

    .modal-footer {
        border-top: 0px solid #515356;
        padding-top: 0px;
        justify-content: center;
        .btn {
            border-radius: 10px;
        }
        .confirm {
            background: #55c448;
        }
        .slippage-text {
            width: 100px;
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            &:focus {
                outline: none;
            }
        }
        .postfix {
            margin-left: -25px;
            margin-right: 10px;
            color: black;
        }
    }

    .modal-body {
        text-align: center;
        p {
            font-size: 18px;
            margin-top: 15px;
            
        }
        @media only screen and (max-width: 1450px) {
            padding: 20px 20px 10px !important;
        }
    }
`;

ConfirmModal.propTypes = {
    trxHash: PropTypes.any,
    setShowEtherscanModal: PropTypes.func
}

export default ConfirmModal;
