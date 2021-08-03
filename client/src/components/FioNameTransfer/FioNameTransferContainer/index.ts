import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { createStructuredSelector } from 'reselect';

import apis from '../../../api';
import { compose, setFees, hasFioAddressDelimiter } from '../../../utils';

import {
  refreshBalance,
  transfer,
  getFee,
  TRANSFER_REQUEST,
} from '../../../redux/fio/actions';
import { getPrices } from '../../../redux/registrations/actions';
import { resetPinConfirm } from '../../../redux/edge/actions';
import { showPinModal } from '../../../redux/modal/actions';

import { pinConfirmation, confirmingPin } from '../../../redux/edge/selectors';
import {
  loading,
  transferProcessing,
  currentWallet,
  walletPublicKey,
} from '../../../redux/fio/selectors';

import { FioNameTransferContainer } from './FioNameTransferContainer';
import { ContainerOwnProps } from './types';
import { validate } from './validation';

const formConnect = reduxForm({
  form: 'transfer',
  getFormState: state => state.reduxForm,
  asyncValidate: validate,
  asyncChangeFields: [],
});

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    transferProcessing,
    confirmingPin,
    pinConfirmation,
    result: (state: any) => {
      const { transactionResult } = state.fio;
      const result = transactionResult[TRANSFER_REQUEST];
      if (result && result.fee_collected) {
        const { prices } = state.registrations;
        const feeCollected = result.fee_collected;
        return {
          feeCollected: {
            nativeAmount: feeCollected,
            costFio: apis.fio.sufToAmount(feeCollected),
            costUsdc: apis.fio.convert(feeCollected, prices.usdtRoe),
          },
          newOwnerKey: result.newOwnerKey,
        };
      }

      return result;
    },
    feePrice: (state: any, ownProps: ContainerOwnProps & any) => {
      const { fees } = state.fio;
      const { prices } = state.registrations;
      const feeEndPoint = hasFioAddressDelimiter(ownProps.name)
        ? apis.fio.actionEndPoints.transferFioAddress
        : apis.fio.actionEndPoints.transferFioDomain;
      return setFees(fees[feeEndPoint], prices);
    },
    walletPublicKey,
    currentWallet,
    transferAddressValue: (state: any) =>
      formValueSelector('transfer', (state: any) => state.reduxForm)(
        state,
        'transferAddress',
      ),
  }),
  {
    refreshBalance,
    transfer,
    showPinModal,
    resetPinConfirm,
    getPrices,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress
          ? apis.fio.actionEndPoints.transferFioAddress
          : apis.fio.actionEndPoints.transferFioDomain,
      ),
  },
);

export default compose(reduxConnect, formConnect)(FioNameTransferContainer);
