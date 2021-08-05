import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AdminContainer from './components/AdminContainer';
import MainLayout from './pages/MainLayout';
import ConfirmEmail from './pages/ConfirmEmail';
import AuthContainer from './components/AuthContainer';
import PrivateRoute from './components/PrivateRoute';
import FioAddressPage from './pages/FioAddressPage';
import FioAddressManage from './pages/FioAddressManagePage';
import FioDomainPage from './pages/FioDomainPage';
import FioDomainManagePage from './pages/FioDomainManagePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PurchasePage from './pages/PurchasePage';
import ScrollToTop from './components/ScrollToTop';
import FioAddressTransferPage from './pages/FioAddressTransferPage';
import FioDomainTransferPage from './pages/FioDomainTransferPage';
import FioAddressTransferResultsPage from './pages/FioAddressTransferResultsPage';
import FioDomainTransferResultsPage from './pages/FioDomainTransferResultsPage';
import FioDomainStatusChangePage from './pages/FioDomainStatusChangePage';
import FioDomainStatusChangeResultsPage from './pages/FioDomainStatusChangeResultsPage';
import FioAddressRenewPage from './pages/FioAddressRenewPage';
import FioDomainRenewPage from './pages/FioDomainRenewPage';
import FioNameRenewResultsPage from './pages/FioNameRenewResultsPage';
import FioListTokenPage from './pages/FioListTokenPage';
import FioLinkTokenPage from './pages/FioLinkTokenPage';
import FioLinkTokenConfirmationPage from './pages/FioLinkTokenConfirmationPage';
import FioEditLinkPage from './pages/FioEditLinkPage';
import FioEditLinkConfirmationPage from './pages/FioEditLinkConfirmationPage';
import FioDeleteLinkPage from './pages/FioDeleteLinkPage';
import FioDeleteLinkConfirmationPage from './pages/FioDeleteLinkConfirmationPage';

import { ROUTES } from './constants/routes';

const FIO_LIST_TOKEN_PARENT_ROUTE = `${ROUTES.FIO_LIST_TOKEN}/:id`;

const Routes = () => (
  <MainLayout>
    <ScrollToTop>
      <Switch>
        <Route path={ROUTES.HOME} component={HomePage} exact />
        <PrivateRoute path={ROUTES.ADMIN} component={AdminContainer} exact />
        <Route path={ROUTES.CONFIRM_EMAIL} component={ConfirmEmail} />
        <Route
          path={ROUTES.FIO_ADDRESSES_SELECTION}
          component={FioAddressPage}
          exact
        />
        <PrivateRoute
          path={ROUTES.FIO_ADDRESSES}
          component={FioAddressManage}
          exact
        />
        <Route
          path={ROUTES.FIO_DOMAINS_SELECTION}
          component={FioDomainPage}
          exact
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAINS}
          component={FioDomainManagePage}
          exact
        />
        <PrivateRoute path={ROUTES.CART} component={CartPage} exact />
        <PrivateRoute path={ROUTES.CHECKOUT} component={CheckoutPage} exact />
        <PrivateRoute path={ROUTES.PURCHASE} component={PurchasePage} exact />
        <PrivateRoute
          path={`${ROUTES.FIO_ADDRESS_OWNERSHIP}/:id`}
          component={FioAddressTransferPage}
        />
        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_OWNERSHIP}/:id`}
          component={FioDomainTransferPage}
        />

        <PrivateRoute
          path={ROUTES.FIO_ADDRESS_TRANSFER_RESULTS}
          component={FioAddressTransferResultsPage}
          excat
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_TRANSFER_RESULTS}
          component={FioDomainTransferResultsPage}
          excat
        />

        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_STATUS_CHANGE}/:id`}
          component={FioDomainStatusChangePage}
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_STATUS_CHANGE_RESULTS}
          component={FioDomainStatusChangeResultsPage}
          excat
        />

        <PrivateRoute
          path={`${ROUTES.FIO_ADDRESS_RENEW}/:id`}
          component={FioAddressRenewPage}
        />
        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_RENEW}/:id`}
          component={FioDomainRenewPage}
        />
        <PrivateRoute
          path={ROUTES.FIO_NAME_RENEW_RESULTS}
          component={FioNameRenewResultsPage}
          excat
        />

        <PrivateRoute
          path={FIO_LIST_TOKEN_PARENT_ROUTE}
          component={FioListTokenPage}
        />
        <PrivateRoute
          path={`${FIO_LIST_TOKEN_PARENT_ROUTE}/${ROUTES.FIO_LINK_TOKEN}`}
          component={FioLinkTokenPage}
        />
        <PrivateRoute
          path={`${FIO_LIST_TOKEN_PARENT_ROUTE}/${ROUTES.FIO_LINK_TOKEN_CONFIRMATION}`}
          component={FioLinkTokenConfirmationPage}
        />
        <PrivateRoute
          path={`${FIO_LIST_TOKEN_PARENT_ROUTE}/${ROUTES.FIO_EDIT_LINK}`}
          component={FioEditLinkPage}
        />
        <PrivateRoute
          path={`${FIO_LIST_TOKEN_PARENT_ROUTE}/${ROUTES.FIO_EDIT_LINK_CONFIRMATION}`}
          component={FioEditLinkConfirmationPage}
        />
        <PrivateRoute
          path={`${FIO_LIST_TOKEN_PARENT_ROUTE}/${ROUTES.FIO_DELETE_LINK}`}
          component={FioDeleteLinkPage}
        />
        <PrivateRoute
          path={`${FIO_LIST_TOKEN_PARENT_ROUTE}/${ROUTES.FIO_DELETE_LINK_CONFIRMATION}`}
          component={FioDeleteLinkConfirmationPage}
        />

        <AuthContainer />
      </Switch>
    </ScrollToTop>
  </MainLayout>
);

export default Routes;
