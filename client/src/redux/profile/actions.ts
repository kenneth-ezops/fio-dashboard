import { Ecc } from '@fioprotocol/fiojs';
import { Api } from '../../api';
import {
  EmailConfirmationStateData,
  FioWalletDoublet,
  WalletKeysObj,
} from '../../types';
import { RouterProps } from 'react-router';
import { minWaitTimeFunction } from '../../utils';

export const prefix: string = 'profile';

export const AUTH_CHECK_REQUEST = `${prefix}/AUTH_CHECK_REQUEST`;
export const AUTH_CHECK_SUCCESS = `${prefix}/AUTH_CHECK_SUCCESS`;
export const AUTH_CHECK_FAILURE = `${prefix}/AUTH_CHECK_FAILURE`;

export const checkAuthToken = () => ({
  types: [AUTH_CHECK_REQUEST, AUTH_CHECK_SUCCESS, AUTH_CHECK_FAILURE],
  promise: (api: Api) => api.auth.profile(),
});

export const PROFILE_REQUEST = `${prefix}/PROFILE_REQUEST`;
export const PROFILE_SUCCESS = `${prefix}/PROFILE_SUCCESS`;
export const PROFILE_FAILURE = `${prefix}/PROFILE_FAILURE`;

export const loadProfile = () => ({
  types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
  promise: (api: Api) => api.auth.profile(),
});

export const NONCE_REQUEST = `${prefix}/NONCE_REQUEST`;
export const NONCE_SUCCESS = `${prefix}/NONCE_SUCCESS`;
export const NONCE_FAILURE = `${prefix}/NONCE_FAILURE`;

export const nonce = (username: string, keys: WalletKeysObj) => ({
  types: [NONCE_REQUEST, NONCE_SUCCESS, NONCE_FAILURE],
  promise: async (api: Api) => {
    const { nonce, email } = await api.auth.nonce(username);
    const signature: string = Ecc.sign(nonce, Object.values(keys)[0].private);
    return { email, nonce, signature };
  },
});

export const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;
export const LOGIN_SUCCESS = `${prefix}/LOGIN_SUCCESS`;
export const LOGIN_FAILURE = `${prefix}/LOGIN_FAILURE`;

export const login = ({
  email,
  signature,
  challenge,
  referrerCode,
}: {
  email: string;
  signature: string;
  challenge: string;
  referrerCode?: string;
}) => ({
  types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
  promise: (api: Api) =>
    api.auth.login(email, signature, challenge, referrerCode),
});

export const SIGNUP_REQUEST = `${prefix}/SIGNUP_REQUEST`;
export const SIGNUP_SUCCESS = `${prefix}/SIGNUP_SUCCESS`;
export const SIGNUP_FAILURE = `${prefix}/SIGNUP_FAILURE`;
export const RESET_SUCCESS_STATE = `${prefix}/RESET_SUCCESS_STATE`;

export const signup = (data: {
  username: string;
  email: string;
  fioWallets: FioWalletDoublet[];
  refCode?: string;
  stateData?: EmailConfirmationStateData;
}) => ({
  types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
  promise: (api: Api) => api.auth.signup(data),
  fioWallets: data.fioWallets,
});

export const resetSuccessState = () => ({
  type: RESET_SUCCESS_STATE,
});

export const LOGOUT_REQUEST = `${prefix}/LOGOUT_REQUEST`;
export const LOGOUT_SUCCESS = `${prefix}/LOGOUT_SUCCESS`;
export const LOGOUT_FAILURE = `${prefix}/LOGOUT_FAILURE`;

export const logout = ({ history }: RouterProps, redirect: string = '') => ({
  types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
  promise: async (api: Api) => {
    const res = await api.auth.logout();
    if (redirect) history.push(redirect);
    return res;
  },
});

export const SET_RECOVERY_REQUEST = `${prefix}/SET_RECOVERY_REQUEST`;
export const SET_RECOVERY_SUCCESS = `${prefix}/SET_RECOVERY_SUCCESS`;
export const SET_RECOVERY_FAILURE = `${prefix}/SET_RECOVERY_FAILURE`;

export const setRecoveryQuestions = (token: string) => ({
  types: [SET_RECOVERY_REQUEST, SET_RECOVERY_SUCCESS, SET_RECOVERY_FAILURE],
  promise: async (api: Api) =>
    minWaitTimeFunction(() => api.auth.setRecovery(token), 4000),
});

export const RESET_LAST_AUTH_DATA = `${prefix}/RESET_LAST_AUTH_DATA`;

export const resetLastAuthData = () => ({
  type: RESET_LAST_AUTH_DATA,
});

export const SECONDS_SINCE_LAST_ACTIVITY = `${prefix}/SECONDS_SINCE_LAST_ACTIVITY`;

export const setLastActivity = (value: number) => ({
  type: SECONDS_SINCE_LAST_ACTIVITY,
  data: value,
});

export const RESEND_RECOVERY_REQUEST = `${prefix}/RESEND_RECOVERY_REQUEST`;
export const RESEND_RECOVERY_SUCCESS = `${prefix}/RESEND_RECOVERY_SUCCESS`;
export const RESEND_RECOVERY_FAILURE = `${prefix}/RESEND_RECOVERY_FAILURE`;

export const resendRecovery = (token: string) => ({
  types: [
    RESEND_RECOVERY_REQUEST,
    RESEND_RECOVERY_SUCCESS,
    RESEND_RECOVERY_FAILURE,
  ],
  promise: (api: Api) => api.auth.resendRecovery(token),
});

export const CLEAR_RESEND_RECOVERY_RESULTS = `${prefix}/CLEAR_RESEND_RECOVERY_RESULTS`;
export const clearResendRecoveryResults = () => ({
  type: CLEAR_RESEND_RECOVERY_RESULTS,
});

export const RESEND_CONFIRM_EMAIL_REQUEST = `${prefix}/RESEND_CONFIRM_EMAIL_REQUEST`;
export const RESEND_CONFIRM_EMAIL_SUCCESS = `${prefix}/RESEND_CONFIRM_EMAIL_SUCCESS`;
export const RESEND_CONFIRM_EMAIL_FAILURE = `${prefix}/RESEND_CONFIRM_EMAIL_FAILURE`;

export const resendConfirmEmail = (
  token: string,
  stateData: EmailConfirmationStateData,
) => ({
  types: [
    RESEND_CONFIRM_EMAIL_REQUEST,
    RESEND_CONFIRM_EMAIL_SUCCESS,
    RESEND_CONFIRM_EMAIL_FAILURE,
  ],
  promise: (api: Api) =>
    minWaitTimeFunction(() => api.auth.resendConfirmEmail(token, stateData)),
});

export const CONFIRM_EMAIL_REQUEST = `${prefix}/CONFIRM_EMAIL_REQUEST`;
export const CONFIRM_EMAIL_SUCCESS = `${prefix}/CONFIRM_EMAIL_SUCCESS`;
export const CONFIRM_EMAIL_FAILURE = `${prefix}/CONFIRM_EMAIL_FAILURE`;

export const confirmEmail = (hash: string) => ({
  types: [CONFIRM_EMAIL_REQUEST, CONFIRM_EMAIL_SUCCESS, CONFIRM_EMAIL_FAILURE],
  promise: (api: Api) => api.auth.confirm(hash),
});
