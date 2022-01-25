import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PAGE_NAME, BUTTONS_TITLE } from '../constants';
import { ROUTES } from '../../../constants/routes';

import { useCheckIfSmallDesktop } from '../../../screenType';

import { ActionButtonProps } from '../types';

import classes from './ActionButtons.module.scss';

import icon from '../../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material

const ActionButtons: React.FC<ActionButtonProps> = props => {
  const { pageName, isDesktop, onSettingsOpen, fioNameItem } = props;
  const { name } = fioNameItem;

  const isSmallDesktop = useCheckIfSmallDesktop();

  const renderRenew = () => (
    <Link
      to={`${ROUTES.FIO_DOMAIN_RENEW}/${name}`}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.renew : ''}>
        <img src={icon} alt="timelapse" />
        {!isSmallDesktop && BUTTONS_TITLE.renew}
      </Button>
    </Link>
  );

  const renderAddBundles = () => (
    <Link
      to={`${ROUTES.FIO_ADDRESS_ADD_BUNDLES}/${name}`}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.renew : ''}>
        <FontAwesomeIcon icon="plus-square" className={classes.linkIcon} />
        {!isSmallDesktop && BUTTONS_TITLE.addBundles}
      </Button>
    </Link>
  );

  const renderSettings = () => (
    <Button
      className={classes.settingsButton}
      onClick={() => onSettingsOpen(fioNameItem)}
    >
      <FontAwesomeIcon icon="cog" className={classes.settingsIcon} />
    </Button>
  );

  const renderLinkToken = () => (
    <Link
      to={`${ROUTES.LINK_TOKEN_LIST}/${name}`}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.link : ''}>
        <FontAwesomeIcon icon="link" className={classes.linkIcon} />{' '}
        {!isSmallDesktop && BUTTONS_TITLE.link}
      </Button>
    </Link>
  );

  return pageName === PAGE_NAME.ADDRESS ? (
    <div className={classes.actionButtonsContainer}>
      <Link
        to={`${ROUTES.FIO_ADDRESS_SIGNATURES}`.replace(':address', name)}
        className={classes.actionButton}
      >
        <Button title={isSmallDesktop ? BUTTONS_TITLE.nft : ''}>
          <FontAwesomeIcon icon="signature" className={classes.atIcon} />{' '}
          {!isSmallDesktop && BUTTONS_TITLE.nft}
        </Button>
      </Link>
      {renderLinkToken()}
      {renderAddBundles()}
      {renderSettings()}
    </div>
  ) : (
    <div className={classes.actionButtonsContainer}>
      {renderRenew()}
      <Link
        to={ROUTES.FIO_ADDRESSES_SELECTION}
        className={classes.actionButton}
      >
        <Button title={isSmallDesktop ? BUTTONS_TITLE.register : ''}>
          <FontAwesomeIcon icon="at" className={classes.atIcon} />
          {!isSmallDesktop &&
            (isDesktop ? BUTTONS_TITLE.register : 'Register FIO Crypto Handle')}
        </Button>
      </Link>
      {renderSettings()}
    </div>
  );
};

export default ActionButtons;
