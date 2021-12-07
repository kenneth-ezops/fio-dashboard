import Base from '../Base';

import { NewDeviceTwoFactor } from '../../models';

export default class NewDeviceTwoFactorDelete extends Base {
  static get validationRules() {
    return {
      voucherId: ['required', 'string'],
    };
  }
  async execute({ voucherId }) {
    const newDeviceTwoFactor = await NewDeviceTwoFactor.getItem({
      userId: this.context.id,
      voucherId,
    });
    if (!newDeviceTwoFactor) return { data: null };

    await newDeviceTwoFactor.destroy({ force: true });

    return { data: null };
  }

  static get paramsSecret() {
    return ['voucherId'];
  }

  static get resultSecret() {
    return [];
  }
}
