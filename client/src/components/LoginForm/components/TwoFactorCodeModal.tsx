import React, { useEffect } from 'react';
import { Field, FormRenderProps, Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import Input, { INPUT_UI_STYLES } from '../../Input/Input';
import { COLOR_TYPE } from '../../Input/ErrorBadge';
import SubmitButton from '../../common/SubmitButton/SubmitButton';

import CancelButton from '../../common/CancelButton/CancelButton';

import Modal from '../../Modal/Modal';

import { validate } from './validation';

import { setDataMutator } from '../../../utils';

import classes from '../styles/TwoFactorCodeModal.module.scss';

export type BackupFormValues = {
  backupCode: string;
};

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (values: BackupFormValues) => void;
  loading: boolean;
  otpError: string;
};

const TwoFactorCodeModal: React.FC<Props> = props => {
  const { show, onClose, onSubmit, loading, otpError } = props;

  const handleClose = () => {
    !loading && onClose();
  };

  const RenderForm = (props: FormRenderProps<BackupFormValues>) => {
    const {
      handleSubmit,
      valid,
      values,
      submitting,
      submitFailed,
      submitSucceeded,
      form: { mutators },
    } = props;

    useEffect(() => {
      if (otpError && (submitFailed || submitSucceeded)) {
        mutators.setDataMutator('backupCode', {
          error: otpError,
        });
      }
    }, [otpError, submitSucceeded, submitFailed]);

    const handleError = () => {
      mutators.setDataMutator('backupCode', {
        error: null,
      });
    };

    const isDisabled = loading || !valid || !values.backupCode;

    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <OnChange name="backupCode">{handleError}</OnChange>
        <Field
          name="backupCode"
          placeholder="Enter Backup Code"
          lowerCased={false}
          component={Input}
          type="text"
          showClearInput={true}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          loading={loading}
        />
        <SubmitButton
          text="Submit"
          disabled={isDisabled}
          loading={loading || submitting}
        />
        <div className={classes.cancelButton}>
          <CancelButton
            onClick={onClose}
            isBlack={true}
            isThin={true}
            disabled={isDisabled}
          />
        </div>
      </form>
    );
  };

  return (
    <Modal
      onClose={handleClose}
      closeButton={true}
      show={show}
      isSimple={true}
      isMiddleWidth={true}
      hasDefaultCloseColor={true}
    >
      <div className={classes.codeModalContainer}>
        <h3 className={classes.title}>Enter Backup Code</h3>
        <p className={classes.subtitle}>
          Sign into your account using the device you setup 2FA.
        </p>
        <p className={classes.message}>
          Go to Settings &gt; 2 Factor Authentication to find the code if you do
          not already have it recorded.
        </p>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          mutators={{ setDataMutator }}
        >
          {RenderForm}
        </Form>
      </div>
    </Modal>
  );
};

export default TwoFactorCodeModal;