import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import { useForm } from 'react-final-form';
import { ErrorBadge } from './ErrorBadge';

import classes from './Input.module.scss';
import { PIN_LENGTH } from '../../constants/form';
import { CopyButton } from './InputActionButtons';

export const INPUT_COLOR_SCHEMA = {
  BLACK_AND_WHITE: 'black_and_white',
};

export const INPUT_UI_STYLES = {
  BLACK_LIGHT: 'blackLight',
  BLACK_WHITE: 'blackWhite',
};

const regularInputWrapper = children => (
  <div className={classes.regInputWrapper}>{children}</div>
);

const Input = props => {
  const {
    input,
    meta,
    colorSchema,
    onClose,
    hideError,
    showCopyButton,
    isFree,
    tooltip,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    prefix = '',
    prefixLabel = '',
    upperCased = false,
    lowerCased = false,
    disabled,
    showErrorBorder,
    isLowHeight,
    customChange,
    previewUrl,
    ...rest
  } = props;
  const {
    error,
    data,
    touched,
    active,
    modified,
    submitError,
    modifiedSinceLastSubmit,
    submitSucceeded,
  } = meta;
  const { type, value, name, onChange } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;
  const form = useForm();
  const innerRef = useRef();

  const [showPass, toggleShowPass] = useState(false);
  const [clearInput, toggleClearInput] = useState(value !== '');
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const hasError =
    ((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) || // todo: remove !active to show red border on focused field. make debounce on create account user field
    (submitError && !modifiedSinceLastSubmit);
  useEffect(() => {
    toggleClearInput(value !== '');
  });

  const handlePinChange = (e, currentForm) => {
    if ((name === 'pin' || name === 'confirmPin') && currentForm) {
      const { key } = e;
      const { getState, change, submit } = currentForm;

      const { values, visited } = getState();
      const currentValue = values[name];
      const isActiveField = Object.keys(visited)[0] === name;

      if (isActiveField) {
        if (/\d/.test(key)) {
          const retValue = (currentValue && currentValue + key) || '';

          if (retValue && retValue.length > PIN_LENGTH) return;

          change(name, currentValue ? retValue : key);
          if (currentValue && retValue.length === PIN_LENGTH) {
            innerRef.current && innerRef.current.blur();
            return !error && submit();
          }
        }
      }
    }
  };

  const onKeyUp = e => handlePinChange(e, form);

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (name === 'pin' || name === 'confirmPin') {
      innerRef.current && innerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (name === 'pin' || name === 'confirmPin') {
      focused ? form.focus(name) : form.blur(name);
    }
  }, [focused]);

  const clearInputFn = () => {
    onChange('');
  };

  const renderPrefixLabel = () => {
    if (!prefixLabel) return null;
    if (active || !value) return null;

    return (
      <div
        className={classnames(
          classes.prefixLabel,
          classes[`prefixLabel${uiType}`],
        )}
      >
        {prefixLabel}
      </div>
    );
  };

  const regularInput = (
    <>
      <div className={classes.inputGroup}>
        {prefix && (
          <div
            className={classnames(classes.prefix, hasError && classes.error)}
          >
            {prefix}
          </div>
        )}
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && classes.error,
            uiType && classes[uiType],
            isBW && classes.bw,
            prefix && classes.prefixSpace,
            showCopyButton && classes.hasCopyButton,
            type === 'password' && classes.doubleIconInput,
            isLowHeight && classes.lowHeight,
          )}
        >
          {renderPrefixLabel()}
          <input
            disabled={disabled}
            {...input}
            {...rest}
            onChange={e => {
              const currentValue = e.target.value;
              if (lowerCased) return onChange(currentValue.toLowerCase());
              if (upperCased) return onChange(currentValue.toUpperCase());
              onChange(currentValue);
            }}
            type={showPass ? 'text' : type}
            data-clear={clearInput}
          />
        </div>
        {(clearInput || onClose) && !disabled && !loading && (
          <FontAwesomeIcon
            icon="times-circle"
            className={classnames(
              classes.inputIcon,
              type === 'password' && classes.doubleIcon,
              isBW && classes.bw,
              disabled && classes.disabled,
              uiType && classes[uiType],
            )}
            onClick={() => {
              if (disabled) return;
              clearInputFn();
              if (onClose) {
                onClose(false);
              }
            }}
          />
        )}
        {clearInput && type === 'password' && (
          <FontAwesomeIcon
            icon={!showPass ? 'eye' : 'eye-slash'}
            className={classnames(
              classes.inputIcon,
              disabled && classes.disabled,
            )}
            onClick={() => !disabled && toggleShowPass(!showPass)}
          />
        )}
        {showCopyButton && !value && (
          <CopyButton
            onClick={async () => {
              try {
                const data = await navigator.clipboard.readText();
                onChange(data);
              } catch (e) {
                console.error('Paste error: ', e);
              }
            }}
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
      {!hideError && !data.hideError && (
        <ErrorBadge
          error={error}
          data={data}
          hasError={hasError}
          type={errorType}
          color={errorColor}
          submitError={submitError}
        />
      )}
    </>
  );

  if (type === 'text') {
    return regularInputWrapper(regularInput);
  }

  if (type === 'password' && name !== 'pin') {
    return regularInputWrapper(regularInput);
  }

  if (type === 'file') {
    return (
      <div className={classes.fileContainer}>
        <input
          {...input}
          {...rest}
          onChange={customChange ? customChange : onChange}
          type={type}
          className={classes.fileInput}
        />
        {value && previewUrl ? (
          <img className={classes.image} src={previewUrl} alt="preview" />
        ) : (
          <>
            <FontAwesomeIcon icon="image" className={classes.icon} />
            <p className={classes.text}>Drop Image Here</p>
          </>
        )}
      </div>
    );
  }

  if (name === 'pin' || name === 'confirmPin') {
    const positionNumber = value.length;
    const showError = error || data.error;

    const renderDots = () => {
      const dots = [];
      for (let i = 1; i < PIN_LENGTH + 1; i++) {
        dots.push(
          <div
            key={i}
            className={classnames(
              classes.dotEmpty,
              i <= positionNumber && classes.dotFull,
              showError && classes.dotError,
            )}
          ></div>,
        );
      }
      return dots;
    };

    return (
      <>
        <div
          className={classnames(classes.pin, showError && classes.error)}
          onClick={() => innerRef.current && innerRef.current.focus()}
        >
          <input
            type="tel"
            max={PIN_LENGTH}
            {...props}
            {...input}
            className={classes.pinInput}
            id={name}
            onChange={e => {
              // fixes android backspace keyup event
              if (e.nativeEvent.inputType === 'deleteContentBackward') {
                const currentValue = e.target.value;
                onChange(currentValue);
              }
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={innerRef}
          />
          <div className={classes.dotsContainer}>{renderDots()}</div>
        </div>
        {showError && (
          <div className={classes.pinError}>
            <FontAwesomeIcon icon="info-circle" className={classes.icon} />
            {error || data.error}
          </div>
        )}
      </>
    );
  }

  return <input {...input} {...props} />;
};

export default Input;
