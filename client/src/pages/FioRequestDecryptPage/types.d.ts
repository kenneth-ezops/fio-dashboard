import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FioWalletData, FioWalletDoublet } from '../../types';

type MatchProps = {
  publicKey: string;
  id: number;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {
  children?: React.ReactNode;
}

export interface ContainerProps extends ContainerOwnProps {
  fioWallet: FioWalletDoublet;
  loading: boolean;
  roe: number;
  fioWalletsData: { [publicKey: string]: FioWalletData };
  refreshBalance: (publicKey: string) => void;
}
