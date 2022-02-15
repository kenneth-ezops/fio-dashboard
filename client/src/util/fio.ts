import isEmpty from 'lodash/isEmpty';
import { PublicAddress } from '@fioprotocol/fiosdk/src/entities/PublicAddress';

import apis from '../api';
import { sleep, isDomain } from '../utils';
import MathOp from '../util/math';
import { FREE_ADDRESS_REGISTER_ERROR, ERROR_TYPES } from '../constants/errors';
import { RegisterAddressError } from '../util/errors';

import { FIO_REQUEST_STATUS_TYPES } from '../constants/fio';
import { CHAIN_CODES } from '../constants/common';

import {
  NftTokenResponse,
  CartItem,
  RegistrationResult,
  Prices,
  PublicAddressDoublet,
  IncomePrices,
} from '../types';

export const waitForAddressRegistered = async (fioAddress: string) => {
  const CALL_INTERVAL = 3000; // 3 sec
  const WAIT_TIMEOUT = 60000; // 60 sec
  const startTime = new Date().getTime();

  const checkAddressIsRegistered: () => Promise<void> = async () => {
    try {
      const { is_registered } = await apis.fio.availCheck(fioAddress);
      if (is_registered) return;
    } catch (e) {
      //
    }
    const timeOver = new Date().getTime() - startTime >= WAIT_TIMEOUT;
    if (timeOver)
      throw new RegisterAddressError({
        errorType: ERROR_TYPES.freeAddressIsNotRegistered,
        message: FREE_ADDRESS_REGISTER_ERROR,
      });
    await sleep(CALL_INTERVAL);
    return checkAddressIsRegistered();
  };

  return checkAddressIsRegistered();
};

export const transformNft = (nfts: NftTokenResponse[]) => {
  const nftList = [];
  for (const item of nfts) {
    const nftItem = {
      fioAddress: item.fio_address,
      contractAddress: item.contract_address,
      chainCode: item.chain_code,
      tokenId: item.token_id,
      url: item.url,
      hash: item.hash,
      metadata: item.metadata,
    };
    nftList.push(nftItem);
  }
  return nftList;
};

export const fioAddressToPubKey = async (
  fioAddress: string,
): Promise<string> => {
  let isFioAddress = false;
  let pubKey = '';
  try {
    apis.fio.isFioAddressValid(fioAddress);
    isFioAddress = true;
  } catch (e) {
    //
  }

  if (isFioAddress) {
    try {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(fioAddress);
      pubKey = publicAddress;
    } catch (e) {
      //
    }
  }

  return pubKey;
};

export const transformResult = ({
  result,
  cart,
  prices,
  roe,
}: {
  result: RegistrationResult;
  cart: CartItem[];
  prices: Prices;
  roe: number;
}) => {
  const errItems = [];
  const regItems = [];

  const { registered, errors, partial } = result;

  const updatedCart = [...cart];

  const {
    fio: { address: addressCostFio, domain: domainCostFio },
    usdt: { address: addressCostUsdc, domain: domainCostUsdc },
  } = prices;

  if (!isEmpty(errors)) {
    for (const item of errors) {
      const { fioName, error, isFree, cartItemId, errorType } = item;

      const retObj: CartItem = {
        id: fioName,
        domain: '',
      };

      const partialIndex = partial && partial.indexOf(cartItemId);
      if (!isDomain(fioName)) {
        const name = fioName.split('@');
        const addressName = name[0];
        const domainName = name[1];

        retObj.address = addressName;
        retObj.domain = domainName;
        retObj.error = error;
        retObj.errorType = errorType;

        if (isFree) {
          retObj.isFree = isFree;
        } else {
          if (
            cart.find(
              cartItem =>
                cartItem.id === cartItemId && cartItem.hasCustomDomain,
            ) &&
            partialIndex < 0
          ) {
            retObj.costFio = new MathOp(addressCostFio)
              .add(domainCostFio)
              .toNumber();
            retObj.costUsdc = new MathOp(addressCostUsdc)
              .add(domainCostUsdc)
              .toNumber();
          } else {
            retObj.costFio = addressCostFio;
            retObj.costUsdc = addressCostUsdc;
          }
        }
      } else {
        retObj.domain = fioName;
        retObj.costFio = domainCostFio;
        retObj.costUsdc = domainCostUsdc;
      }

      errItems.push(retObj);
      if (partialIndex > 0) {
        updatedCart.splice(partialIndex, 1, retObj);
      }
    }
  }

  if (!isEmpty(registered)) {
    for (const item of registered) {
      const { fioName, isFree, fee_collected } = item;

      const retObj: CartItem = {
        id: fioName,
        domain: '',
      };

      if (!isDomain(fioName)) {
        const name = fioName.split('@');
        const addressName = name[0];
        const domainName = name[1];

        retObj.address = addressName;
        retObj.domain = domainName;

        if (isFree) {
          retObj.isFree = isFree;
        } else {
          retObj.costFio = apis.fio.sufToAmount(fee_collected);
          retObj.costUsdc = apis.fio.convertFioToUsdc(fee_collected, roe);
        }
      } else {
        retObj.domain = fioName;
        retObj.costFio = apis.fio.sufToAmount(fee_collected);
        retObj.costUsdc = apis.fio.convertFioToUsdc(fee_collected, roe);
      }

      regItems.push(retObj);

      for (let i = updatedCart.length - 1; i >= 0; i--) {
        if (updatedCart[i].id === fioName) {
          updatedCart.splice(i, 1);
        }
      }
    }
  }

  return { errItems, regItems, updatedCart };
};

export const genericTokenId = (
  chainCode: string,
  tokenId: string,
  contractAddress: string,
) => `${chainCode}-${tokenId}-${contractAddress}`;

export const transformPublicAddresses = (
  publicAddresses: PublicAddressDoublet[],
): PublicAddress[] =>
  publicAddresses.map(publicAddressObj => {
    const { chainCode, tokenCode, publicAddress } = publicAddressObj;

    return {
      chain_code: chainCode,
      token_code: tokenCode === '*' ? chainCode : tokenCode,
      public_address: publicAddress,
    };
  });

export const normalizePublicAddresses = (
  publicAddresses: PublicAddressDoublet[],
): PublicAddressDoublet[] =>
  publicAddresses.map(({ chainCode, tokenCode, publicAddress }) => ({
    chainCode,
    tokenCode: tokenCode === '*' ? chainCode : tokenCode,
    publicAddress,
  }));

export const statusBadgeColours = (status: string) => ({
  isBlue: FIO_REQUEST_STATUS_TYPES.PAID === status,
  isOrange: FIO_REQUEST_STATUS_TYPES.REJECTED === status,
  isRose: FIO_REQUEST_STATUS_TYPES.PENDING === status,
});

export const isFioChain = (chain: string) => chain === CHAIN_CODES.FIO;

export const convertPrices = (prices: IncomePrices): { pricing: Prices } => {
  const pricing = {
    ...prices.pricing,
    fio: { address: 0, domain: 0 },
    usdt: { address: 0, domain: 0 },
  };

  pricing.fio = {
    address: apis.fio.sufToAmount(pricing.fioNative.address),
    domain: apis.fio.sufToAmount(pricing.fioNative.domain),
  };

  pricing.usdt = {
    address: apis.fio.convertFioToUsdc(
      pricing.fioNative.address,
      pricing.usdtRoe,
    ),
    domain: apis.fio.convertFioToUsdc(
      pricing.fioNative.domain,
      pricing.usdtRoe,
    ),
  };
  return { pricing };
};
