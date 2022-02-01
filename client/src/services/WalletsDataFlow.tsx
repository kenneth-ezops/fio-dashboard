import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';

import { camelizeFioRequestsData, compose } from '../utils';

import { fioWallets } from '../redux/fio/selectors';
import { user } from '../redux/profile/selectors';
import {
  FioRequestData,
  FioWalletData,
  FioWalletDoublet,
  User,
} from '../types';
import apis from '../api';
import { updateFioWalletsData } from '../redux/fioWalletsData/actions';
import useInterval from '../util/hooks';

type Props = {
  fioWallets: FioWalletDoublet[];
  user: User;
  updateFioWalletsData: (data: FioWalletData, publicKey: string) => void;
};

// todo: handle chunk case in promises
const getWalletData = async (
  fioWallet: FioWalletDoublet,
  user: User,
  updateLocalFioWalletData: (
    data: FioWalletData,
    publicKey: string,
    userId: string,
  ) => void,
) => {
  let receivedFioRequests: FioRequestData[] | null = null;
  let sentFioRequests: FioRequestData[] | null = null;
  let obtData: FioRequestData[] | null = null;

  const promises = [];

  const getReceivedFioRequestsPromise = new Promise((resolve, reject) => {
    return fioWallet.publicWalletFioSdk
      .getReceivedFioRequests(0, 0, true)
      .then((res: any) => {
        receivedFioRequests = camelizeFioRequestsData(
          res?.requests?.length ? res.requests.reverse() : [],
        );
        resolve();
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve();
      });
  });
  promises.push(getReceivedFioRequestsPromise);

  const getSentFioRequestsPromise = new Promise((resolve, reject) => {
    return fioWallet.publicWalletFioSdk
      .getSentFioRequests(0, 0, true)
      .then((res: any) => {
        sentFioRequests = camelizeFioRequestsData(
          res?.requests?.length ? res.requests.reverse() : [],
        );
        resolve();
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve();
      });
  });
  promises.push(getSentFioRequestsPromise);

  const getObtDataPromise = new Promise((resolve, reject) => {
    return fioWallet.publicWalletFioSdk
      .getObtData()
      .then((res: any) => {
        obtData = camelizeFioRequestsData(
          res?.obt_data_records?.length ? res.obt_data_records.reverse() : [],
        );
        resolve();
      })
      .catch((e: any) => {
        if (!(e.json?.message === 'No FIO Requests')) {
          reject(e);
        }
        resolve();
      });
  });
  promises.push(getObtDataPromise);

  await Promise.all(promises);

  const walletData = {
    id: fioWallet.id,
    receivedFioRequests,
    sentFioRequests,
    obtData,
  };

  updateLocalFioWalletData(walletData, fioWallet.publicKey, user.id);
};

const TIMER_DELAY = 5000; // 5 sec

const WalletsDataFlow = (props: Props & RouterProps): React.FC => {
  const { fioWallets, user, updateFioWalletsData } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [wallets, setWallets] = useState([]);

  const getWalletsData = async (walletsState?: FioWalletDoublet[]) => {
    if (!isLoading) {
      setIsLoading(true);
      await Promise.all(
        (walletsState || wallets).map(async wallet => {
          await getWalletData(wallet, user, updateFioWalletsData);
          return;
        }),
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fioWallets?.length) {
      let newWalletsState;
      if (fioWallets.length > wallets.length) {
        const newWallets = fioWallets
          .filter(fw => {
            return !wallets.filter(w => w.publicKey === fw.publicKey).length;
          })
          .map(nw => ({
            ...nw,
            publicWalletFioSdk: apis.fio.createPublicWalletFioSdk({
              public: nw.publicKey,
            }),
          }));
        newWalletsState = [...wallets, ...newWallets];
      }

      if (fioWallets.length < wallets.length) {
        newWalletsState = wallets.filter(w => {
          return !!fioWallets.filter(fw => fw.publicKey === w.publicKey).length;
        });
      }

      if (newWalletsState) setWallets(newWalletsState);

      getWalletsData(newWalletsState);
    }
  }, [fioWallets.length]);

  useInterval(() => {
    getWalletsData();
  }, TIMER_DELAY);

  return null;
};

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    user,
  }),
  {
    updateFioWalletsData,
  },
);

export default withRouter(compose(reduxConnect)(WalletsDataFlow));
