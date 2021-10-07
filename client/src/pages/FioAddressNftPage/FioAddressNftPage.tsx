import React from 'react';
import { Redirect } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import SignNft from '../../components/SignNft';

import { ROUTES } from '../../constants/routes';

import { putParamsToUrl } from '../../utils';

import { FioAddressDoublet, NFTTokenDoublet } from '../../types';

type Props = {
  nft: { address: string; currentNft: NFTTokenDoublet };
  fioAddresses: FioAddressDoublet[];
};

const FioAddressNftPage: React.FC<Props> = props => {
  const {
    nft: { address, currentNft },
    fioAddresses,
  } = props;
  const {
    chainCode: chain_code,
    tokenId: token_id,
    contractAddress: contract_address,
    url,
    hash,
    metadata,
  } = currentNft || {};

  const creatorUrl = (() => {
    try {
      return JSON.parse(metadata).creator_url;
    } catch (err) {
      return '';
    }
  })();

  const initialValues = {
    chain_code,
    token_id,
    contract_address,
    url,
    hash,
    creator_url: creatorUrl,
  };

  if (!currentNft || !address || isEmpty(fioAddresses))
    return (
      <Redirect
        to={{
          pathname: ROUTES.FIO_ADDRESSES,
        }}
      />
    );
  return (
    <SignNft
      isEdit={true}
      initialValues={initialValues}
      fioAddressName={address}
      backTo={putParamsToUrl(ROUTES.FIO_ADDRESS_SIGNATURES, {
        address: address,
      })}
    />
  );
};

export default FioAddressNftPage;