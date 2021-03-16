import { put, takeEvery } from 'redux-saga/effects';
import {
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
  loadProfile,
} from './actions';

import { ROUTES } from '../../constants/routes';

export function* loginSuccess(history, api) {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    api.client.setToken(action.data.jwt);
    yield put(loadProfile());
    yield history.push(ROUTES.HOME);
  });
}

export function* signupSuccess() {
  yield takeEvery(SIGNUP_SUCCESS, function*() {});
}

export function* logoutSuccess(history, api) {
  yield takeEvery(LOGOUT_SUCCESS, function() {
    api.client.removeToken();
    history.push(ROUTES.LOGIN);
    window.location.reload();
  });
}
