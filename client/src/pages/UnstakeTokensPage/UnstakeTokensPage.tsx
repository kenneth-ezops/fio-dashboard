import React, { useState, useEffect } from 'react';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import UnstakeTokensForm from './components/UnstakeTokensForm';
import UnstakeTokensEdgeWallet from './components/UnstakeTokensEdgeWallet';
import StakeTokensResults from '../../components/common/TransactionResults/components/StakeTokensResults';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import InfoBadge from '../../components/InfoBadge/InfoBadge';

import { putParamsToUrl } from '../../utils';
import { convertFioPrices } from '../../util/prices';
import { useFioAddresses } from '../../util/hooks';

import { DEFAULT_ACTION_FEE_AMOUNT, TrxResponse } from '../../api/fio';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { WALLET_CREATED_FROM } from '../../constants/common';

import { ContainerProps, StakeTokensValues, InitialValues } from './types';
import { ResultsData } from '../../components/common/TransactionResults/types';

import classes from './styles/UnstakeTokensPage.module.scss';

const UnstakeTokensPage: React.FC<ContainerProps> = props => {
  const {
    fioWallet,
    balance,
    loading,
    roe,
    history,
    refreshBalance,
    refreshWalletDataPublicKey,
  } = props;

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [
    stakeTokensData,
    setStakeTokensData,
  ] = useState<StakeTokensValues | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const [walletFioAddresses] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  useEffect(() => {
    setStakeTokensData(null);
  }, []);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

  const onStakeTokens = async (values: StakeTokensValues) => {
    setStakeTokensData({ ...values });
  };
  const onCancel = () => {
    setStakeTokensData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponse & { bundlesCollected?: number }) => {
    setStakeTokensData(null);
    setProcessing(false);
    setResultsData({
      feeCollected: convertFioPrices(res.fee_collected, roe),
      bundlesCollected: res.bundlesCollected,
      name: fioWallet.publicKey,
      publicKey: fioWallet.publicKey,
      other: {
        ...stakeTokensData,
        ...res,
      },
    });
    refreshWalletDataPublicKey(fioWallet.publicKey);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };
  const onResultsClose = (isOpenLockedList: boolean) => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, { publicKey: fioWallet.publicKey }),
      {
        isOpenLockedList,
      },
    );
  };

  if (!fioWallet || !fioWallet.id || fioWallet.balance === null)
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        <FioLoader />
      </div>
    );

  const onBack = () =>
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
      }),
    );

  const initialValues: InitialValues = {
    publicKey: fioWallet.publicKey,
    fioAddress: walletFioAddresses[0]?.name,
  };

  if (resultsData)
    return (
      <StakeTokensResults
        results={resultsData}
        title={
          resultsData.error ? 'FIO Tokens not Unstaked' : 'FIO Tokens Unstaked'
        }
        labelAmount="Unstaking Information"
        titleAmount="Amount Unstaked"
        onClose={onResultsClose.bind(null, false)}
        onRetry={onResultsRetry}
        topElement={
          <InfoBadge
            show={true}
            type={BADGE_TYPES.INFO}
            title="Unstaking Reward Amount"
            message="The rewards amount of FIO Tokens will be locked for 7 days before it can be transferred or staked again"
          />
        }
        bottomElement={
          <SubmitButton
            onClick={onResultsClose.bind(null, true)}
            text="View Lock Status"
            withTopMargin
            variant="light"
            isSecondary
          />
        }
      />
    );

  return (
    <>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <UnstakeTokensEdgeWallet
          fioWallet={fioWallet}
          onCancel={onCancel}
          onSuccess={onSuccess}
          sendData={stakeTokensData}
          processing={processing}
          setProcessing={setProcessing}
        />
      ) : null}

      <PseudoModalContainer
        title="Unstake FIO Tokens"
        onBack={onBack || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>

        <UnstakeTokensForm
          balance={balance}
          loading={loading || processing}
          fioAddresses={walletFioAddresses}
          onSubmit={onStakeTokens}
          fee={convertFioPrices(DEFAULT_ACTION_FEE_AMOUNT, roe)}
          initialValues={initialValues}
        />
      </PseudoModalContainer>
    </>
  );
};

export default UnstakeTokensPage;