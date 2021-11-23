import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import PseudoModalContainer from '../PseudoModalContainer';
import SignNFTForm from './components/SignNftForm/SignNftForm';
import SignResults from '../common/TransactionResults/components/SignResults';
import EdgeConfirmAction from '../EdgeConfirmAction';

import { ROUTES } from '../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { putParamsToUrl } from '../../utils';

import apis from '../../api';

import { NFTTokenDoublet } from '../../types';
import { ContainerProps, NftFormValues } from './types';
import { ResultsData } from '../common/TransactionResults/types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

const BUNDLE_COST = 2;

const SignNft: React.FC<ContainerProps> = props => {
  const {
    backTo,
    initialValues,
    fioAddresses,
    fioWallets,
    fioAddressName,
    getFee,
    isEdit,
    addressSelectOff,
    refreshFioNames,
    getNFTSignatures,
  } = props;

  const history = useHistory();
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<NFTTokenDoublet | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [alreadySigned, setAlreadySigned] = useState<boolean>(false);
  const [selectedFioAddressName, setSelectedFioAddress] = useState<string>(
    fioAddressName,
  );

  const fioAddress = fioAddresses.find(
    ({ name }) => name === selectedFioAddressName,
  );
  const currentWallet = fioWallets.find(
    ({ publicKey }) => publicKey === fioAddress.walletPublicKey,
  );

  const checkNftSigned = async (
    chainCode: string,
    contractAddress: string,
    tokenId: string = '',
  ) => {
    if (isEdit) return;
    const { nfts } = await apis.fio.checkNftSigned(
      chainCode,
      contractAddress,
      tokenId,
    );
    setAlreadySigned(nfts.length > 0);
    return nfts.length > 0;
  };

  const fieldValuesChanged = () => {
    if (alreadySigned) {
      setAlreadySigned(false);
    }
  };

  useEffect(() => {
    getFee(fioAddressName);
    if (
      initialValues != null &&
      initialValues.chainCode &&
      initialValues.contractAddress &&
      !isEdit
    ) {
      checkNftSigned(
        initialValues.chainCode,
        initialValues.contractAddress,
        initialValues.tokenId,
      );
    }
  }, []);

  const submit = async ({ keys, data }: SubmitActionParams) => {
    apis.fio.setWalletFioSdk(keys);
    try {
      const result = await apis.fio.singNFT(fioAddress.name, [{ ...data }]);
      apis.fio.clearWalletFioSdk();
      return result;
    } catch (e) {
      apis.fio.clearWalletFioSdk();
      throw e;
    }
  };

  const onSubmit = async (values: NftFormValues) => {
    const nftSigned = await checkNftSigned(
      values.chainCode,
      values.contractAddress,
      values.tokenId,
    );
    if (nftSigned) return {};
    setSubmitData({
      chainCode: values.chainCode,
      contractAddress: values.contractAddress,
      tokenId: values.tokenId || '',
      url: values.url || '',
      hash: values.hash || '',
      metadata: JSON.stringify({ creator_url: values.creatorUrl || '' }),
    });
    return {};
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };
  const onSuccess = async (result: {
    fee_collected: number;
    other: { nfts: NFTTokenDoublet[] };
  }) => {
    if (result != null) {
      const { metadata, ...rest } = result.other.nfts[0];
      const creatorUrl = (() => {
        try {
          return JSON.parse(metadata).creator_url;
        } catch (err) {
          return '';
        }
      })();

      setResultsData({
        name: fioAddress.name,
        other: {
          creatorUrl,
          ...rest,
        },
      });

      refreshFioNames(fioAddress.walletPublicKey);
      getNFTSignatures({ fioAddress: fioAddress.name });
    }
    setProcessing(false);
    setSubmitData(null);
  };

  const onResultsClose = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_ADDRESS_SIGNATURES, {
        address: fioAddress.name,
      }),
    );
  };

  if (resultsData && !isEdit)
    return (
      <SignResults
        results={resultsData}
        title="Signed!"
        onClose={onResultsClose}
      />
    );

  const hasLowBalance =
    fioAddress != null ? fioAddress.remaining < BUNDLE_COST : true;

  const formProps = {
    onSubmit,
    initialValues,
    fieldValuesChanged,
    alreadySigned,
    selectedFioAddressName,
    fioAddresses,
    setSelectedFioAddress,
    bundleCost: BUNDLE_COST,
    hasLowBalance,
    processing,
    fioAddress,
    isEdit,
    addressSelectOff,
  };

  const title = isEdit ? 'Signed NFT' : 'Sign NFT';

  return (
    <>
      <EdgeConfirmAction
        action={CONFIRM_PIN_ACTIONS.SIGN_NFT}
        setProcessing={setProcessing}
        onSuccess={onSuccess}
        onCancel={onCancel}
        processing={processing}
        data={submitData}
        submitAction={submit}
        fioWalletEdgeId={currentWallet.edgeId || ''}
        edgeAccountLogoutBefore={true}
      />
      <PseudoModalContainer
        title={title}
        link={backTo || null}
        middleWidth={true}
      >
        <SignNFTForm {...formProps} />
      </PseudoModalContainer>
    </>
  );
};

export default SignNft;
