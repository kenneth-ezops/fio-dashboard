import { put, takeEvery, select } from 'redux-saga/effects';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ACTIONS } from '../../components/Notifications/Notifications';
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

import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';

export function* loginSuccess(history, api) {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    const hasRedirectTo = yield select(redirectLink);
    const wallets = yield select(fioWallets);
    api.client.setToken(action.data.jwt);
    if (wallets && wallets.length) yield put(setWallets(wallets));
    yield put(loadProfile());
    yield put(listNotifications());
    if (hasRedirectTo) {
      yield history.push(hasRedirectTo);
    }
    yield put(closeLoginModal());
    yield put(setRedirectPath(null));

    // todo: pass voucherId to delete
    if (action.otpKey) api.newDeviceTwoFactor.delete();
  });
}

export function* profileSuccess() {
  yield takeEvery(PROFILE_SUCCESS, function*(action) {
    try {
      if (!action.data.secretSet && action.data.secretSetNotification)
        yield put(
          createNotification({
            action: ACTIONS.RECOVERY,
            contentType: NOTIFICATIONS_CONTENT_TYPE.RECOVERY_PASSWORD,
            type: BADGE_TYPES.ALERT,
            pagesToShow: [ROUTES.HOME],
          }),
        );
    } catch (e) {
      console.error(e);
    }

    for (const fioWallet of action.data.fioWallets) {
      yield put(refreshBalance(fioWallet.publicKey));
    }
  });
}

export function* signupSuccess() {
  yield takeEvery(SIGNUP_SUCCESS, function*() {});
}

export function* logoutSuccess(history, api) {
  yield takeEvery(LOGOUT_SUCCESS, function() {
    api.client.removeToken();
  });
}

export function* nonceSuccess() {
  yield takeEvery(NONCE_SUCCESS, function*(action) {
    const { email, signature, nonce, otpKey } = action.data;

    yield put(
      login({
        email,
        signature,
        challenge: nonce,
        otpKey,
      }),
    );
  });
}
