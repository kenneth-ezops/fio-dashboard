import React, { useEffect } from 'react';
import { RouterProps } from 'react-router';
import FormModalWrapper from '../FormModalWrapper/FormModalWrapper';
import { ROUTES } from '../../constants/routes';
import CloseButton from '../CloseButton/CloseButton';

import AccountRecoveryForm from './AccountRecoveryForm';
import { AccountRecoveryTypes } from './types';

import classes from './AccountRecovery.module.scss';

const AccountRecovery: React.FC<AccountRecoveryTypes & RouterProps> = props => {
  const {
    history,
    recoveryAccountResults,
    showLoginModal,
    clearRecoveryResults,
  } = props;
  const redirectHome = () => {
    history.push(ROUTES.HOME);
  };

  useEffect(() => {
    if (recoveryAccountResults.status) {
      redirectHome();
      showLoginModal();
      clearRecoveryResults();
    }
  }, [recoveryAccountResults]);

  return (
    <div className={classes.container}>
      <FormModalWrapper>
        <div className={classes.formContainer}>
          <div className={classes.closeButton}>
            <CloseButton handleClick={redirectHome} isWhite={true} />
          </div>
          <h4 className={classes.title}>Recover Account</h4>
          <AccountRecoveryForm {...props} cancelAction={redirectHome} />
        </div>
      </FormModalWrapper>
    </div>
  );
};

export default AccountRecovery;
