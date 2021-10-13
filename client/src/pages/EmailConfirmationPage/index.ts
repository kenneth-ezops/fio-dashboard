import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { compose } from '../../utils';

import { confirmEmail } from '../../redux/profile/actions';
import { getInfo } from '../../redux/refProfile/actions';
import { showLoginModal } from '../../redux/modal/actions';

import {
  loading,
  emailConfirmationResult,
  isAuthenticated,
} from '../../redux/profile/selectors';
import { cartItems } from '../../redux/cart/selectors';

import EmailConfirmationPage from './EmailConfirmationPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    emailConfirmationResult,
    isAuthenticated,
    cartItems,
  }),
  {
    confirmEmail,
    getInfo,
    showLoginModal,
  },
);

export default withRouter(compose(reduxConnect)(EmailConfirmationPage));
