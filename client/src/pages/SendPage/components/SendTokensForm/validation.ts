import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  fioAddressExistsValidator,
  isFioAddressValidator,
  matchFieldValidator,
  isNumberValidator,
} from '../../../../util/validators';

import { MAX_MEMO_SIZE } from '../../../../constants/fio';

const validationSchema: ValidationSchema = {
  field: {
    from: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
    to: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: matchFieldValidator,
        customArgs: { fieldId: 'from', isMatch: false },
        message: 'FIO Crypto Handle cannot be same.',
      },
      {
        validator: isFioAddressValidator,
        message: 'Please enter valid FIO Crypto Handle / Public Key.',
      },
    ],
    amount: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: isNumberValidator,
        message: 'Please enter valid amount.',
      },
    ],
    memo: [
      {
        validator: Validators.maxLength,
        customArgs: { length: MAX_MEMO_SIZE },
        message: 'Please enter valid memo, the max length is {{length}}',
      },
    ],
  },
};

const onSubmitValidationSchema: ValidationSchema = {
  field: {
    to: [
      {
        validator: fioAddressExistsValidator,
        customArgs: {
          fieldIdToCompare: 'fromPubKey',
          sameWalletMessage: 'Spend to self.',
        },
        message: 'Please enter existing FIO Crypto Handle / Public Key.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
export const submitValidation = createFinalFormValidation(
  onSubmitValidationSchema,
);
