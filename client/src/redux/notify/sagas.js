import { put, select, takeEvery } from 'redux-saga/effects';
import {
  PROFILE_FAILURE,
  LOGIN_FAILURE,
  AUTH_CHECK_FAILURE,
  UPDATE_EMAIL_FAILURE,
  logout,
} from '../profile/actions';
import {
  LOGIN_FAILURE as LOGIN_EDGE_FAILURE,
  CONFIRM_PIN_FAILURE,
} from '../edge/actions';
import { LIST_FAILURE as NOTIFICATIONS_LIST_FAILURE } from '../notifications/actions';
import { CAPTCHA_FAILURE } from '../registrations/actions';
import { showGenericErrorModal } from '../modal/actions';
import { homePageLink as getHomePageLink } from '../refProfile/selectors';
import { showGenericError as getShowGenericError } from '../modal/selectors';

import { ErrorData } from './constants';

export const toString = obj =>
  Object.entries(obj)
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ');

export function* notify(history) {
  yield takeEvery('*', function*(action) {
    if (
      action.error &&
      action.type !== PROFILE_FAILURE &&
      action.type !== AUTH_CHECK_FAILURE &&
      action.type !== LOGIN_FAILURE &&
      action.type !== LOGIN_EDGE_FAILURE &&
      action.type !== NOTIFICATIONS_LIST_FAILURE &&
      action.type !== CAPTCHA_FAILURE &&
      action.type !== CONFIRM_PIN_FAILURE
    ) {
      const genericErrorIsShowing = yield select(getShowGenericError);

      if (!genericErrorIsShowing) {
        const { title, redirect } = ErrorData[action.type] || {};
        let { buttonText, message } = ErrorData[action.type] || {};

        if (
          action.type === UPDATE_EMAIL_FAILURE &&
          action.error.code === 'NOT_FOUND'
        )
          message = 'Email has been already confirmed';

        if (action.type === UPDATE_EMAIL_FAILURE) buttonText = 'Close';

        yield put(showGenericErrorModal(message, title, buttonText));
        if (redirect) yield history.push(redirect);
      }
    }

    if (
      action.error &&
      action.error.code === 'PERMISSION_DENIED' &&
      action.error.fields &&
      action.error.fields.token === 'WRONG_TOKEN'
    ) {
      const homePageLink = yield select(getHomePageLink);
      yield put(logout({ history }, homePageLink));
    }
  });
}
