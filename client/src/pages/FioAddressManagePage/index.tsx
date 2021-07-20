import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioAddresses } from '../../redux/fio/actions';
import { fioAddresses, hasMoreAddresses } from '../../redux/fio/selectors';
import { fioWallets, loading } from '../../redux/fio/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';

import FioAddressManagePage from './FioAddressManagePage';

const reduxConnect = connect(
  createStructuredSelector({
    data: fioAddresses,
    fioWallets,
    hasMore: hasMoreAddresses,
    loading,
    isAuthenticated,
  }),
  { fetchDataFn: getFioAddresses },
);

export default compose(reduxConnect)(FioAddressManagePage);
