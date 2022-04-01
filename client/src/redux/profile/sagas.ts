import { History } from 'history';
import { put, takeEvery, select } from 'redux-saga/effects';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ACTIONS } from '../../components/Notifications/Notifications';

import { log } from '../../util/general';

import { setWallets } from '../account/actions';
import { refreshBalance } from '../fio/actions';
import {
  LOGIN_SUCCESS,
  PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
  NONCE_SUCCESS,
  loadProfile,
  login,
} from './actions';

import { closeLoginModal } from '../modal/actions';
import {
  listNotifications,
  createNotification,
} from '../notifications/actions';
import { setRedirectPath } from '../navigation/actions';

import { redirectLink } from '../navigation/selectors';
import { fioWallets } from '../fio/selectors';
import { ROUTES } from '../../constants/routes';

import { Api } from '../../api';

import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';
import { FioWalletDoublet } from '../../types';
import { Action } from '../types';

export function* loginSuccess(history: History, api: Api) {
  yield takeEvery(LOGIN_SUCCESS, function*(action: Action) {
    const hasRedirectTo: { pathname: string; state: object } = yield select(
      redirectLink,
    );
    const wallets: FioWalletDoublet[] = yield select(fioWallets);
    api.client.setToken(action.data.jwt);
    if (wallets && wallets.length) yield put<Action>(setWallets(wallets));
    if ((action.otpKey && action.voucherId) || action.voucherId)
      try {
        // We have to wait delete voucher call from server to get updated profile then.
        // Sagas doesn't wait. So in this case we have to write result into a constant.
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        const res = yield api.auth.deleteNewDeviceRequest(action.voucherId);
      } catch (e) {
        log.error(e);
      }
    yield put<Action>(loadProfile());
    yield put<Action>(listNotifications());
    if (hasRedirectTo) {
      yield history.push(hasRedirectTo.pathname, hasRedirectTo.state);
    }
    yield put(closeLoginModal());
    yield put(setRedirectPath(null));
  });
}

export function* profileSuccess() {
  yield takeEvery(PROFILE_SUCCESS, function*(action: Action) {
    try {
      if (!action.data.secretSet && action.data.secretSetNotification)
        yield put<Action>(
          createNotification({
            action: ACTIONS.RECOVERY,
            contentType: NOTIFICATIONS_CONTENT_TYPE.RECOVERY_PASSWORD,
            type: BADGE_TYPES.ALERT,
            pagesToShow: [ROUTES.HOME],
          }),
        );
    } catch (e) {
      log.error(e);
    }

    for (const fioWallet of action.data.fioWallets) {
      yield put<Action>(refreshBalance(fioWallet.publicKey));
    }
  });
}

export function* signupSuccess() {
  yield takeEvery(SIGNUP_SUCCESS, function*() {});
}

export function* logoutSuccess(history: History, api: Api) {
  yield takeEvery(LOGOUT_SUCCESS, function() {
    api.client.removeToken();
  });
}

export function* nonceSuccess() {
  yield takeEvery(NONCE_SUCCESS, function*(action: Action) {
    const { email, signature, nonce, otpKey, voucherId } = action.data;

    yield put<Action>(
      login({
        email,
        signature,
        challenge: nonce,
        otpKey,
        voucherId,
      }),
    );
  });
}