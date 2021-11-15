import { History } from 'history';

import {
  FioNameType,
  WalletKeys,
  FioNameItemProps,
  FioWalletDoublet,
  PinConfirmation,
} from '../../types';

export type ContainerOwnProps = {
  fioNameList: FioNameItemProps[];
  name: string;
  pageName: FioNameType;
  history: History;
};

export type FeePrice = {
  nativeFio: number | null;
  costFio: number | null;
  costUsdc: number | null;
};

export type ContainerProps = {
  children?: React.ReactNode;
  feePrice: FeePrice;
  walletPublicKey: string;
  currentWallet: FioWalletDoublet;
  result: { feeCollected?: FeePrice; error?: string; };
  loading: boolean;
  renewProcessing: boolean;
  refreshBalance: (publicKey: string) => void;
  renew: (params: { fioName: string; fee: number; keys: WalletKeys }) => void;
  getFee: (isFioAddress: boolean) => void;
  showPinModal: (action: string) => void;
  resetPinConfirm: () => void;
  pinConfirmation: PinConfirmation;
} & ContainerOwnProps;
