import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEmpty from 'lodash/isEmpty';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import FioName from '../../components/common/FioName/FioName';
import NFTTokenBadge from '../../components/Badges/TokenBadge/NFTTokenBadge';

import { ROUTES } from '../../constants/routes';

import { nftId } from '../../util/nft';

import { NFTTokenDoublet } from '../../types';

import classes from './FioAddressSignaturesPage.module.scss';

type Props = {
  getSignaturesFromFioAddress: (fioAddress: string) => void;
  nftSignatures: NFTTokenDoublet[];
  loading: boolean;
  match: {
    params: { address: string };
  };
};

const FioAddressSignaturesPage: React.FC<Props> = props => {
  const {
    nftSignatures,
    getSignaturesFromFioAddress,
    loading,
    match: {
      params: { address },
    },
  } = props;
  useEffect(() => {
    getSignaturesFromFioAddress(address);
  }, [getSignaturesFromFioAddress]);

  return (
    <PseudoModalContainer
      title="NFT Signatures"
      link={ROUTES.FIO_ADDRESSES}
      fullWidth={true}
    >
      <div className={classes.container}>
        <p className={classes.subTitleSection}>
          Introducing NFT Signatures. You can now sign your NFT with your FIO
          Address to prevent forgeries.
          <a
            href="https://fioprotocol.atlassian.net/wiki/spaces/FC/pages/113606966/NFT+Digital+Signature"
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            More information...
          </a>
        </p>

        <div className={classes.actionContainer}>
          <FioName name={address} />
          <div className={classes.buttonsContainer}>
            <Link
              to={`${ROUTES.FIO_ADDRESS_SIGN}`.replace(':address', address)}
              className={classes.link}
            >
              <Button>
                <FontAwesomeIcon icon="pen" className={classes.icon} /> Sign NFT
              </Button>
            </Link>
          </div>
        </div>
        <h5 className={classes.subTitle}>Signed NFTs</h5>

        <div className={classes.list}>
          {!isEmpty(nftSignatures) ? (
            nftSignatures.map(item => {
              const { chainCode, tokenId, contractAddress } = item;
              const id = nftId(chainCode, tokenId, contractAddress);
              return (
                <NFTTokenBadge
                  key={id}
                  id={id}
                  chainCode={chainCode}
                  tokenId={tokenId}
                  name={address}
                  contractAddress={contractAddress}
                />
              );
            })
          ) : loading ? (
            <FontAwesomeIcon icon="spinner" spin className={classes.spinner} />
          ) : (
            <div className={classes.infoBadge}>
              <FontAwesomeIcon
                icon="exclamation-circle"
                className={classes.infoIcon}
              />
              <h5 className={classes.infoTitle}>No Signatures</h5>
              <p className={classes.infoText}>
                You have no NFT signatures for this
              </p>
            </div>
          )}
        </div>
      </div>
    </PseudoModalContainer>
  );
};

export default FioAddressSignaturesPage;
