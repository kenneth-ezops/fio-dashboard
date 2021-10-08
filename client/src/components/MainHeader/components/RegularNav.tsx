import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { useCheckIfDesktop } from '../../../screenType';

import { ROUTES } from '../../../constants/routes';
import classes from '../MainHeader.module.scss';
import { ActionButtons } from './ActionButtons';
import SideMenu from './SideMenu';
import SiteLink from './SiteLink';
import { CartItem, RefProfile } from '../../../types';

type RegularNavProps = {
  cartItems: CartItem[];
  isMenuOpen: boolean;
  toggleMenuOpen: (openState: boolean) => void;
  edgeAuthLoading: boolean;
  profileLoading: boolean;
  isRefFlow: boolean;
  refProfileInfo: RefProfile;
  showLogin: () => void;
  closeMenu: () => void;
};

const CONFIRM_EMAIL_BASE_PATH = `${ROUTES.CONFIRM_EMAIL}`.replace(':hash', '');

const RegularNav = (props: RegularNavProps) => {
  const { cartItems, isRefFlow } = props;

  const isDesktop = useCheckIfDesktop();
  const location = useLocation();

  const renderActionButtons = () => {
    if (isDesktop) return <ActionButtons {...props} />;
    return (
      <SideMenu {...props}>
        <ActionButtons {...props} />
      </SideMenu>
    );
  };

  const renderNav = () => {
    if (location.pathname.indexOf(CONFIRM_EMAIL_BASE_PATH) > -1) return null;
    return (
      <Nav className="mr-auto align-items-center">
        {isRefFlow ? null : (
          <Nav.Link
            className={classnames(classes.navItem, 'text-white')}
            as={Link}
            to={
              cartItems.length > 0
                ? ROUTES.CART
                : ROUTES.FIO_ADDRESSES_SELECTION
            }
          >
            <div className={classnames(classes.notifWrapper, classes.cartanim)}>
              <FontAwesomeIcon
                icon="shopping-cart"
                className={classnames(classes.icon, 'mr-4')}
              />
              {cartItems.length > 0 && (
                <div
                  className={classnames(
                    classes.notifActiveWrapper,
                    classes.notifActiveWrapperRight,
                  )}
                >
                  <FontAwesomeIcon
                    icon="circle"
                    className={classnames(
                      classes.notifActive,
                      'text-success',
                      'mr-2',
                    )}
                  />
                </div>
              )}
            </div>
          </Nav.Link>
        )}
        {renderActionButtons()}
      </Nav>
    );
  };

  return (
    <div className={classes.regularNavContainer}>
      <SiteLink {...props} />
      <Navbar className="pr-0">{renderNav()}</Navbar>
    </div>
  );
};

export default RegularNav;
