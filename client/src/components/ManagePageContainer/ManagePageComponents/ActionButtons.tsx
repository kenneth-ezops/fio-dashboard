import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PAGE_NAME } from '../constants';
import { ROUTES } from '../../../constants/routes';

import { ActionButtonProps } from '../types';

import classes from './ActionButtons.module.scss';

import icon from '../../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material

const RENEW_LINKS = {
  address: ROUTES.FIO_ADDRESS_RENEW,
  domain: ROUTES.FIO_DOMAIN_RENEW,
};

const ActionButtons: React.FC<ActionButtonProps> = props => {
  const { pageName, isDesktop, onSettingsOpen, fioNameItem } = props;
  const { name } = fioNameItem;

  return (
    <div className={classes.actionButtonsContainer}>
      <Link
        to={`${RENEW_LINKS[pageName]}/${name}`}
        className={classes.actionButton}
      >
        <Button>
          <img src={icon} alt="timelapse" /> Renew
        </Button>
      </Link>

      {pageName === PAGE_NAME.ADDRESS ? (
        <>
          <Link
            to={`${ROUTES.LINK_TOKEN_LIST}/${name}`}
            className={classes.actionButton}
          >
            <Button>
              <FontAwesomeIcon icon="link" className={classes.linkIcon} /> Link
            </Button>
          </Link>
          <Link
            to={`${ROUTES.FIO_ADDRESS_SIGNATURES}`.replace(':address', name)}
            className={classes.actionButton}
          >
            <Button>
              <FontAwesomeIcon icon="signature" className={classes.atIcon} />{' '}
              NFT signature
            </Button>
          </Link>
        </>
      ) : (
        <Button className={classes.actionButton}>
          <FontAwesomeIcon icon="at" className={classes.atIcon} />
          {isDesktop ? 'Register FIO Address' : 'Register Address'}
        </Button>
      )}
      <Button
        className={classes.settingsButton}
        onClick={() => onSettingsOpen(fioNameItem)}
      >
        <FontAwesomeIcon icon="cog" className={classes.settingsIcon} />
      </Button>
    </div>
  );
};

export default ActionButtons;
