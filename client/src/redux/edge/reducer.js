import { combineReducers } from 'redux';
import { LOGOUT_SUCCESS } from '../profile/actions';
import * as actions from './actions';

const PIN_CONFIRM_DEFAULT = {};

export default combineReducers({
  loading(state = false, action) {
    switch (action.type) {
      case actions.LOGIN_REQUEST:
      case actions.LOGOUT_REQUEST:
      case actions.SIGNUP_REQUEST:
      case actions.CHANGE_PASSWORD_REQUEST:
        return true;
      case actions.LOGIN_SUCCESS:
      case actions.LOGIN_FAILURE:
      case actions.LOGOUT_SUCCESS:
      case actions.LOGOUT_FAILURE:
      case actions.SIGNUP_SUCCESS:
      case actions.SIGNUP_FAILURE:
      case actions.CHANGE_PASSWORD_SUCCESS:
      case actions.CHANGE_PASSWORD_FAILURE:
        return false;
      default:
        return state;
    }
  },
  account(state = null, action) {
    switch (action.type) {
      case actions.LOGIN_SUCCESS:
      case actions.SET_ACCOUNT:
        return action.data;
      case actions.LOGOUT_SUCCESS:
      case LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
  loginSuccess(state = false, action) {
    switch (action.type) {
      case actions.LOGIN_SUCCESS: {
        return true;
      }
      case actions.LOGIN_REQUEST:
        return false;
      default:
        return state;
    }
  },
  loginFailure(state = {}, action) {
    switch (action.type) {
      case actions.LOGIN_FAILURE: {
        return action.error;
      }
      case actions.LOGIN_SUCCESS:
      case actions.LOGIN_REQUEST:
        return {};
      default:
        return state;
    }
  },
  edgeContextSet(state = false, action) {
    switch (action.type) {
      case actions.EDGE_CONTEXT_INIT_SUCCESS: {
        return true;
      }
      default:
        return state;
    }
  },
  cachedUsers(state = [], action) {
    switch (action.type) {
      case actions.CACHED_USERS_REQUEST: {
        return [];
      }
      case actions.CACHED_USERS_SUCCESS: {
        return action.data;
      }
      default:
        return state;
    }
  },
  recoveryQuestions(state = [], action) {
    switch (action.type) {
      case actions.RECOVERY_QUEST_REQUEST: {
        return [];
      }
      case actions.RECOVERY_QUEST_SUCCESS: {
        return action.data;
      }
      default:
        return state;
    }
  },
  usernameIsAvailable(state = false, action) {
    switch (action.type) {
      case actions.USERNAME_AVAIL_SUCCESS: {
        return action.data;
      }
      case actions.USERNAME_AVAIL_REQUEST: {
        return false;
      }
      default:
        return state;
    }
  },
  usernameAvailableLoading(state = false, action) {
    switch (action.type) {
      case actions.USERNAME_AVAIL_FAILURE:
      case actions.USERNAME_AVAIL_SUCCESS: {
        return false;
      }
      case actions.USERNAME_AVAIL_REQUEST: {
        return true;
      }
      default:
        return state;
    }
  },
  pinConfirmation(state = PIN_CONFIRM_DEFAULT, action) {
    switch (action.type) {
      case actions.RESET_PIN_CONFIRM:
      case actions.CONFIRM_PIN_REQUEST: {
        if (!Object.keys(state).length) return state;
        if (state.account && state.account.loggedIn) state.account.logout();
        delete state.account;
        delete state.keys;
        delete state.action;
        delete state.data;
        delete state.error;
        return PIN_CONFIRM_DEFAULT;
      }
      case actions.CONFIRM_PIN_SUCCESS:
      case actions.CONFIRM_PIN_FAILURE: {
        if (action.error) return { error: action.error };
        return action.data;
      }
      default:
        return state;
    }
  },
  confirmingPin(state = false, action) {
    switch (action.type) {
      case actions.CONFIRM_PIN_REQUEST: {
        return true;
      }
      case actions.CONFIRM_PIN_SUCCESS:
      case actions.CONFIRM_PIN_FAILURE: {
        return false;
      }
      default:
        return state;
    }
  },
  changePasswordResults(state = {}, action) {
    switch (action.type) {
      case actions.CHANGE_PASSWORD_SUCCESS: {
        return action.data;
      }
      case actions.CHANGE_PASSWORD_REQUEST:
      case actions.CHANGE_PASSWORD_FAILURE: {
        return {};
      }
      default:
        return state;
    }
  },
});
