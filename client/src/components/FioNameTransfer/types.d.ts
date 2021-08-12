import { History } from 'history';

import {
  FioWalletDoublet,
  PageNameType,
  FioNameItemProps,
  PinConfirmation,
  FeePrice,
} from '../../types';

export type TransferParams = {
  fioName: string;
  newOwnerFioAddress?: string;
  newOwnerKey?: string;
  fee: number;
  keys: { public: string; private: string };
};

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  pageName: PageNameType;
  history: History;
};

export type ContainerProps = {
  children?: React.ReactNode;
  feePrice: FeePrice;
  walletPublicKey: string;
  currentWallet: FioWalletDoublet;
  result: { feeCollected?: FeePrice; error?: string; newOwnerKey?: string };
  loading: boolean;
  transferProcessing: boolean;
  transferAddressValue: string;
  refreshBalance: (publicKey: string) => void;
  transfer: (params: TransferParams) => void;
  getFee: (isFioAddress: boolean) => void;
  getPrices: () => void;
  showPinModal: (action: string) => void;
  resetPinConfirm: () => void;
  pinConfirmation: PinConfirmation;
} & ContainerOwnProps;