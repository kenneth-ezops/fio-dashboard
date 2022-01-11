import { RouteComponentProps } from 'react-router-dom';
import {
  FioAddressDoublet,
  FioWalletDoublet,
  WalletBalances,
} from '../../types';

type MatchProps = {
  publicKey: string;
};

export type RequestTokensValues = {
  payeeFioAddress: string;
  payerFioAddress: string;
  chainCode: string;
  tokenCode: string;
  payeeTokenPublicAddress: string;
  amount: number;
  memo?: string;
};

export type RequestTokensProps = {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  balance: WalletBalances;
  loading: boolean;
  onSubmit: (values: RequestTokensValues) => void;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  fioAddresses: FioAddressDoublet[];
  loading: boolean;
  roe: number;
  balance: WalletBalances;
  refreshBalance: (publicKey: string) => void;
}