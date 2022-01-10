import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import {
  fioAddressExistsValidator,
  matchFieldValidator,
  isNumberValidator,
} from '../../../../util/validators';

const MAX_MEMO_SIZE = 20;

const validationSchema: ValidationSchema = {
  field: {
    payeeFioAddress: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
    payerFioAddress: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: matchFieldValidator,
        customArgs: { fieldId: 'payeeFioAddress', isMatch: false },
        message: 'FIO Crypto Handle cannot be same.',
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
    tokenCode: [Validators.required],
    chainCode: [Validators.required],
    memo: [
      {
        validator: Validators.maxLength,
        customArgs: { length: MAX_MEMO_SIZE },
        message: 'Please enter valid memo, the max length is {{length}}',
        // todo: Max length has to be computed on the total size of the encrypted data as for /new_funds_request
      },
    ],
  },
};

const onSubmitValidationSchema: ValidationSchema = {
  field: {
    payerFioAddress: [
      {
        validator: fioAddressExistsValidator,
        customArgs: { fieldIdToCompare: 'payeeTokenPublicAddress' },
        message: 'Please enter valid FIO Crypto Handle.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
export const submitValidation = createFinalFormValidation(
  onSubmitValidationSchema,
);
