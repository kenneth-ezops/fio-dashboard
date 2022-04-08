import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { compose, hasFioAddressDelimiter } from '../../utils';

import { refreshBalance, getFee } from '../../redux/fio/actions';

import { loading, currentWallet, fioDomains } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import FioNameRenewContainer from './FioNameRenewContainer';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import { ContainerOwnProps } from './types';
import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    feePrice: (state: ReduxState, ownProps: ContainerOwnProps & any) => {
      const { fees } = state.fio;
      return (
        fees[
          hasFioAddressDelimiter(ownProps.name)
            ? apis.fio.actionEndPoints.renewFioAddress
            : apis.fio.actionEndPoints.renewFioDomain
        ] || DEFAULT_FEE_PRICES
      );
    },
    roe,
    currentWallet,
    fioDomains,
  }),
  {
    refreshBalance,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress
          ? apis.fio.actionEndPoints.renewFioAddress
          : apis.fio.actionEndPoints.renewFioDomain,
      ),
  },
);

export default compose(reduxConnect)(FioNameRenewContainer);
