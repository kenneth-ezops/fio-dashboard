import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import SelectModalInput from '../../../../components/Input/SelectModalInput';
import AmountInput from '../../../../components/Input/AmountInput';
import Dropdown from '../../../../components/Input/Dropdown';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { submitValidation, formValidation } from './validation';
import { hasFioAddressDelimiter } from '../../../../utils';

import { BUNDLES_TX_COUNT } from '../../../../constants/fio';

import { SendTokensProps, SendTokensValues } from '../../types';
import { FioAddressDoublet } from '../../../../types';

import classes from '../../styles/SendTokensForm.module.scss';

const SendTokensForm: React.FC<SendTokensProps> = props => {
  const {
    loading,
    fioWallet,
    fioAddresses,
    roe,
    fee,
    obtDataOn,
    contactsList,
    fioRecordDecrypted,
  } = props;

  const handleSubmit = async (values: SendTokensValues) => {
    const validationResult = await submitValidation.validateForm(values);
    if (validationResult) return validationResult;

    return props.onSubmit(values);
  };

  const initialValues: {
    from?: string;
    fromPubKey: string;
    to?: string;
    amount?: string;
    memo?: string;
    fioRequestId?: number;
    toPubKey?: string;
  } = {
    // From and To replaces each other because we are sending To address from which we got request
    fromPubKey: fioWallet.publicKey,
    toPubKey: fioRecordDecrypted?.fioDecryptedContent.payeePublicAddress,
    from: fioRecordDecrypted?.fioRecord.to,
    to: fioRecordDecrypted?.fioRecord.from,
    fioRequestId: fioRecordDecrypted?.fioRecord.id,
    amount: fioRecordDecrypted?.fioDecryptedContent.amount,
    memo: fioRecordDecrypted?.fioDecryptedContent.memo,
  };
  if (fioAddresses.length) {
    initialValues.from = fioAddresses[0].name;
  }

  return (
    <Form
      onSubmit={handleSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const {
          values: { from, to, amount, memo },
          validating,
        } = formRenderProps;

        const renderSender = () => {
          if (!obtDataOn) return null;
          if (!fioAddresses.length) return null;

          return (
            <>
              {fioAddresses.length > 1 ? (
                <Field
                  name="from"
                  label="Your Sending FIO Crypto Handle"
                  component={Dropdown}
                  errorColor={COLOR_TYPE.WARN}
                  placeholder="Select FIO Crypto Handle"
                  options={fioAddresses.map(({ name }) => ({
                    id: name,
                    name,
                  }))}
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  isSimple={true}
                  isHigh={true}
                  isWhite={true}
                />
              ) : (
                <Field
                  name="from"
                  type="text"
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  component={Input}
                  disabled={true}
                  label="Your Sending FIO Crypto Handle"
                />
              )}
            </>
          );
        };

        const selectedAddress: FioAddressDoublet | null = from
          ? fioAddresses.find(({ name }) => name === from)
          : null;

        const showMemo =
          selectedAddress != null &&
          obtDataOn &&
          to &&
          hasFioAddressDelimiter(to);
        const hasLowBalance =
          fee.costFio + Number(amount) > fioWallet.available;
        const notEnoughBundles =
          selectedAddress != null
            ? selectedAddress.remaining < BUNDLES_TX_COUNT.RECORD_OBT_DATA
            : false;
        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          hasLowBalance ||
          notEnoughBundles ||
          !fee.nativeFio;

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            {renderSender()}

            <Field
              name="to"
              placeholder="FIO Crypto Handle or Public Key"
              modalPlaceholder="Enter or select FIO Crypto Handle or Public Key"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={SelectModalInput}
              options={contactsList}
              showPasteButton={true}
              disabled={loading}
              loading={validating}
              label="Send to Address"
            />

            <Field
              name="amount"
              nativeAmountFieldName="nativeAmount"
              type="number"
              placeholder="0.00"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={AmountInput}
              roe={roe}
              disabled={loading}
              label="Send Amount"
            />

            {showMemo ? (
              <Field
                name="memo"
                type="text"
                placeholder="Set your memo"
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={Input}
                disabled={loading}
                label="Memo"
              />
            ) : null}

            <Field name="fromPubKey" type="hidden" component={Input} />
            <Field name="toPubKey" type="hidden" component={Input} />

            <Field name="fioRequestId" type="hidden" component={Input} />

            <p className={classes.transactionTitle}>Transaction cost</p>
            <PriceBadge
              title="Transaction Fee"
              type={BADGE_TYPES.BLACK}
              costFio={fee.costFio}
              costUsdc={fee.costUsdc}
            />
            {showMemo && memo ? (
              <BundledTransactionBadge
                bundles={BUNDLES_TX_COUNT.RECORD_OBT_DATA}
                remaining={selectedAddress.remaining}
              />
            ) : null}
            <LowBalanceBadge
              hasLowBalance={hasLowBalance}
              messageText={`Not enough Fio. Balance: ${fioWallet.available} FIO`}
            />
            <LowBalanceBadge
              hasLowBalance={notEnoughBundles}
              messageText="Not enough bundles"
            />

            <SubmitButton
              text="Send FIO Tokens"
              disabled={submitDisabled}
              loading={loading}
              withTopMargin={true}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default SendTokensForm;
