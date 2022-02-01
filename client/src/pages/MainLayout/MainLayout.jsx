import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import MainHeader from '../../components/MainHeader';
import Notifications from '../../components/Notifications';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import LoginForm from '../../components/LoginForm';
import PinConfirmModal from '../../components/PinConfirmModal';
import GenericErrorModal from '../../components/Modal/GenericErrorModal';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';
import TwoFactorApproveModal from '../../components/TwoFactorApproveModal';
import { useCheckIfDesktop } from '../../screenType';
import AutoLogout from '../../services/AutoLogout';
import CartTimeout from '../../services/CartTimeout';
import RefFlow from '../../services/RefFlow';
import Roe from '../../services/Roe';
import WalletsDataFlow from '../../services/WalletsDataFlow';

import classes from './MainLayout.module.scss';

const MainLayout = props => {
  const {
    pathname,
    children,
    edgeContextSet,
    isAuthenticated,
    isActiveUser,
    showLogin,
    showRecovery,
    init,
  } = props;

  const isDesktop = useCheckIfDesktop();

  useEffect(() => {
    init();
  }, []);

  const loginFormModalRender = () => showLogin && <LoginForm />;
  const recoveryFormModalRender = () =>
    showRecovery &&
    edgeContextSet &&
    isAuthenticated &&
    isActiveUser && <PasswordRecoveryForm />;

  const isHomePage = pathname === '/';

  return (
    <div className={classes.root}>
      <MainHeader />
      <CartTimeout />
      <AutoLogout />
      <RefFlow />
      <Roe />
      {isAuthenticated && <WalletsDataFlow />}
      {isAuthenticated && isDesktop && <Navigation />}
      {(!isHomePage || isAuthenticated) && <Notifications />}
      <div className={`${classes.content} ${isHomePage && classes.home}`}>
        {children}
      </div>
      <Footer />
      {showLogin && edgeContextSet && loginFormModalRender()}
      {showRecovery && edgeContextSet && recoveryFormModalRender()}
      <PinConfirmModal />
      <GenericErrorModal />
      <TwoFactorApproveModal />
    </div>
  );
};

MainLayout.propTypes = exact({
  children: PropTypes.element,
  pathname: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool,
  isActiveUser: PropTypes.bool,
  loginSuccess: PropTypes.bool,
  showLogin: PropTypes.bool,
  showRecovery: PropTypes.bool,
  edgeContextSet: PropTypes.bool,

  init: PropTypes.func.isRequired,
  showRecoveryModal: PropTypes.func.isRequired,
});

export default MainLayout;
