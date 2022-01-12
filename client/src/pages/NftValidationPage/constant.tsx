import React from 'react';

import ContractAddressField from './components/ContractAddressField';
import GenericNftValidationField, {
  FIELDS_NAMES,
} from './components/GenericNftValidationField';
import { renderContractAddressTitle } from './components/ContractAddressTitle';
import {
  renderFioCryptoHandleTitle,
  renderHashTitle,
  renderImageTitle,
} from './components/GenericTitleComponent';

import {
  renderContractAddressItem,
  renderFioCryptoHandleItem,
  renderHashItem,
  renderImageItem,
} from './components/GenericNftItemResult';

import ImageField from './components/ImageField';

import {
  ValidationOption,
  TitleNameId,
  ResultTitleId,
} from './components/types';

export const NFT_ITEMS_TITLE_NAMES: {
  [key: string]: { id: ResultTitleId; name: string; fieldName?: string };
} = {
  contractAddress: {
    name: 'Contract Address',
    id: 'contractAddress',
  },
  chainCode: {
    name: 'Chain Code',
    id: 'chainCode',
  },
  tokenId: {
    name: 'Token ID',
    id: 'tokenId',
  },
  fioCryptoHandle: {
    name: 'FIO Crypto Handle',
    id: 'fioCryptoHandle',
  },
  url: {
    name: 'URL',
    id: 'url',
  },
  hash: {
    name: 'Hash / Media URL',
    fieldName: 'Hash',
    id: 'hash',
  },
};

export const TITLE_NAME: {
  [key: string]: { id: TitleNameId; name: string; fieldName?: string };
} = {
  ...NFT_ITEMS_TITLE_NAMES,
  image: {
    name: 'Image',
    id: 'image',
  },
  imageName: {
    name: 'Image Name',
    id: 'imageName',
  },
  imageUrl: {
    name: 'Image URL',
    id: 'imageUrl',
  },
};

export const OPTIONS: {
  [key: string]: ValidationOption;
} = {
  contractAddress: {
    id: TITLE_NAME.contractAddress.id,
    name: TITLE_NAME.contractAddress.name,
    field: <ContractAddressField />,
    resultsTitle: renderContractAddressTitle,
    resultsItem: renderContractAddressItem,
    hasWarningBadge: true,
  },
  fioCryptoHandle: {
    id: TITLE_NAME.fioCryptoHandle.id,
    name: TITLE_NAME.fioCryptoHandle.name,
    field: (
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.FIO_CRYPTO_HANDLE}
        isMaxField={true}
      />
    ),
    resultsTitle: renderFioCryptoHandleTitle,
    resultsItem: renderFioCryptoHandleItem,
    showGroupResults: true,
  },
  hash: {
    id: TITLE_NAME.hash.id,
    name: TITLE_NAME.hash.name,
    field: (
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.HASH}
        isMaxField={true}
      />
    ),
    resultsTitle: renderHashTitle,
    resultsItem: renderHashItem,
    showGroupResults: true,
  },
  image: {
    id: TITLE_NAME.image.id,
    name: TITLE_NAME.image.name,
    field: <ImageField />,
    resultsTitle: renderImageTitle,
    resultsItem: renderImageItem,
    showGroupResults: true,
  },
};

export const optionsList = Object.values(OPTIONS).map(({ id, name }) => ({
  id,
  name,
}));
