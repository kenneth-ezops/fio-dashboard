import React, { useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import classes from './FioAddressSignaturesPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import { v4 as uuidv4 } from 'uuid';
import { ROUTES } from '../../constants/routes';

type Props = {
  getSignaturesFromFioAddress: (fioAddress: string) => void;
  nftSignatures: NftItem[];
  match: {
    params: { address: string };
  };
  history: any;
  email: string;
};

const FioAddressSignaturesPage: React.FC<Props> = props => {
  const {
    nftSignatures,
    getSignaturesFromFioAddress,
    match: {
      params: { address },
    },
    history,
    email,
  } = props;
  useEffect(() => {
    getSignaturesFromFioAddress(address);
  }, [getSignaturesFromFioAddress]);
  return (
    <Container fluid className={classes.signaturesSection}>
      <Row>
        <Col className={classes.mainTitleSection}>NFT Signatures</Col>
      </Row>
      <Row>
        <Col className={classes.subTitleSection}>
          <p>
            NFT signature information of all your signed done.
            <a href="#"> More information...</a>
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg="9" className={classes.titleSection}>
          Address: {email}
        </Col>
        <Col lg="2">
          <Button
            className={classes.actionButton}
            onClick={() => {
              history.push(
                ROUTES.FIO_ADDRESS_SIGN.replace(':address', address),
              );
            }}
          >
            <FontAwesomeIcon icon="pen" className={classes.iconButton} />
            <span>Sign NFT</span>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className={classes.listTitle}>Signed NFTs</Col>
      </Row>
      {nftSignatures &&
        nftSignatures.map((item: NftItem) => {
          return (
            <Row
              key={`signature-${uuidv4()}`}
              className={classes.signatureItem}
            >
              <Col lg="auto" className={classes.signatureItemText}>
                Chain code:{' '}
                <span className={classes.signatureItemTextValue}>
                  {item.chain_code}
                </span>
              </Col>
              <Col lg="auto" className={classes.signatureItemText}>
                Token ID:{' '}
                <span className={classes.signatureItemTextValue}>
                  {item.token_id}
                </span>
              </Col>
              <Col lg="auto" className={classes.signatureItemText}>
                Contract Address:{' '}
                <span className={classes.signatureItemTextValue}>
                  {item.contract_address}
                </span>
              </Col>
              <Col lg="auto">
                <FontAwesomeIcon
                  icon="chevron-right"
                  className={classes.icon}
                />
              </Col>
            </Row>
          );
        })}
    </Container>
  );
};

export default FioAddressSignaturesPage;