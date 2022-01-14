export const prefix = 'contacts';

export const LIST_REQUEST = `${prefix}/LIST_REQUEST`;
export const LIST_SUCCESS = `${prefix}/LIST_SUCCESS`;
export const LIST_FAILURE = `${prefix}/LIST_FAILURE`;

export const getContactsList = () => ({
  types: [LIST_REQUEST, LIST_SUCCESS, LIST_FAILURE],
  promise: api => api.contacts.list(),
});

export const CREATE_REQUEST = `${prefix}/CREATE_REQUEST`;
export const CREATE_SUCCESS = `${prefix}/CREATE_SUCCESS`;
export const CREATE_FAILURE = `${prefix}/CREATE_FAILURE`;

export const createContact = name => ({
  types: [CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE],
  promise: api => api.contacts.create({ name }),
});
