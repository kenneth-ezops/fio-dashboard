import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { validate } from './validation';

import { PasswordFormValues } from '../../types';

import classes from '../../../WalletsPage/styles/CreateWalletForm.module.scss';

const PasswordForm: React.FC<{
  loading: boolean;
  username: string;
  onSubmit: (values: PasswordFormValues) => Promise<void>;
}> = props => {
  const { loading, username, onSubmit } = props;
  return (
    <Form onSubmit={onSubmit} validate={validate} initialValues={{ username }}>
      {(props: FormRenderProps) => (
        <form onSubmit={props.handleSubmit} className={classes.form}>
          <Field name="username" type="hidden" component={Input} />
          <Field
            label="Enter your password to access and display your private key"
            name="password"
            type="password"
            placeholder="Enter Your Password"
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            component={Input}
            disabled={loading}
          />

          <SubmitButton
            disabled={props.hasValidationErrors || props.submitting || loading}
            loading={loading}
          />
        </form>
      )}
    </Form>
  );
};

export default PasswordForm;