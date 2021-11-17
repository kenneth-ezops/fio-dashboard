import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletDetailsModal from './components/WalletDetailsModal';
import TransactionList from './components/TransactionList';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import ActionButtonsContainer from '../WalletsPage/components/ActionButtonsContainer';
import TotalBalanceBadge from '../WalletsPage/components/TotalBalanceBadge';
import TransactionHistory from './components/TransactionHistory';

import apis from '../../api';

import { putParamsToUrl } from '../../utils';
import { ROUTES } from '../../constants/routes';

import { ContainerProps } from './types';

import classes from './styles/WalletPage.module.scss';

const WalletPage: React.FC<ContainerProps> = props => {
  const { fioWallet, balance, refreshBalance } = props;

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

  const closeWalletDetails = () => setShowDetails(false);

  const onDetails = () => {
    setShowDetails(true);
  };

  const actorName = fioWallet ? apis.fio.getActor(fioWallet.publicKey) : '';

  if (!fioWallet || !fioWallet.id)
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        <FioLoader />
      </div>
    );

  return (
    <div className={classes.container}>
      {showDetails ? (
        <WalletDetailsModal
          show={true}
          fioWallet={fioWallet}
          onClose={closeWalletDetails}
        />
      ) : null}
      <LayoutContainer title={fioWallet.name}>
        <ActionButtonsContainer>
          <Link
            to={putParamsToUrl(ROUTES.SEND, {
              publicKey: fioWallet.publicKey,
            })}
            className={classes.link}
          >
            <div>
              <FontAwesomeIcon icon="arrow-up" />
            </div>
          </Link>
          <div onClick={onDetails}>
            <FontAwesomeIcon icon="qrcode" />
          </div>
        </ActionButtonsContainer>

        <p className={classes.subtitle}>Manage your FIO tokens</p>
        <TransactionList fioWallet={fioWallet} />
      </LayoutContainer>
      <div className={classes.actionBadges}>
        <TotalBalanceBadge {...balance} />
        <TransactionHistory actorName={actorName} />
      </div>
    </div>
  );
};

export default WalletPage;
