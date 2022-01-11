import React, { useState, useEffect } from 'react';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import SendTokensForm from './components/SendTokensForm';
import SendEdgeWallet from './components/SendEdgeWallet';
import TokenTransferResults from '../../components/common/TransactionResults/components/TokenTransferResults';

import { putParamsToUrl } from '../../utils';
import { fioAddressToPubKey } from '../../util/fio';

import { ContainerProps, SendTokensValues } from './types';
import { FioAddressDoublet } from '../../types';
import { TrxResponse } from '../../api/fio';
import { ResultsData } from '../../components/common/TransactionResults/types';

import apis from '../../api';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { WALLET_CREATED_FROM } from '../../constants/common';

import { useFioAddresses } from '../../util/hooks';

import classes from './styles/SendPage.module.scss';
import { setFees } from '../../util/prices';

const SendPage: React.FC<ContainerProps> = props => {
  const {
    fioWallet,
    fioAddresses,
    balance,
    loading,
    feePrice,
    roe,
    history,
    refreshBalance,
    getFee,
  } = props;

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [sendData, setSendData] = useState<SendTokensValues | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  useFioAddresses();

  useEffect(() => {
    getFee();
    setSendData(null);
  }, []);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

  const onSend = async (values: SendTokensValues) => {
    const newSendData = { ...values };
    const pubKey = await fioAddressToPubKey(newSendData.to);
    if (pubKey) {
      newSendData.receiverFioAddress = values.to;
      newSendData.to = pubKey;
    }
    newSendData.amount = apis.fio.amountToSUF(newSendData.amount);
    setSendData(newSendData);
  };
  const onCancel = () => {
    setSendData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponse) => {
    setSendData(null);
    setProcessing(false);
    setResultsData({
      feeCollected: setFees(res.fee_collected, roe),
      name: fioWallet.publicKey,
      publicKey: fioWallet.publicKey,
      other: { ...sendData, ...res },
    });
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };
  const onResultsClose = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, { publicKey: fioWallet.publicKey }),
    );
  };

  if (!fioWallet || !fioWallet.id)
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        <FioLoader />
      </div>
    );

  const backTo = putParamsToUrl(ROUTES.FIO_WALLET, {
    publicKey: fioWallet.publicKey,
  });
  const walletFioAddresses = fioAddresses
    .filter(
      ({ walletPublicKey }: FioAddressDoublet) =>
        fioWallet.publicKey === walletPublicKey,
    )
    .sort((fioAddress1: FioAddressDoublet, fioAddress2: FioAddressDoublet) =>
      fioAddress1.name > fioAddress2.name ? 1 : -1,
    );

  const renderInfoBadge = () =>
    fioAddresses.length ? (
      <InfoBadge
        type={BADGE_TYPES.INFO}
        show={true}
        title="Sending FIO Crypto Handle"
        message="You may use any of your FIO Crypto Handles associated with this wallet to send FIO Tokens"
      />
    ) : null;

  if (resultsData)
    return (
      <TokenTransferResults
        results={resultsData}
        title={resultsData.error ? 'FIO Tokens not Sent' : 'FIO Tokens Sent'}
        roe={roe}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  return (
    <>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <SendEdgeWallet
          fioWallet={fioWallet}
          fee={feePrice.nativeFio}
          onCancel={onCancel}
          onSuccess={onSuccess}
          sendData={sendData}
          processing={processing}
          setProcessing={setProcessing}
        />
      ) : null}

      <PseudoModalContainer
        title="Send FIO Tokens"
        link={backTo || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>

        {renderInfoBadge()}

        <SendTokensForm
          fioWallet={fioWallet}
          balance={balance}
          loading={loading || processing}
          fioAddresses={walletFioAddresses}
          onSubmit={onSend}
          fee={feePrice}
          obtDataOn={true}
        />
      </PseudoModalContainer>
    </>
  );
};

export default SendPage;
