import { prefix } from './actions';

export const loading = state => state[prefix].loading;
export const list = state => state[prefix].list;
export const selected = state => state[prefix].selected;
