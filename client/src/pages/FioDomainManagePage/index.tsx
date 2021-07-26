import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioDomains } from '../../redux/fio/actions';
import { fioDomains, hasMoreDomains } from '../../redux/fio/selectors';
import { fioWallets, loading } from '../../redux/fio/selectors';
import { noProfileLoaded } from '../../redux/profile/selectors';

import FioDomainManagePage from './FioDomainManagePage';

const reduxConnect = connect(
  createStructuredSelector({
    data: fioDomains,
    fioWallets,
    hasMore: hasMoreDomains,
    loading,
    noProfileLoaded,
  }),
  { fetchDataFn: getFioDomains },
);

export default compose(reduxConnect)(FioDomainManagePage);