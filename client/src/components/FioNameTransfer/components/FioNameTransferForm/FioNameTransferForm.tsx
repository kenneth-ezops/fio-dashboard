import React, { FormEvent, useState } from 'react';

import { Field, FieldValue } from '../../../Input/Field';
import PriceBadge from '../../../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../../../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../../../Badges/LowBalanceBadge/LowBalanceBadge';
import SubmitButton from '../../../common/SubmitButton/SubmitButton';

import { validate } from './validation';

import { INPUT_UI_STYLES } from '../../../Input/InputRedux';
import { fioNameLabels } from '../../../../constants/labels';
import { ERROR_UI_TYPE } from '../../../Input/ErrorBadge';
import { BADGE_TYPES } from '../../../Badge/Badge';

import { FormProps } from '../../types';

import classes from '../../FioNameTransferContainer.module.scss';

const PLACEHOLDER = 'Enter FIO Address or FIO Public Key of New Owner';

export const TransferForm = (props: FormProps) => {
  const {
    fioNameType,
    name,
    feePrice,
    currentWallet,
    onSubmit,
    processing,
  } = props;
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);

  const { costFio, costUsdc } = feePrice;
  const fioNameLabel = fioNameLabels[fioNameType];
  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setValidating(true);
      await validate({ transferAddress: value });
    } catch (e) {
      setValidating(false);
      setValid(false);
      return setError(e.transferAddress);
    }
    setValidating(false);
    onSubmit(value);
  };

  const onChange = async (newValue: FieldValue) => {
    setValue(`${newValue}`);
    if (error) {
      setError(null);
      setValid(true);
    }
  };

  return (
    <>
      <p className={classes.nameContainer}>
        {fioNameLabel}: <span className={classes.name}>{name}</span>
      </p>
      <p className={classes.label}>Transfer Information</p>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Field
          name="transferAddress"
          value={value}
          onChange={onChange}
          placeholder={PLACEHOLDER}
          error={error}
          lowerCased={false}
          type="text"
          showCopyButton={true}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorType={ERROR_UI_TYPE.BADGE}
          loading={validating}
        />
        <p className={classes.label}>{fioNameLabel} Transfer Cost</p>
        <PriceBadge
          costFio={costFio}
          costUsdc={costUsdc}
          title={`${fioNameLabel} Transfer Fee`}
          type={BADGE_TYPES.BLACK}
        />
        <PayWithBadge
          costFio={costFio}
          costUsdc={costUsdc}
          currentWallet={currentWallet}
        />
        <LowBalanceBadge hasLowBalance={hasLowBalance} />
        <SubmitButton
          text="Transfer Now"
          disabled={
            hasLowBalance || !valid || processing || !value || validating
          }
          withTopMargin={true}
        />
      </form>
    </>
  );
};
