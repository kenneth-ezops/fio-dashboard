import { all } from 'redux-saga/effects';

import {
  loginSuccess,
  signupSuccess,
  logoutSuccess,
  profileSuccess,
  nonceSuccess,
} from './profile/sagas';
import { edgeLoginSuccess } from './edge/sagas';
import { listFailure } from './users/sagas';
import { notify } from './notify/sagas';
import {
  fioCryptoHandleRegisterSuccess,
  refLoginSuccess,
  refActionSuccess,
} from './refProfile/sagas';
import { clearGenericModalError } from './modal/sagas';
import {
  addFioWalletSuccess,
  setFeesService,
  setBalancesService,
} from './fio/sagas';

export default function* rootSaga(history, api) {
  yield all([
    loginSuccess(history, api),
    logoutSuccess(history, api),
    profileSuccess(),
    nonceSuccess(),
    edgeLoginSuccess(),
    listFailure(history),
    signupSuccess(history),
    notify(history),
    fioCryptoHandleRegisterSuccess(history),
    refLoginSuccess(),
    clearGenericModalError(),
    refActionSuccess(),
    setFeesService(),
    addFioWalletSuccess(),
    setBalancesService(),
  ]);
}
