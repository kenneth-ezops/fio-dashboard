import { combineReducers } from 'redux';

import * as actions from './actions';
import { CONFIRM_PIN_SUCCESS } from '../edge/actions';
import { PROFILE_SUCCESS } from '../profile/actions';

import { GenericErrorDataTypes, PinConfirmDataTypes } from './types';

export default combineReducers({
  showLogin(state: boolean = false, action) {
    switch (action.type) {
      case actions.SHOW_LOGIN:
        return true;
      case actions.CLOSE_LOGIN:
        return false;
      default:
        return state;
    }
  },
  showRecovery(state: boolean = false, action) {
    switch (action.type) {
      case actions.SHOW_RECOVERY_PASSWORD:
        return true;
      case actions.CLOSE_RECOVERY_PASSWORD:
        return false;
      case PROFILE_SUCCESS:
        return !action.data.secretSet && !action.data.secretSetNotification;
      default:
        return state;
    }
  },
  showPinConfirm(state: boolean = false, action) {
    switch (action.type) {
      case actions.SHOW_PIN_CONFIRM:
        return true;
      case CONFIRM_PIN_SUCCESS:
      case actions.CLOSE_PIN_CONFIRM:
        return false;
      default:
        return state;
    }
  },
  pinConfirmData(state: PinConfirmDataTypes = {}, action) {
    switch (action.type) {
      case actions.SHOW_PIN_CONFIRM:
        return { action: action.data.confirmAction, data: action.data.data };
      case CONFIRM_PIN_SUCCESS:
      case actions.CLOSE_PIN_CONFIRM:
        return {};
      default:
        return state;
    }
  },
  showGenericError(state: boolean = false, action) {
    switch (action.type) {
      case actions.SHOW_GENERIC_ERROR_MODAL:
        return true;
      case actions.CLOSE_GENERIC_ERROR_MODAL:
        return false;
      default:
        return state;
    }
  },
  genericErrorData(state: GenericErrorDataTypes = {}, action) {
    switch (action.type) {
      case actions.SHOW_GENERIC_ERROR_MODAL:
        return action.data;
      case actions.CLEAR_GENERIC_ERROR_DATA:
        return {};
      default:
        return state;
    }
  },
});
