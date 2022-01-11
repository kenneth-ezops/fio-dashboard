export const ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION = 5;

export const FIO_CHAIN_CODE = 'FIO';

export const MAX_PUBLIC_ADDRESS_LENGTH = 128;

export const TOKEN_LINK_MIN_WAIT_TIME = 2000;

export const ACTIONS = {
  transferTokens: 'transferTokens',
  addPublicAddress: 'addPublicAddress',
  addPublicAddresses: 'addPublicAddresses',
  removeAllPublicAddresses: 'removeAllPublicAddresses',
  removePublicAddresses: 'removePublicAddresses',
  setFioDomainVisibility: 'setFioDomainVisibility',
  rejectFundsRequest: 'rejectFundsRequest',
  requestFunds: 'requestFunds',
  recordObtData: 'recordObtData',
  registerFioAddress: 'registerFioAddress',
  registerFioDomain: 'registerFioDomain',
  renewFioDomain: 'renewFioDomain',
  transferFioAddress: 'transferFioAddress',
  transferFioDomain: 'transferFioDomain',
  pushTransaction: 'pushTransaction',
  addBundledTransactions: 'addBundledTransactions',
  addNft: 'addNft',
  stakeFioTokens: 'stakeFioTokens',
  unStakeFioTokens: 'unStakeFioTokens',
};

export const ACTIONS_TO_END_POINT_KEYS = {
  [ACTIONS.requestFunds]: 'newFundsRequest',
  [ACTIONS.registerFioAddress]: 'registerFioAddress',
  [ACTIONS.registerFioDomain]: 'registerFioDomain',
  [ACTIONS.renewFioDomain]: 'renewFioDomain',
  [ACTIONS.addPublicAddresses]: 'addPubAddress',
  [ACTIONS.removeAllPublicAddresses]: 'removeAllPubAddresses',
  [ACTIONS.removePublicAddresses]: 'removePubAddress',
  [ACTIONS.setFioDomainVisibility]: 'setFioDomainPublic',
  [ACTIONS.rejectFundsRequest]: 'rejectFundsRequest',
  [ACTIONS.recordObtData]: 'recordObtData',
  [ACTIONS.transferTokens]: 'transferTokens',
  [ACTIONS.pushTransaction]: 'pushTransaction',
  [ACTIONS.transferFioAddress]: 'transferFioAddress',
  [ACTIONS.transferFioDomain]: 'transferFioDomain',
  [ACTIONS.stakeFioTokens]: 'pushTransaction',
  [ACTIONS.unStakeFioTokens]: 'pushTransaction',
  [ACTIONS.addBundledTransactions]: 'addBundledTransactions',
};