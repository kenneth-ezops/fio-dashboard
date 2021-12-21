import React from 'react';
import classnames from 'classnames';

import classes from './CancelButton.module.scss';

type Props = {
  onClick: () => void;
  disabled?: boolean;
  isBlack?: boolean;
  withBottomMargin?: boolean;
  isThin?: boolean;
  text?: string;
};

const CancelButton: React.FC<Props> = props => {
  const { onClick, disabled, isBlack, withBottomMargin, isThin, text } = props;

  return (
    <button
      className={classnames(
        classes.button,
        isThin && classes.thin,
        isBlack && classes.black,
        withBottomMargin && classes.bottomMargin,
      )}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {text || 'Cancel'}
    </button>
  );
};

export default CancelButton;
