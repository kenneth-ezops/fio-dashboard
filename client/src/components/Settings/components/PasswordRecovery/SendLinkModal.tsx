import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../../../Modal/Modal';
import CancelButton from '../../../common/CancelButton/CancelButton';

import classes from './SendLinkModal.module.scss';

type Props = {
  show: boolean;
  onClose: () => void;
  onClick: () => void;
  loading: boolean;
};

const SendLinkModal: React.FC<Props> = props => {
  const { show, onClose, onClick, loading } = props;
  return (
    <Modal show={show} onClose={onClose} closeButton={true}>
      <h4 className={classes.title}>
        Save <span className="doubleColor">Recovery Link</span>
      </h4>
      <p className={classes.subtitle}>
        To complete account recovery setup, you MUST first save the recovery
        link sent to you via email. This is required to recover your account in
        addition to your username and recovery questions.
      </p>
      <Button
        onClick={onClick}
        className={classes.actionButton}
        disabled={loading}
      >
        {loading ? (
          <>
            Sending...
            <FontAwesomeIcon icon="spinner" spin className="ml-2" />
          </>
        ) : (
          'Send Email'
        )}
      </Button>
      <div className={classes.cancelButton}>
        <CancelButton onClick={onClose} isThin={true} />
      </div>
    </Modal>
  );
};

export default SendLinkModal;