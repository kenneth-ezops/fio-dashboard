import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from './InputActionButtons.module.scss';

type ClearButtonProps = {
  isBW?: boolean;
  disabled?: boolean;
  inputType?: string;
  onClear: () => void;
  onClose?: (val: boolean) => void;
};

type ShowPasswordIconProps = {
  disabled?: boolean;
  showPass: boolean;
  toggleShowPass: (val: boolean) => void;
};

type CopyButtonProps = {
  onClick: () => void;
};

type DefaultProps = {
  isVisible: boolean;
  uiType?: string;
};

export const PasteButton: React.FC<CopyButtonProps & DefaultProps> = ({
  onClick,
  uiType,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon={{ prefix: 'far', iconName: 'clipboard' }}
      className={classnames(classes.inputIcon, uiType && classes[uiType])}
      onClick={onClick}
    />
  );
};

export const ClearButton: React.FC<ClearButtonProps & DefaultProps> = ({
  isVisible,
  inputType,
  uiType,
  disabled,
  isBW,
  onClear,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon="times-circle"
      className={classnames(
        classes.inputIcon,
        inputType === 'password' && classes.doubleIcon,
        isBW && classes.bw,
        disabled && classes.disabled,
        uiType && classes[uiType],
      )}
      onClick={() => {
        if (disabled) return;
        onClear();
        if (onClose) {
          onClose(false);
        }
      }}
    />
  );
};

export const ShowPasswordIcon: React.FC<ShowPasswordIconProps &
  DefaultProps> = ({
  isVisible,
  uiType,
  disabled,
  showPass,
  toggleShowPass,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon={!showPass ? 'eye' : 'eye-slash'}
      className={classnames(
        classes.inputIcon,
        disabled && classes.disabled,
        uiType && classes[uiType],
      )}
      onClick={() => !disabled && toggleShowPass(!showPass)}
    />
  );
};
