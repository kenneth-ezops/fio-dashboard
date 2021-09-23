import { put, takeEvery, select } from 'redux-saga/effects';
import { REF_ACTIONS_TO_ROUTES, REF_FLOW_STEPS } from '../../constants/common';
import { setStep } from './actions';
import { LOGIN_SUCCESS, logout } from '../profile/actions';
import { FIO_SIGN_NFT_SUCCESS } from '../fio/actions';
import { SET_REGISTRATION_RESULTS } from '../registrations/actions';
import { isRefFlow as getIsRefFlow, refProfileQueryParams } from './selectors';

export function* refLoginSuccess() {
  yield takeEvery(LOGIN_SUCCESS, function*() {
    const isRefFlow = yield select(getIsRefFlow);
    if (isRefFlow) {
      yield put(setStep(REF_FLOW_STEPS.REGISTRATION));
    }
  });
}

export function* fioAddressRegisterSuccess(history) {
  yield takeEvery(SET_REGISTRATION_RESULTS, function*(action) {
    const isRefFlow = yield select(getIsRefFlow);
    if (isRefFlow && action.data.success) {
      const { action } = yield select(refProfileQueryParams);
      yield put(setStep(REF_FLOW_STEPS.ACTION));
      history.push(REF_ACTIONS_TO_ROUTES[action]);
    }
  });
}

export function* nftSignSuccess(history) {
  yield takeEvery(FIO_SIGN_NFT_SUCCESS, function*(action) {
    const isRefFlow = yield select(getIsRefFlow);
    if (isRefFlow && action.data.status) {
      const { r } = yield select(refProfileQueryParams);
      const redirectUrl = `${r}?txId=${action.data.transactionId}`;
      yield put(setStep(REF_FLOW_STEPS.FINISH));
      yield put(logout({ history }));
      window.location.replace(redirectUrl);
    }
  });
}
