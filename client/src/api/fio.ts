import { FIOSDK } from '@fioprotocol/fiosdk';
import {
  AvailabilityResponse,
  RegisterFioAddressResponse,
  RegisterFioDomainResponse,
  TransferFioAddressResponse,
  TransferFioDomainResponse,
  FioNamesResponse,
  FioAddressesResponse,
  FioDomainsResponse,
  PublicAddressResponse,
  SetFioDomainVisibilityResponse,
} from '@fioprotocol/fiosdk/src/entities/responses';
import { Transactions } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { isDomain } from '../utils';

type FIOSDK_LIB = typeof FIOSDK;

export default class Fio {
  baseurl: string = process.env.REACT_APP_FIO_BASE_URL;
  publicFioSDK: FIOSDK_LIB | null = null;
  walletFioSDK: FIOSDK_LIB | null = null;

  constructor() {
    this.publicFioSDK = new FIOSDK('', '', this.baseurl, window.fetch);
  }

  amountToSUF = (amount: number): number => FIOSDK.amountToSUF(amount);

  sufToAmount = (suf: number): number => FIOSDK.SUFToAmount(suf);

  setBaseUrl = (): string => (Transactions.baseUrl = this.baseurl);

  checkWallet = (): void => {
    if (!this.walletFioSDK) throw new Error('No wallet set.');
  };

  validateAction = (): void => {
    this.checkWallet();
    this.setBaseUrl();
  };

  setWalletFioSdk = (keys: { public: string; private: string }): void =>
    (this.walletFioSDK = new FIOSDK(
      keys.private,
      keys.public,
      this.baseurl,
      window.fetch,
    ));

  clearWalletFioSdk = (): null => (this.walletFioSDK = null);

  logError = (e: { errorCode: number }) => {
    if (e.errorCode !== 404) console.error(e);
  };

  extractError = (json: {
    fields?: { error: string }[];
    message?: string;
  }): string => {
    if (!json) return '';

    return json && json.fields && json.fields[0]
      ? json.fields[0].error
      : json.message;
  };

  availCheck = (fioName: string): Promise<AvailabilityResponse> => {
    this.setBaseUrl();
    return this.publicFioSDK.isAvailable(fioName);
  };

  register = async (
    fioName: string,
    fee: number,
  ): Promise<RegisterFioAddressResponse | RegisterFioDomainResponse> => {
    this.validateAction();
    if (isDomain(fioName)) {
      return await this.walletFioSDK.registerFioDomain(fioName, fee);
    }
    return await this.walletFioSDK.registerFioAddress(fioName, fee);
  };

  transfer = async (
    fioName: string,
    newOwnerKey: string,
    fee: number,
  ): Promise<TransferFioAddressResponse | TransferFioDomainResponse> => {
    this.validateAction();
    if (isDomain(fioName)) {
      return await this.walletFioSDK.transferFioDomain(
        fioName,
        newOwnerKey,
        fee,
      );
    }
    return await this.walletFioSDK.transferFioAddress(
      fioName,
      newOwnerKey,
      fee,
    );
  };

  setDomainVisibility = async (
    fioDomain: string,
    isPublic: boolean,
    fee: number,
  ): Promise<SetFioDomainVisibilityResponse> => {
    this.validateAction();
    return this.walletFioSDK.setFioDomainVisibility(fioDomain, isPublic, fee);
  };

  getBalance = async (publicKey: string): Promise<number> => {
    this.setBaseUrl();
    try {
      const { balance } = await this.publicFioSDK.getFioBalance(publicKey);
      return FIOSDK.SUFToAmount(balance);
    } catch (e) {
      this.logError(e);
    }

    return 0;
  };

  getFioNames = async (publicKey: string): Promise<FioNamesResponse> => {
    this.setBaseUrl();
    try {
      // do not return method to handle errors here
      const res = await this.publicFioSDK.getFioNames(publicKey);
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { fio_addresses: [], fio_domains: [] };
  };

  getFioAddresses = async (
    publicKey: string,
    limit: number,
    offset: number,
  ): Promise<FioAddressesResponse & { more: number }> => {
    this.setBaseUrl();
    try {
      const res = await this.publicFioSDK.getFioAddresses(
        publicKey,
        limit,
        offset,
      );
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { fio_addresses: [], more: 0 };
  };

  getFioDomains = async (
    publicKey: string,
    limit: number,
    offset: number,
  ): Promise<FioDomainsResponse & { more: number }> => {
    this.setBaseUrl();
    try {
      const res = await this.publicFioSDK.getFioDomains(
        publicKey,
        limit,
        offset,
      );
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { fio_domains: [], more: 0 };
  };

  getFioPublicAddress = async (
    fioAddress: string,
  ): Promise<PublicAddressResponse> => {
    this.setBaseUrl();
    try {
      const res = await this.publicFioSDK.getFioPublicAddress(fioAddress);
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { public_address: '' };
  };

  getPubAddressesForFioAddresses = async (
    fioAddresses: string[],
  ): Promise<{
    [fioAddress: string]: {
      publicAddress: string;
      chainCode: string;
      tokenCode: string;
    }[];
  }> => {
    const retResult: {
      [fioAddress: string]: {
        publicAddress: string;
        chainCode: string;
        tokenCode: string;
      }[];
    } = {};

    // todo: change to getAllPublicAddresses after fioSDK update;
    const cryptoCurrencies = ['BTC', 'ETH', 'BCH'];
    for (const fioAddress of fioAddresses) {
      const fioAddressRes = [];
      for (const chainCode of cryptoCurrencies) {
        try {
          this.setBaseUrl();
          const {
            public_address: publicAddress,
          } = await this.publicFioSDK.getPublicAddress(
            fioAddress,
            chainCode,
            chainCode,
          );
          fioAddressRes.push({
            publicAddress,
            chainCode,
            tokenCode: chainCode,
          });
        } catch (e) {
          this.logError(e);
        }
      }
      retResult[fioAddress] = fioAddressRes;
    }
    return retResult;
  };
}