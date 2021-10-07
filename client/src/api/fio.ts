import { FIOSDK } from '@fioprotocol/fiosdk';
import { AvailabilityResponse } from '@fioprotocol/fiosdk/src/entities/AvailabilityResponse';
import { FioNamesResponse } from '@fioprotocol/fiosdk/src/entities/FioNamesResponse';
import { FioAddressesResponse } from '@fioprotocol/fiosdk/src/entities/FioAddressesResponse';
import { FioDomainsResponse } from '@fioprotocol/fiosdk/src/entities/FioDomainsResponse';
import { PublicAddressResponse } from '@fioprotocol/fiosdk/src/entities/PublicAddressResponse';
import { SetFioDomainVisibilityResponse } from '@fioprotocol/fiosdk/src/entities/SetFioDomainVisibilityResponse';
import { PublicAddress } from '@fioprotocol/fiosdk/src/entities/PublicAddress';
import { Transactions } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { EndPoint } from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import { isDomain } from '../utils';
import { NftsResponse } from '@fioprotocol/fiosdk/src/entities/NftsResponse';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';

interface TrxResponse {
  transaction_id?: string;
  status: string;
  expiration?: string;
  fee_collected: number;
  other?: any;
}

type FIOSDK_LIB = typeof FIOSDK;

const defaultFee = 800 * FIOSDK.SUFUnit;

export default class Fio {
  baseurl: string = process.env.REACT_APP_FIO_BASE_URL;
  publicFioSDK: FIOSDK_LIB | null = null;
  walletFioSDK: FIOSDK_LIB | null = null;
  actionEndPoints: { [actionName: string]: string } = {
    ...EndPoint,
    signNft: 'add_nft',
  };

  constructor() {
    this.publicFioSDK = new FIOSDK('', '', this.baseurl, window.fetch);
  }

  amountToSUF = (amount: number): number => FIOSDK.amountToSUF(amount);

  sufToAmount = (suf?: number): number | null => {
    if (!suf && suf !== 0) return null;
    return FIOSDK.SUFToAmount(suf);
  };

  setBaseUrl = (): string => (Transactions.baseUrl = this.baseurl);

  isFioAddressValid = (value: string): boolean =>
    FIOSDK.isFioAddressValid(value);
  isFioPublicKeyValid = (value: string): boolean =>
    FIOSDK.isFioPublicKeyValid(value);
  isChainCodeValid = (value: string): boolean => FIOSDK.isChainCodeValid(value);
  isPublicAddressValid = (value: string): boolean =>
    FIOSDK.isPublicAddressValid(value);

  convert = (amount: number, roe: number): number =>
    Math.round((amount / (FIOSDK.SUFUnit / 100)) * roe) / 100;

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

  register = async (fioName: string, fee: number): Promise<TrxResponse> => {
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
  ): Promise<TrxResponse> => {
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

  renew = async (fioName: string, fee: number): Promise<TrxResponse> => {
    this.validateAction();
    if (isDomain(fioName)) {
      return await this.walletFioSDK.renewFioDomain(fioName, fee);
    }
    return await this.walletFioSDK.renewFioAddress(fioName, fee);
  };

  setDomainVisibility = async (
    fioDomain: string,
    isPublic: boolean,
    fee: number,
  ): Promise<SetFioDomainVisibilityResponse> => {
    this.validateAction();
    return this.walletFioSDK.setFioDomainVisibility(fioDomain, isPublic, fee);
  };

  link = async (
    fioAddress: string,
    publicAddresses: PublicAddress[],
    fee: number,
    isConnection: boolean = true,
  ): Promise<SetFioDomainVisibilityResponse> => {
    this.validateAction();

    return isConnection
      ? await this.walletFioSDK.addPublicAddresses(
          fioAddress,
          publicAddresses,
          fee,
        )
      : await this.walletFioSDK.removePublicAddresses(
          fioAddress,
          publicAddresses,
          fee,
        );
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

    // TODO: change to getAllPublicAddresses after fioSDK update;
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

  getNFTsFioAddress = async (
    fioAddress: string,
    limit: number | null = null,
    offset: number | null = null,
  ): Promise<NftsResponse> => {
    this.setBaseUrl();
    try {
      return await this.publicFioSDK.getNfts({ fioAddress }, limit, offset);
    } catch (e) {
      this.logError(e);
    }
    return {
      nfts: [],
      more: false,
    };
  };

  checkNftSigned = async (
    chainCode: string,
    contractAddress: string,
    tokenId: string,
  ): Promise<NftsResponse> => {
    this.setBaseUrl();
    try {
      return await this.publicFioSDK.getNfts({
        chainCode,
        contractAddress,
        tokenId,
      });
    } catch (e) {
      this.logError(e);
    }
    return {
      nfts: [],
      more: false,
    };
  };

  singNFT = async (
    fioAddress: string,
    nfts: NftItem[],
  ): Promise<TrxResponse> => {
    this.setBaseUrl();
    try {
      this.walletFioSDK.setSignedTrxReturnOption(true);
      const preparedTrx = await this.walletFioSDK.pushTransaction(
        'fio.address',
        'addnft',
        {
          fio_address: fioAddress,
          nfts,
          max_fee: defaultFee,
          tpid: '',
        },
      );
      const result = await this.walletFioSDK.executePreparedTrx(
        this.actionEndPoints.signNft,
        preparedTrx,
      );
      this.walletFioSDK.setSignedTrxReturnOption(false);
      return { other: { nfts }, ...result };
    } catch (err) {
      this.logError(err);
      throw err;
    }
  };
}
