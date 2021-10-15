import { EdgeAccount } from 'edge-core-js';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';

export type Domain = { domain: string; free?: boolean };

export type CartItem = {
  address?: string;
  domain: string;
  id: string;
  costFio?: number;
  costUsdc?: number;
  hasCustomDomain?: boolean;
  allowFree?: boolean;
  showBadge?: boolean;
  error?: string;
  isFree?: boolean;
  errorType?: string;
};

export type Notification = {
  id: number;
  type: string;
  action: string;
  title: string;
  message: string;
  seenDate: string;
  closeDate: string;
  createdAt: string;
  isManual?: boolean;
  pagesToShow: string[] | null;
};

export type NotificationParams = {
  type: string;
  action: string;
  title?: string;
  message?: string;
  pagesToShow: string[] | null;
  contentType: string;
};

export type Prices = {
  fio: { address: number; domain: number };
  fioNative: { address: number; domain: number };
  usdt: { address: number; domain: number };
};

export type RegistrationResult = {
  errors: {
    fioName: string;
    error: string;
    isFree?: boolean;
    cartItemId: string;
    errorType: string;
  }[];
  registered: {
    fioName: string;
    isFree?: boolean;
    fee_collected: number;
    cartItemId: string;
  }[];
  partial: string[];
};

export type DeleteCartItem =
  | {
      id?: string;
      cartItems?: CartItem[];
    }
  | string;

export type FioWalletDoublet = {
  id: string;
  edgeId: string;
  name: string;
  publicKey: string;
  balance?: number | null;
  available?: number | null;
  locked?: number | null;
  from: string;
};

export type NewFioWalletDoublet = {
  edgeId?: string;
  name: string;
  publicKey: string;
  from: string;
  data?: any;
};

export type FioAddressDoublet = {
  name: string;
  expiration: string;
  remaining: number;
  walletPublicKey: string;
};

export type FioDomainDoublet = {
  name: string;
  expiration: string;
  isPublic: number;
  walletPublicKey: string;
};

export type PublicAddressDoublet = {
  publicAddress: string;
  chainCode: string;
  tokenCode: string;
};

export type NFTTokenDoublet = {
  contractAddress: string;
  chainCode: string;
  tokenId: string;
  url?: string;
  hash?: string;
  metadata?: string;
  fioAddress?: string;
};

export type NftTokenResponse = {
  fio_address?: string;
} & NftItem;

export type WalletKeysObj = {
  [walletId: string]: {
    private: string;
    public: string;
  };
};

export type LastAuthData = {
  email: string;
  username: string;
} | null;

export type FioNameType = 'address' | 'domain';

export type FioNameItemProps = {
  name?: string;
  expiration?: Date;
  remaining?: number;
  isPublic?: number;
  walletPublicKey?: string;
  publicAddresses?: PublicAddressDoublet[];
};

export type LinkResult = {
  updated: PublicAddressDoublet[];
  failed: PublicAddressDoublet[];
  error?: string | null;
};

export type LinkActionResult = {
  connect: LinkResult;
  disconnect: LinkResult;
};

export type WalletKeys = { private: string; public: string };

export type PinConfirmation = {
  account?: EdgeAccount;
  keys?: { [walletId: string]: WalletKeys };
  action?: string;
  data?: any;
  error?: string | Error;
};

export type FeePrice = {
  nativeFio: number | null;
  costFio: number | null;
  costUsdc: number | null;
};

export type FioBalanceRes = {
  balance?: number;
  available?: number;
  locked?: number;
}

export type WalletBalances = {
  total: {
    nativeFio: number | null;
    fio: string,
    usdc: string,
  },
  available: {
    nativeFio: number | null;
    fio: string,
    usdc: string,
  },
  locked: {
    nativeFio: number | null;
    fio: string,
    usdc: string,
  },
}

export type WalletsBalances = {
  total: WalletBalances,
  wallets: { [publicKey: string]: WalletBalances },
};

export type DomainStatusType = 'private' | 'public';

export type User = {
  email: string;
  username: string;
  fioWallets: FioWalletDoublet[];
  freeAddresses: { name: string }[];
  id: string;
  role: string;
  secretSetNotification: boolean;
  status: string;
  secretSet?: boolean;
  newEmail?: boolean;
};

export type RefProfile = {
  code: string;
  label: string;
  title: string;
  subTitle: string;
  settings: {
    domains: string[];
    allowCustomDomain: boolean;
    actions: string[];
    img: string;
    link: string;
  };
};

type SignNFTQuery = {
  chain_code: string;
  contract_address: string;
  token_id: string;
  url: string;
  hash: string;
  metadata: string;
};

export type SignNFTParams = {
  chainCode: string;
  contractAddress: string;
  tokenId: string;
  url: string;
  hash: string;
  metadata: {
    creatorUrl: string;
  };
};

export type RefQuery = {
  action: string;
  r: string;
} & SignNFTQuery;

export type RefQueryParams = {
  action: string;
  r: string;
} & (SignNFTParams | {});

export type EmailConfirmationStateData = {
  redirectLink?: string;
  refCode?: string;
  refProfileQueryParams?: RefQueryParams;
};

export type CommonObjectProps = { [key: string]: string };

export type NFTTokenItemProps = keyof NFTTokenDoublet;

export type TransactionItem = {
  txId: string;
  currencyCode: string;
  amount: string;
  nativeAmount: string;
  networkFee: string;
  date: number;
  blockHeight: number;
  otherParams: any;
};
