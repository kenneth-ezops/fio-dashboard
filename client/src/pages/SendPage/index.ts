import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFee, refreshBalance } from '../../redux/fio/actions';

import {
  loading,
  fioCryptoHandles,
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
} from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import SendPage from './SendPage';

import { emptyWallet } from '../../redux/fio/reducer';
import { DEFAULT_BALANCES, DEFAULT_FEE_PRICES } from '../../util/prices';

import apis from '../../api';

import { ReduxState } from '../../redux/init';
import { ContainerOwnProps } from './types';
import { FioWalletDoublet } from '../../types';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallet: (state: ReduxState, ownProps: ContainerOwnProps | {}) => {
      const { fioWallets } = state.fio;
      if (!('match' in ownProps)) return emptyWallet;

      return fioWallets.find(
        ({ publicKey }: FioWalletDoublet) =>
          publicKey === ownProps.match.params.publicKey,
      );
    },
    fioCryptoHandles,
    loading,
    roe,
    feePrice: (state: ReduxState) =>
      state.fio.fees[apis.fio.actionEndPoints.transferTokens] ||
      DEFAULT_FEE_PRICES,
    balance: (state: ReduxState, ownProps: ContainerOwnProps | {}) => {
      const fioWallets = fioWalletsSelector(state);
      const fioWalletsBalances = fioWalletsBalancesSelector(state);
      if (!('match' in ownProps)) return DEFAULT_BALANCES;

      const fioWallet = fioWallets.find(
        ({ publicKey }: { publicKey: string }) =>
          publicKey === ownProps.match.params.publicKey,
      );

      if (!fioWallet || !fioWalletsBalances.wallets[fioWallet.publicKey])
        return DEFAULT_BALANCES;

      return fioWalletsBalances.wallets[fioWallet.publicKey];
    },
  }),
  {
    refreshBalance,
    getFee: () => getFee(apis.fio.actionEndPoints.transferTokens),
  },
);

export default compose(reduxConnect)(SendPage);
