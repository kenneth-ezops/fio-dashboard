import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Modal from '../../../components/Modal/Modal';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import { TITLE_NAME } from '../constant';

import { NFTTokenDoublet, CommonObjectProps } from '../../../types';
import { NftValidationFormValues } from './types';

import classes from './NftValidationItemModal.module.scss';

type Props = {
  show: boolean;
  resultItem: NFTTokenDoublet;
  onClose: () => void;
  searchParams: NftValidationFormValues;
};

const NftValidationItemModal: React.FC<Props> = props => {
  const { show, onClose, resultItem, searchParams } = props;

  const searchParamObj: CommonObjectProps =
    (searchParams != null && { ...searchParams }) || {};
  delete searchParamObj.chainCode;
  delete searchParamObj.tokenId;

  const titleObj = Object.keys(searchParamObj)[0];

  const resultItemToRender: CommonObjectProps = { ...resultItem };
  delete resultItemToRender[titleObj];

  const renderBadge = () => {
    const itemValues: {
      title: string;
      value: string;
      isSmall?: boolean;
    }[] = Object.keys(resultItemToRender).map(key => {
      const objValue = resultItemToRender[key];
      if (key === 'metadata') {
        const creatorUrl = (() => {
          try {
            return JSON.parse(objValue).creator_url;
          } catch (err) {
            return '';
          }
        })();
        return { title: 'Creator URL', value: creatorUrl };
      }
      if (key === TITLE_NAME.chainCode.id || key === TITLE_NAME.tokenId.id) {
        return {
          title: TITLE_NAME[key].name,
          value: objValue,
          isSmall: true,
        };
      }
      return {
        title: TITLE_NAME[key].name,
        value: objValue,
      };
    });

    return itemValues.map(item => {
      const { title, value, isSmall } = item;
      return (
        <div
          key={title + value}
          className={classnames(
            classes.badgeContainer,
            isSmall && classes.isSmall,
          )}
        >
          <Badge show={true} type={BADGE_TYPES.WHITE}>
            <div className={classes.contentContainer}>
              <h5 className={classes.contentTitle}>{title}</h5>
              <p className={classes.contentValue}>{value || '-'}</p>
            </div>
          </Badge>
        </div>
      );
    });
  };

  return (
    <Modal
      show={show}
      closeButton={true}
      onClose={onClose}
      isSimple={true}
      isWide={true}
    >
      <div className={classes.container}>
        <h3 className={classes.title}>NFT Signature Information</h3>
        <div className={classes.subtitleContainer}>
          <h5 className={classes.subtitle}>{TITLE_NAME[titleObj].name}</h5>
          <p className={classes.searchParam}>{searchParamObj[titleObj]}</p>
        </div>
        <div className={classes.itemContainer}>{renderBadge()}</div>
        <Button onClick={onClose} className={classes.button}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default NftValidationItemModal;