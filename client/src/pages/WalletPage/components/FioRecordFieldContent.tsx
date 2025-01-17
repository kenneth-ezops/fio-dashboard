import React from 'react';

import ConvertedAmount from '../../../components/ConvertedAmount/ConvertedAmount';
import Amount from '../../../components/common/Amount';

import { commonFormatTime } from '../../../util/general';
import { priceToNumber } from '../../../utils';
import { isFioChain } from '../../../util/fio';

import { FIO_RECORD_DETAILED_FIELDS } from '../constants';
import { FIO_DATA_TRANSACTION_LINK } from '../../../constants/common';

import { FioRecordViewKeysProps } from '../types';

type Props = {
  value: string;
  field: FioRecordViewKeysProps;
  chain: string;
};

const FioRecordFieldContent: React.FC<Props> = props => {
  const { field, value, chain } = props;

  if (
    field === FIO_RECORD_DETAILED_FIELDS.obtId &&
    Object.keys(FIO_DATA_TRANSACTION_LINK).some(
      chainName => chainName === chain,
    )
  )
    return (
      <a
        href={`${FIO_DATA_TRANSACTION_LINK[chain]}${value}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </a>
    );

  if (field === FIO_RECORD_DETAILED_FIELDS.date)
    return <>{commonFormatTime(value)}</>;

  if (field === FIO_RECORD_DETAILED_FIELDS.amount && isFioChain(chain)) {
    const price = priceToNumber(value);

    return (
      <span>
        <Amount value={price} /> FIO (<ConvertedAmount fioAmount={price} />)
      </span>
    );
  }

  if (field === FIO_RECORD_DETAILED_FIELDS.amount && !isFioChain(chain)) {
    return (
      <span>
        {value} {chain}
      </span>
    );
  }
  return <>{value}</>;
};

export default FioRecordFieldContent;
