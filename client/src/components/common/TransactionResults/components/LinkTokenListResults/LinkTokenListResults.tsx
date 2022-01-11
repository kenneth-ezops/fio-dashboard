import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Results from '../../Results';
import TokenBadge from '../../../../Badges/TokenBadge/TokenBadge';
import FioName from '../../../FioName/FioName';
import BundledTransactionBadge from '../../../../Badges/BundledTransactionBadge/BundledTransactionBadge';

import { genericTokenId } from '../../../../../util/fio';
import { ROUTES } from '../../../../../constants/routes';
import { ERROR_TYPES } from '../../constants';
import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../../../../constants/fio';

import { CONTAINER_NAMES } from '../../../../LinkTokenList/constants';

import { LinkActionResult, PublicAddressDoublet } from '../../../../../types';

import classes from '../../styles/LinkTokenListResults.module.scss';

const CONTAINER_TYPES = {
  [CONTAINER_NAMES.DELETE]: {
    title: 'Public Address Deletion Complete',
    subtitle: 'Links Deleted',
    errorTitle: 'Public Address Deletion Error',
    actionText: 'Delete Additional Tokens',
    errorType: ERROR_TYPES.DELETE_TOKEN_ERROR,
    errorPartialType: ERROR_TYPES.DELETE_TOKEN_PARTIAL_ERROR,
  },
  [CONTAINER_NAMES.EDIT]: {
    title: 'Public Address Edits Complete',
    subtitle: 'Links Edited',
    errorTitle: 'Public Address Edits Error',
    actionText: 'Edit Additional Tokens',
    errorType: ERROR_TYPES.EDIT_TOKEN_ERROR,
    errorPartialType: ERROR_TYPES.EDIT_TOKEN_PARTIAL_ERROR,
  },
  [CONTAINER_NAMES.ADD]: {
    title: 'New Public Address(es) Linked',
    subtitle: 'Linking Information',
    errorTitle: 'New Public Address(es) Link Error',
    actionText: 'Link Additional Tokens',
    errorType: ERROR_TYPES.ADD_TOKEN_ERROR,
    errorPartialType: ERROR_TYPES.ADD_TOKEN_PARTIAL_ERROR,
  },
};

const renderTokens = (tokens: PublicAddressDoublet[], subtitle: string) => (
  <>
    <h5 className={classes.subtitle}>{subtitle}</h5>
    {tokens.map(token => (
      <TokenBadge
        {...token}
        key={genericTokenId(
          token.chainCode,
          token.tokenCode,
          token.publicAddress,
        )}
      />
    ))}
  </>
);

const RenderBottomElement: React.FC<{
  onClick: () => void;
  containerName: string;
}> = ({ onClick, containerName }) => (
  <p className={classes.actionElement} onClick={onClick}>
    {CONTAINER_TYPES[containerName].actionText}
  </p>
);

export type ResultsProps = {
  containerName: string;
  results: LinkActionResult;
  bundleCost: number;
  remaining: number;
  name: string;
  changeBundleCost: (bundleCost: number) => void;
  onBack: () => void;
  onRetry: () => void;
};

type Props = {
  walletPublicKey: string;
  getFioAddresses: (publicKey: string) => void;
  updatePublicAddresses: (
    fioAddress: string,
    updPublicAddresses: {
      addPublicAddresses: PublicAddressDoublet[];
      deletePublicAddresses: PublicAddressDoublet[];
    },
  ) => void;
};

const LinkTokenListResults: React.FC<ResultsProps & Props> = props => {
  const {
    containerName,
    results,
    bundleCost,
    remaining,
    name,
    walletPublicKey,
    changeBundleCost,
    onBack,
    onRetry,
    getFioAddresses,
    updatePublicAddresses,
  } = props;

  const {
    connect: {
      updated: updateConnect,
      failed: failedConnect,
      error: errorConnect,
    },
    disconnect: {
      updated: updateDisconnect,
      failed: failedDisconnect,
      error: errorDisconnect,
    },
  } = results;

  const updated = updateConnect.length > 0 ? updateConnect : updateDisconnect;
  const failed = failedConnect.length > 0 ? failedConnect : failedDisconnect;
  const error = errorConnect || errorDisconnect;

  useEffect(() => {
    if (failed.length > 0 && updated.length > 0)
      changeBundleCost(
        bundleCost -
          Math.ceil(failed.length / ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION),
      );
  }, [JSON.stringify(failed)]);

  useEffect(() => {
    if (walletPublicKey) {
      getFioAddresses(walletPublicKey);
      updatePublicAddresses(name, {
        addPublicAddresses: updateConnect,
        deletePublicAddresses: updateDisconnect,
      });
    }
  }, [JSON.stringify(results)]);

  const isPartialErrored = updated.length > 0 && failed.length > 0;

  const title =
    isPartialErrored || !error
      ? CONTAINER_TYPES[containerName].title
      : CONTAINER_TYPES[containerName].errorTitle;

  const errorType = isPartialErrored
    ? CONTAINER_TYPES[containerName].errorPartialType
    : CONTAINER_TYPES[containerName].errorType;

  const history = useHistory();

  const onClose = () => history.push(`${ROUTES.LINK_TOKEN_LIST}/${name}`);

  return (
    <Results
      title={title}
      fullWidth={true}
      bottomElement={
        <RenderBottomElement onClick={onBack} containerName={containerName} />
      }
      onClose={onClose}
      onRetry={onRetry}
      results={{ updated, failed, error }}
      errorType={errorType}
    >
      <div className={classes.container}>
        <div className={classes.nameContainer}>
          <FioName name={name} />
        </div>
        {updated &&
          renderTokens(updated, CONTAINER_TYPES[containerName].subtitle)}

        {error && renderTokens(failed, 'Errored Links')}
        {updated.length > 0 && (
          <BundledTransactionBadge bundles={bundleCost} remaining={remaining} />
        )}
      </div>
    </Results>
  );
};

export default LinkTokenListResults;