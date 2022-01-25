import { RouteComponentProps } from 'react-router-dom';
import { FeePrice, FioNameItemProps } from '../../types';

type MatchProps = {
  name: string;
};

export type AddBundlesValues = {
  fioAddress: string;
  bundleSets: number;
  maxFee?: number;
};

export interface ContainerOwnProps extends RouteComponentProps<MatchProps> {}

export interface ContainerProps extends ContainerOwnProps {
  fioAddresses: FioNameItemProps[];
  name: string;
  feePrice: FeePrice;
  roe: number;
  loading: boolean;
  getFee: () => void;
}
