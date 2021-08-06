import React, { useState } from 'react';
import PseudoModalContainer from '../../PseudoModalContainer';
import { BADGE_TYPES } from '../../Badge/Badge';
import NotificationBadge from '../../NotificationBadge/NotificationBadge';

import { RenderAddressName } from '../FioListTokenCommonComponents'; 
import { ROUTES } from '../../../constants/routes';
import { CommonTypes } from '../types';
import classes from '../FioListToken.module.scss';

const INFO_TEXT = (
  <>
    <p>
      When you link your FIO Address to a public address for a specific token
      type, you allow others to easily send you that token to your FIO Address
      without worrying about public addresses.
    </p>
    <p>
      By default your FIO Address is not linked to any public address and can
      only be used to send and receive FIO Requests. You can change the mapping
      at any time. Just remember, once you link it anyone can see your public
      address if they know your FIO Address.
    </p>
  </>
);

const FioListTokenContainer: React.FC<CommonTypes> = props => {
  const [showBadge, toggleShowBadge] = useState(true);
  const onClose = () => toggleShowBadge(false);

  const { name } = props;
  return (
    <PseudoModalContainer
      title="Fio Address Linking"
      link={ROUTES.FIO_ADDRESSES}
    >
      <div className={classes.container}>
        <NotificationBadge
          message={INFO_TEXT}
          noDash={true}
          onClose={onClose}
          show={showBadge}
          title="What is Wallet Linking?"
          type={BADGE_TYPES.INFO}
        />
        <div className={classes.s}>
          <RenderAddressName name={name} />
        </div>
      </div>
    </PseudoModalContainer>
  );
};

export default FioListTokenContainer;
