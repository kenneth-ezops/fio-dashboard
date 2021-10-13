import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { user } from '../../redux/profile/selectors';
import { fioWallets, fioAddresses, loading } from '../../redux/fio/selectors';

import DashboardPage from './DashboardPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    user,
    fioAddresses,
    loading,
  }),
);

export default compose(reduxConnect)(DashboardPage);