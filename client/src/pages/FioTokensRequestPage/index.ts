import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import {
  refreshBalance,
  refreshWalletDataPublicKey,
} from '../../redux/fio/actions';
import { createContact, getContactsList } from '../../redux/contacts/actions';

import {
  loading as fioWalletsLoading,
  fioWallets as fioWalletsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
} from '../../redux/fio/selectors';
import {
  loading as contactsLoading,
  list as contactsList,
} from '../../redux/contacts/selectors';
import { roe } from '../../redux/registrations/selectors';

import FioTokensRequestPage from './FioTokensRequestPage';

import { emptyWallet } from '../../redux/fio/reducer';
import { DEFAULT_BALANCES } from '../../util/prices';

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
    fioWalletsLoading,
    roe,
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
    contactsList,
    contactsLoading,
  }),
  {
    refreshBalance,
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(FioTokensRequestPage);
