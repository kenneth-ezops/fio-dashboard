import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { passwordRecoveryAnswerValidator } from '../../util/validators';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    recoveryQuestionOne: [
      {
        validator: Validators.required,
        message: 'Please Select Question',
      },
    ],
    recoveryQuestionTwo: [
      {
        validator: Validators.required,
        message: 'Please Select Question',
      },
    ],
    recoveryAnswerOne: [
      {
        validator: Validators.required,
        message: 'Answer Field Should be Filled',
      },
      { validator: passwordRecoveryAnswerValidator },
    ],
    recoveryAnswerTwo: [
      {
        validator: Validators.required,
        message: 'Answer Field Should be Filled',
      },
      { validator: passwordRecoveryAnswerValidator },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
