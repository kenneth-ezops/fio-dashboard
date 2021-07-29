import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { ErrorBadge } from './ErrorBadge';
import { ClearInput, CopyButton, ShowPassword } from './InputActionButtons';

import classes from './Input.module.scss';

export const INPUT_UI_STYLES = {
  BLACK_LIGHT: 'blackLight',
  BLACK_WHITE: 'blackWhite',
};

type Props = {
  hideError?: boolean;
  input: any;
  loading?: boolean;
  lowerCased: boolean;
  meta: any;
  onClose?: (flag: boolean) => void;
  showClearInput?: boolean;
  showCopyButton?: boolean;
  suffix?: string;
  type: string;
  uiType?: string;
};

const InputRedux: React.FC<Props> = props => {
  const {
    hideError,
    input,
    loading,
    lowerCased,
    meta,
    onClose,
    showClearInput,
    showCopyButton,
    suffix = '',
    type,
    uiType,
    ...rest
  } = props;

  const { onChange, value } = input;
  const {
    error,
    touched,
    active,
    modified,
    submitError,
    modifiedSinceLastSubmit,
    submitSucceeded,
  } = meta;

  const [showPass, toggleShowPass] = useState(false);
  const [clearInput, toggleClearInput] = useState(
    showClearInput && value !== '',
  );

  useEffect(() => {
    if (showClearInput) {
      toggleClearInput(value !== '');
    }
  });

  const onClearInputClick = () => {
    onClose && onClose(false);
    onChange('');
  };

  const onShowPassClick = () => {
    toggleShowPass(!showPass);
  };

  const hasError =
    (error && (touched || modified || submitSucceeded) && !active) ||
    (submitError && !modifiedSinceLastSubmit);

  return (
    <div className={classes.regInputWrapper}>
      <div className={classes.inputGroup}>
        {suffix && (
          <div
            className={classnames(classes.suffix, hasError && classes.error)}
          >
            {suffix}
          </div>
        )}
        <input
          className={classnames(
            classes.regInput,
            hasError && classes.error,
            uiType && classes[uiType],
            suffix && classes.suffixSpace,
            type === 'password' && classes.doubleIconInput,
          )}
          {...input}
          {...rest}
          onChange={e => {
            const currentValue = e.target.value;
            if (lowerCased) return onChange(currentValue.toLowerCase());
            onChange(currentValue);
          }}
          type={showPass ? 'text' : type}
          data-clear={clearInput || showCopyButton}
        />
        {(clearInput || onClose) && !loading && (
          <ClearInput onClick={onClearInputClick} type={type} uiType={uiType} />
        )}
        {clearInput && type === 'password' && (
          <ShowPassword
            showPass={showPass}
            onClick={onShowPassClick}
            uiType={uiType}
          />
        )}
        {showCopyButton && (
          <CopyButton
            onClick={() => console.log('click')} // todo: set action
            uiType={uiType}
          />
        )}
        {loading && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={classnames(classes.inputIcon, classes.inputSpinnerIcon)}
          />
        )}
      </div>
      {!hideError && (
        <ErrorBadge
          error={error}
          hasError={hasError}
          submitError={submitError}
        />
      )}
    </div>
  );
};

export default InputRedux;
