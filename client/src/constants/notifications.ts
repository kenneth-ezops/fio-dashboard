export const NOTIFICATIONS_CONTENT_TYPE = {
  RECOVERY_PASSWORD: 'RECOVERY_PASSWORD',
  ACCOUNT_CONFIRMATION: 'ACCOUNT_CONFIRMATION',
  ACCOUNT_CREATE: 'ACCOUNT_CREATE',
  CART_TIMEOUT: 'CART_TIMEOUT',
};

export const NOTIFICATIONS_CONTENT: {
  [contentType: string]: { [key: string]: string };
} = {
  [NOTIFICATIONS_CONTENT_TYPE.RECOVERY_PASSWORD]: {
    title: 'Password Recovery',
    message:
      'You have skipped setting up password recovery, Please make sure to complete this so you do not loose access',
  },
  [NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CONFIRMATION]: {
    title: 'Account Confirmation',
    message: 'Your email is confirmed',
  },
  [NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CREATE]: {
    title: 'Account Created',
    message: "You're all set to start managing FIO Addresses and Domains.",
  },
  [NOTIFICATIONS_CONTENT_TYPE.CART_TIMEOUT]: {
    title: 'Cart was emptied',
    message: 'Your cart was emptied due to inactivity',
  },
};

export const getDefaultContent = (contentType: string, key: string): string => {
  if (NOTIFICATIONS_CONTENT[contentType]) {
    return NOTIFICATIONS_CONTENT[contentType][key] || '';
  }

  return '';
};