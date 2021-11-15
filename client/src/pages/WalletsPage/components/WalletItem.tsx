import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';

import apis from '../../../api';
import { useCheckIfDesktop } from '../../../screenType';

import { FioWalletDoublet } from '../../../types';
import { ROUTES } from '../../../constants/routes';
import { putParamsToUrl } from '../../../utils';

import classes from '../styles/WalletItem.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
  roe: number;
};

const WalletItem: React.FC<Props> = props => {
  const { fioWallet, roe } = props;
  const isDesktop = useCheckIfDesktop();

  const usdc = apis.fio.convert(apis.fio.amountToSUF(fioWallet.balance), roe);

  return (
    <Link
      to={putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
      })}
    >
      <div className={classes.container}>
        <Badge type={BADGE_TYPES.BORDERED} show={true}>
          <div className={classes.badgeItem}>
            {isDesktop && (
              <p className={classes.walletName}>{fioWallet.name}</p>
            )}
            <div className={classes.itemContainer}>
              <div className={classes.balanceContainer}>
                <p className={classes.totalBalance}>Total balance</p>
                <p className={classes.balanceValue}>
                  {fioWallet.balance && fioWallet.balance.toFixed(2)} FIO /{' '}
                  {usdc && usdc.toFixed(2)} USDC
                </p>
              </div>
            </div>

            <FontAwesomeIcon
              icon="chevron-right"
              className={classes.detailsButton}
            />
          </div>
        </Badge>
      </div>
    </Link>
  );
};

export default WalletItem;