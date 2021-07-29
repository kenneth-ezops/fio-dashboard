import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../Cart/CartItem';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { totalCost } from '../../utils';

import classes from './CheckoutPurchaseContainer.module.scss';

const RenderTotalBadge = ({ costFio, costUsdc, costFree }) => (
  <PriceBadge
    costFio={costFio}
    costFree={costFree}
    costUsdc={costUsdc}
    title="Total Cost"
    type={BADGE_TYPES.BLACK}
  />
);

export const RenderCheckout = props => {
  const { cart, currentWallet } = props;
  const { costFio, costUsdc, costFree } = totalCost(cart);

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Purchase Details</h6>
        {!isEmpty(cart) &&
          cart.map(item => <CartItem item={item} key={item.id} />)}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Payment Details</h6>
        <RenderTotalBadge
          costFio={costFio}
          costUsdc={costUsdc}
          costFree={costFree}
        />
        <PayWithBadge
          costFree={costFree}
          costFio={costFio}
          costUsdc={costUsdc}
          currentWallet={currentWallet}
        />
      </div>
    </>
  );
};

export const RenderPurchase = props => {
  const { hasErrors, regItems, errItems } = props;

  const {
    costFio: regCostFio,
    costUsdc: regCostUsdc,
    costFree: regFree,
  } = totalCost(regItems);

  const {
    costFio: errCostFio,
    costUsdc: errCostUsdc,
    costFree: errFree,
  } = totalCost(errItems);

  let customTitle = 'Total Cost',
    customType = BADGE_TYPES.BLACK,
    totalSubtitle = 'Payment Details';

  if (hasErrors) {
    customTitle = 'Total Cost Remaining';
    customType = BADGE_TYPES.ERROR;
    totalSubtitle = 'Purchase Details';
  }

  const allErrored = isEmpty(regItems) && !isEmpty(errItems);

  return (
    <>
      {!isEmpty(regItems) && (
        <div className={classes.details}>
          <h5 className={classes.completeTitle}>Purchases Completed</h5>
          <h6 className={classes.subtitle}>Purchase Details</h6>
          {regItems.map(item => (
            <CartItem item={item} key={item.id} />
          ))}
          <RenderTotalBadge
            costFio={regCostFio}
            costUsdc={regCostUsdc}
            costFree={regFree}
          />
        </div>
      )}
      {hasErrors && (
        <>
          <Badge type={BADGE_TYPES.ERROR} show>
            <div className={classes.errorContainer}>
              <div className={classes.textContainer}>
                <FontAwesomeIcon
                  icon="exclamation-circle"
                  className={classes.icon}
                />
                {allErrored ? (
                  <p className={classes.text}>
                    <span className="boldText">Purchase failed!</span> - Your
                    purchase has failed due to an error. Your funds remain in
                    your account and your registrations did not complete. Please
                    try again later.
                  </p>
                ) : (
                  <p className={classes.text}>
                    <span className="boldText">Incomplete Purchase!</span> -
                    Your purchase was not completed in full. Please see below
                    what failed to be completed.
                  </p>
                )}
              </div>
            </div>
          </Badge>
          <div className={classes.details}>
            <h5 className={classnames(classes.completeTitle, classes.second)}>
              Purchases Not Completed
            </h5>
            <h6 className={classes.subtitle}>{totalSubtitle}</h6>
            {errItems.map(item => (
              <CartItem item={item} key={item.id} />
            ))}
            {!errFree && !allErrored && (
              <PriceBadge
                costFio={errCostFio}
                costUsdc={errCostUsdc}
                costFree={errFree}
                title={customTitle}
                type={customType}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};
