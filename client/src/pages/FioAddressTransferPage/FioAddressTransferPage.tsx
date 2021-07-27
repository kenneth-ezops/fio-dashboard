import React from 'react';
import FioNameTransferContainer from '../../components/FioNameTransfer/FioNameTransferContainer';

import { RouteComponentProps } from 'react-router-dom';

import { FioNameItemProps } from '../../types';
import { ADDRESS } from '../../constants/common';

type MatchParams = {
  id: string;
};
type Props = {
  fioNameList: FioNameItemProps[];
};

export const FioAddressTransferPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { fioNameList, match, history } = props;
  const { id: name } = match.params;

  return (
    <FioNameTransferContainer
      pageName={ADDRESS}
      fioNameList={fioNameList}
      name={name}
      history={history}
    />
  );
};