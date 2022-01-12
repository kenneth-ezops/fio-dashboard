import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  getFioCryptoHandles,
  getAllFioPubAddresses,
} from '../redux/fio/actions';

import { fioWallets, mappedPublicAddresses } from '../redux/fio/selectors';

import {
  isAuthenticated,
  isNewUser as isNewUserSelector,
  isNewEmailNotVerified as isNewEmailNotVerifiedSelector,
} from '../redux/profile/selectors';

import { ROUTES } from '../constants/routes';

import { FioWalletDoublet } from '../types';

export function useFioCryptoHandles(limit = 0, offset = 0) {
  const dispatch = useDispatch();
  const wallets = useSelector(fioWallets);
  const isAuth = useSelector(isAuthenticated);
  useEffect(() => {
    if (wallets.length > 0 && isAuth) {
      wallets.map((wallet: FioWalletDoublet) =>
        dispatch(getFioCryptoHandles(wallet.publicKey, limit, offset)),
      );
    }
  }, [fioWallets.length]);
}

export function useNonActiveUserRedirect() {
  const isNewUser = useSelector(isNewUserSelector);
  const isNewEmailNotVerified = useSelector(isNewEmailNotVerifiedSelector);
  const isAuth = useSelector(isAuthenticated);
  const history = useHistory();
  useEffect(() => {
    if (isAuth && isNewEmailNotVerified) {
      history.push(ROUTES.NEW_EMAIL_NOT_VERIFIED);
    }
    if (isAuth && isNewUser) {
      history.push(ROUTES.IS_NEW_USER);
    }
  }, [isAuth, isNewUser, isNewEmailNotVerified]);
}

export function usePublicAddresses(fioCryptoHandle: string, limit: number = 0) {
  const [offset, setOffset] = useState(0);

  const dispatch = useDispatch();

  const fioAddressToPubAddresses = useSelector(mappedPublicAddresses);
  const hasMore =
    fioAddressToPubAddresses[fioCryptoHandle] &&
    fioAddressToPubAddresses[fioCryptoHandle].more;

  const fetchPublicAddresses = (incOffset: number = 0) =>
    dispatch(getAllFioPubAddresses(fioCryptoHandle, limit, incOffset));

  useEffect(() => {
    if (!fioCryptoHandle) return;
    fetchPublicAddresses();
  }, []);

  useEffect(() => {
    if (hasMore) {
      const incOffset = offset + limit;
      fetchPublicAddresses(incOffset);
      setOffset(incOffset);
    }
  }, [hasMore]);
}
