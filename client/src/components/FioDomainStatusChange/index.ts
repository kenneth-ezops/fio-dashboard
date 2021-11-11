import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { compose, getElementByFioName } from '../../utils';
import { setFees } from '../../util/prices';

import {
  refreshBalance,
  setDomainVisibility,
  getFee,
} from '../../redux/fio/actions';
import { resetPinConfirm } from '../../redux/edge/actions';
import { showPinModal } from '../../redux/modal/actions';

import { pinConfirmation, confirmingPin } from '../../redux/edge/selectors';
import {
  loading,
  currentWallet,
  walletPublicKey,
  setVisibilityProcessing,
} from '../../redux/fio/selectors';

import { ContainerOwnProps } from './types';

import { DOMAIN_STATUS } from '../../constants/common';

import FioDomainStatusChangeContainer from './FioDomainStatusChangeContainer';
import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    setVisibilityProcessing,
    confirmingPin,
    pinConfirmation,
    result: (state: ReduxState) => {
      const { transactionResult: result } = state.fio;
      if (result && result.fee_collected) {
        const { roe } = state.registrations;
        const feeCollected = result.fee_collected;
        return {
          feeCollected: {
            nativeAmount: feeCollected,
            costFio: apis.fio.sufToAmount(feeCollected),
            costUsdc: apis.fio.convert(feeCollected, roe),
          },
        };
      }

      return result;
    },
    feePrice: (state: ReduxState) => {
      const { fees } = state.fio;
      const { prices, roe } = state.registrations;
      return setFees(
        fees[apis.fio.actionEndPoints.setFioDomainPublic],
        prices,
        roe,
      );
    },
    domainStatus: (state: ReduxState, ownProps: ContainerOwnProps & any) => {
      // todo: set types for state & fix ownProps type
      const { fioNameList, name } = ownProps;
      const { isPublic } = getElementByFioName({ fioNameList, name });

      return isPublic ? DOMAIN_STATUS.PUBLIC : DOMAIN_STATUS.PRIVATE;
    },
    walletPublicKey,
    currentWallet,
  }),
  {
    refreshBalance,
    setDomainVisibility,
    showPinModal,
    resetPinConfirm,
    getFee: () => getFee(apis.fio.actionEndPoints.setFioDomainPublic),
  },
);

export default compose(reduxConnect)(FioDomainStatusChangeContainer);
