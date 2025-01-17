import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { currentFioAddress } from '../../redux/fio/selectors';

import DeleteTokenPage from './DeleteTokenPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioCryptoHandle: currentFioAddress,
  }),
  {},
);

export default compose(reduxConnect)(DeleteTokenPage);
